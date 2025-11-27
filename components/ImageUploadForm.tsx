'use client'

import { useState, useRef } from 'react'
import { uploadToR2 } from '@/lib/cloudinary/upload'
import { extractExifData, reverseGeocode } from '@/lib/utils/exif'
import toast from 'react-hot-toast'

interface ImageUploadFormProps {
  onUploadComplete?: () => void
}

interface FileWithPreview {
  file: File
  preview: string
  autoDetectedLocation: string | null
  exifData: any
  isVideo: boolean
  videoDuration?: number
}

export default function ImageUploadForm({ onUploadComplete }: ImageUploadFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [sharedTitle, setSharedTitle] = useState('')
  const [sharedDescription, setSharedDescription] = useState('')
  const [sharedLocation, setSharedLocation] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles: FileWithPreview[] = []
    const MAX_VIDEO_DURATION = 300 // 5 minutes in seconds

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')

      // Check if it's an image or video
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not an image or video file`)
        continue
      }

      // Handle video files
      if (isVideo) {
        // Check video duration and extract metadata
        const videoData = await new Promise<{duration: number, metadata: any}>((resolve) => {
          const video = document.createElement('video')
          video.preload = 'metadata'

          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src)
            resolve({
              duration: video.duration,
              metadata: {
                width: video.videoWidth,
                height: video.videoHeight,
              }
            })
          }

          video.onerror = () => {
            resolve({duration: 0, metadata: null})
          }

          video.src = URL.createObjectURL(file)
        })

        if (videoData.duration === 0) {
          toast.error(`${file.name}: Unable to read video metadata`)
          continue
        }

        if (videoData.duration > MAX_VIDEO_DURATION) {
          toast.error(`${file.name}: Video duration (${Math.round(videoData.duration)}s) exceeds 5 minute limit`)
          continue
        }

        // For videos, verify using multiple strict checks
        let videoExifData: any = {}

        // Check 1: File must be very recently created (within 7 days)
        // Phone videos are typically uploaded shortly after recording
        const now = new Date().getTime()
        const fileModified = file.lastModified
        const daysSinceModified = (now - fileModified) / (1000 * 60 * 60 * 24)

        if (daysSinceModified > 7) {
          toast.error(`${file.name}: Video must be recorded within last 7 days (this is ${Math.floor(daysSinceModified)} days old)`)
          continue
        }

        // Check 2: File size validation (phone videos are typically > 500KB)
        if (file.size < 500000) { // Less than 500KB
          toast.error(`${file.name}: Video file too small - must be at least 500KB`)
          continue
        }

        // Check 3: File naming pattern check
        // Phone videos typically have patterns like:
        // Android:
        // - VID20251107150627.mp4 (no separator)
        // - VID_20250107_123456.mp4 (with separator)
        // iPhone:
        // - IMG_1234.MOV (standard)
        // - IMG_E1234.MOV (edited)
        // - TRIM.1234.MOV (trimmed)
        // - RPReplay_Final1234567890.MOV (screen recording)
        const phoneVideoPatterns = [
          // Android patterns
          /^VID\d{8}\d{6}/i,            // VID20251107150627 (Android no separator)
          /^VID[_-]\d{8}[_-]\d{6}/i,    // VID_20250107_123456
          /^\d{8}[_-]?\d{6}/,           // 20250107_123456 or 20250107123456
          /^video[_-]?\d+/i,            // video_1234 or video1234
          /^MOV[_-]?\d{3,5}/i,          // MOV_1234 or MOV1234
          /^VID[_-]?\d{3,5}/i,          // VID_1234 or VID1234

          // iPhone patterns
          /^IMG[_-]?\d{3,5}\./i,        // IMG_1234.MOV or IMG1234.MOV
          /^IMG[_-]?E\d{3,5}\./i,       // IMG_E1234.MOV (edited on iPhone)
          /^TRIM\.\d{3,5}\./i,          // TRIM.1234.MOV (trimmed)
          /^RPReplay.*\d+/i,            // RPReplay_Final1234567890.MOV (screen recording)
          /^\d{5}APPLE/i,               // 100APPLE/IMG_0001.MOV format
          /^LivePhoto_/i,               // LivePhoto_1234.MOV
          /^Slomo_/i,                   // Slomo_1234.MOV (slow motion)
        ]

        const hasPhonePattern = phoneVideoPatterns.some(pattern => pattern.test(file.name))

        if (!hasPhonePattern) {
          toast.error(`${file.name}: Video filename doesn't match phone camera pattern (must be directly from phone camera)`)
          continue
        }

        // Check 4: File type must be standard phone video format
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-m4v', 'video/3gpp']
        if (!allowedTypes.includes(file.type)) {
          toast.error(`${file.name}: Video format not supported (must be MP4, MOV, or 3GP from phone)`)
          continue
        }

        // All checks passed - video is verified
        videoExifData = {
          isVerified: true,
          cameraModel: 'Mobile Device',
          latitude: null,
          longitude: null,
          captureDate: new Date(file.lastModified),
        }

        // Create video preview
        const preview = URL.createObjectURL(file)

        newFiles.push({
          file,
          preview,
          autoDetectedLocation: null,
          exifData: videoExifData,
          isVideo: true,
          videoDuration: videoData.duration
        })

        toast.success(`Video ${file.name} added (${Math.round(videoData.duration)}s) ✓ Verified`)
        continue
      }

      // Handle image files
      // Create preview
      const reader = new FileReader()
      const preview = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Extract EXIF data for location
      let autoDetectedLocation: string | null = null
      let exifData: any = {}

      try {
        exifData = await extractExifData(file)

        if (!exifData.isVerified) {
          toast.error(`${file.name}: Image rejected - No valid camera EXIF data (Make/Model required)`)
          continue
        }

        if (exifData.latitude && exifData.longitude) {
          const locationName = await reverseGeocode(exifData.latitude, exifData.longitude)
          if (locationName) {
            autoDetectedLocation = locationName
            // Set shared location from first image with GPS data, if not already set
            if (!sharedLocation && newFiles.length === 0) {
              setSharedLocation(locationName)
            }
          }
        }
      } catch (error) {
        toast.error(`${file.name}: Failed to extract EXIF data`)
        continue
      }

      newFiles.push({
        file,
        preview,
        autoDetectedLocation,
        exifData,
        isVideo: false
      })
    }

    setSelectedFiles(prev => [...prev, ...newFiles])

    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} file${newFiles.length > 1 ? 's' : ''} selected`)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file')
      return
    }

    if (!sharedTitle || !sharedDescription) {
      toast.error('Please fill in title and description')
      return
    }

    // Validate description word count (minimum 50 words)
    const wordCount = sharedDescription.trim().split(/\s+/).filter(word => word.length > 0).length
    if (wordCount < 50) {
      toast.error(`Description must be at least 50 words. Current: ${wordCount} words`)
      return
    }

    // Check if any file has GPS location data
    const hasGPSLocation = selectedFiles.some(f => f.autoDetectedLocation)

    // Only require manual location if no GPS data exists
    if (!hasGPSLocation && !sharedLocation) {
      toast.error('Please enter location (no GPS data found in images)')
      return
    }

    // If location is provided (either manual or GPS), validate the format
    if (sharedLocation) {
      const locationParts = sharedLocation.split(',').map(part => part.trim()).filter(part => part.length > 0)
      if (locationParts.length < 4) {
        toast.error('Location must include: Place, District, State, and Pincode (separated by commas)')
        return
      }

      // Validate that the last part (pincode) contains numbers
      const pincode = locationParts[locationParts.length - 1]
      if (!/\d{6}/.test(pincode)) {
        toast.error('Location must end with a valid 6-digit pincode')
        return
      }
    }

    setLoading(true)

    try {
      // Upload all files to R2 first
      const uploadedFiles = []
      let uploadFailures = 0

      // Use shared location if provided, otherwise use first available GPS location
      const finalLocation = sharedLocation || selectedFiles.find(f => f.autoDetectedLocation)?.autoDetectedLocation || ''

      for (const fileData of selectedFiles) {
        try {
          const uploadResult = await uploadToR2(fileData.file)
          uploadedFiles.push({
            location: finalLocation, // Use final location (manual or GPS)
            r2Url: uploadResult.r2Url,
            r2Key: uploadResult.r2Key,
            isVerified: fileData.exifData.isVerified || false,
            cameraModel: fileData.exifData.cameraModel || null,
            latitude: fileData.exifData.latitude || null,
            longitude: fileData.exifData.longitude || null,
          })
        } catch (error: any) {
          uploadFailures++
        }
      }

      if (uploadedFiles.length === 0) {
        toast.error('All file uploads failed')
        return
      }

      // Create heritage site with all files in one request
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sharedTitle,
          description: sharedDescription,
          images: uploadedFiles,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create heritage site')
      }

      toast.success(
        `Heritage site "${sharedTitle}" created with ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}!`
      )

      if (uploadFailures > 0) {
        toast.error(`${uploadFailures} file${uploadFailures > 1 ? 's' : ''} failed to upload`)
      }

      // Reset form
      setSharedTitle('')
      setSharedDescription('')
      setSharedLocation('')
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Call callback
      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload files')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-linear-to-br from-white to-orange-50 rounded-2xl shadow-xl p-8 border-2 border-orange-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-linear-to-br from-orange-500 to-amber-600 p-3 rounded-xl shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Heritage Sites</h2>
          <p className="text-sm text-slate-600">Upload multiple images with a single title and description</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shared Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-slate-900 mb-2">
            Heritage Site Title *
          </label>
          <input
            type="text"
            id="title"
            required
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium placeholder-slate-400 bg-white transition-all"
            placeholder="Enter the heritage site name"
            value={sharedTitle}
            onChange={(e) => setSharedTitle(e.target.value)}
          />
        </div>

        {/* Shared Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-slate-900 mb-2">
            Description * (Minimum 50 words)
            <span className={`ml-2 text-xs ${sharedDescription.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
              {sharedDescription.trim().split(/\s+/).filter(w => w.length > 0).length} / 50 words
            </span>
          </label>
          <textarea
            id="description"
            required
            rows={4}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium placeholder-slate-400 bg-white transition-all resize-none"
            placeholder="Describe the heritage site, its history, and significance (minimum 50 words)"
            value={sharedDescription}
            onChange={(e) => setSharedDescription(e.target.value)}
          />
        </div>

        {/* Site Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-bold text-slate-900 mb-2">
            Site Location {!selectedFiles.some(f => f.autoDetectedLocation) && '*'}
            {selectedFiles.some(f => f.autoDetectedLocation) && (
              <span className="ml-2 text-green-600 text-xs">✓ Auto-detected from GPS</span>
            )}
          </label>
          <input
            type="text"
            id="location"
            required={!selectedFiles.some(f => f.autoDetectedLocation)}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-900 font-medium placeholder-slate-400 bg-white transition-all"
            placeholder="Place, District, State, Pincode (e.g., Hampi, Vijayanagara, Karnataka, 583239)"
            value={sharedLocation}
            onChange={(e) => setSharedLocation(e.target.value)}
          />
          <p className="mt-2 text-xs text-slate-500">
            {selectedFiles.some(f => f.autoDetectedLocation)
              ? 'Location auto-detected from GPS. You can edit if needed.'
              : 'Format: Place, District, State, Pincode. This location will be used for all images.'}
          </p>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Select Images or Videos *
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-slate-900 file:mr-4 file:py-4 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-linear-to-r file:from-orange-500 file:to-amber-600 file:text-white hover:file:from-orange-600 hover:file:to-amber-700 file:transition-all file:shadow-lg file:cursor-pointer cursor-pointer border-2 border-dashed border-orange-300 rounded-xl p-4 hover:border-orange-500 transition-colors bg-orange-50/50"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Select multiple images or videos (max 5 minutes) of the same heritage site
          </p>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Selected Files ({selectedFiles.length})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedFiles.map((fileData, index) => (
                <div key={index} className="relative bg-white rounded-xl border-2 border-orange-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  {/* Preview Image or Video */}
                  <div className="relative aspect-square">
                    {fileData.isVideo ? (
                      <video
                        src={fileData.preview}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      />
                    ) : (
                      <img
                        src={fileData.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {fileData.exifData.isVerified && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* File type and info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                      <span className="text-white text-xs font-bold">
                        {fileData.isVideo ? `Video ${index + 1}` : `Image ${index + 1}`}
                      </span>
                      {fileData.isVideo && fileData.videoDuration && (
                        <span className="ml-2 text-blue-400 text-xs">
                          {Math.round(fileData.videoDuration)}s
                        </span>
                      )}
                      {!fileData.isVideo && fileData.autoDetectedLocation && (
                        <span className="ml-2 text-green-400 text-xs">📍 GPS</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">About this upload</p>
                  <p className="text-sm text-blue-800">
                    All {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} will be uploaded with the shared title, description, and location "{sharedLocation || selectedFiles.find(f => f.autoDetectedLocation)?.autoDetectedLocation || 'to be specified'}".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || selectedFiles.length === 0 || !sharedTitle || !sharedDescription || (!sharedLocation && !selectedFiles.some(f => f.autoDetectedLocation))}
          className="w-full py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}...
            </span>
          ) : (
            selectedFiles.length > 0
              ? `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''} to ${sharedTitle || 'Heritage Site'}`
              : 'Select Images to Upload'
          )}
        </button>
      </form>
    </div>
  )
}
