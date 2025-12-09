'use client'

import { useState, useRef, useEffect } from 'react'
import { uploadFile } from '@/lib/cloudinary/upload'
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
  capturedLive?: boolean
  liveLocation?: {
    latitude: number
    longitude: number
  }
}

export default function ImageUploadForm({ onUploadComplete }: ImageUploadFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [sharedTitle, setSharedTitle] = useState('')
  const [sharedDescription, setSharedDescription] = useState('')
  const [sharedLocation, setSharedLocation] = useState('')
  const [showUploadOptions, setShowUploadOptions] = useState(false)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // Get current location
  const getCurrentLocation = (): Promise<{latitude: number, longitude: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Open camera modal
  const openCamera = async () => {
    try {
      // Request location first
      toast.loading('Requesting location access...')
      const location = await getCurrentLocation()
      setCurrentLocation(location)
      toast.dismiss()
      toast.success('Location acquired!')

      // Get location name
      const locationName = await reverseGeocode(location.latitude, location.longitude)
      if (locationName && !sharedLocation) {
        setSharedLocation(locationName)
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      })

      setCameraStream(stream)
      setShowCameraModal(true)
      setShowUploadOptions(false)

      // Set video stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch (error: any) {
      toast.dismiss()
      if (error.code === 1 || error.message.includes('denied')) {
        toast.error('Camera or location permission denied. Please allow access in your browser settings.')
      } else {
        toast.error(error.message || 'Failed to access camera or location')
      }
      console.error('Camera/Location error:', error)
    }
  }

  // Close camera modal
  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCameraModal(false)
  }

  // Capture photo from camera
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !currentLocation) return

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error('Failed to capture photo')
        return
      }

      // Create file from blob
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const file = new File([blob], `IMG_${timestamp}.jpg`, { type: 'image/jpeg' })

      // Create preview
      const preview = URL.createObjectURL(blob)

      // Get location name
      const locationName = await reverseGeocode(currentLocation.latitude, currentLocation.longitude)

      // Create file data with live capture info
      const fileData: FileWithPreview = {
        file,
        preview,
        autoDetectedLocation: locationName,
        exifData: {
          isVerified: true,
          cameraModel: 'Live Camera Capture',
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          captureDate: new Date()
        },
        isVideo: false,
        capturedLive: true,
        liveLocation: currentLocation
      }

      setSelectedFiles(prev => [...prev, fileData])
      toast.success('Photo captured!')

      // Update shared location if not set
      if (!sharedLocation && locationName) {
        setSharedLocation(locationName)
      }

      // Close camera modal
      closeCamera()
    }, 'image/jpeg', 0.95)
  }

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

        // Accept all videos - create basic EXIF data
        const videoExifData = {
          isVerified: true,
          cameraModel: 'Video Upload',
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

        toast.success(`Video ${file.name} added (${Math.round(videoData.duration)}s) ✓`)
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

        // Extract GPS data from EXIF metadata only
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

      // Require at least 3 parts (e.g., Place, District, State)
      if (locationParts.length < 3) {
        toast.error('Location must include at least: Place, District, and State (separated by commas)')
        return
      }

      // Validate that location contains a 6-digit pincode somewhere
      const hasPincode = locationParts.some(part => /\b\d{6}\b/.test(part))
      if (!hasPincode) {
        toast.error('Location must contain a valid 6-digit pincode')
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
          const uploadResult = await uploadFile(fileData.file)
          uploadedFiles.push({
            location: finalLocation, // Use final location (manual or GPS)
            r2Url: uploadResult.r2Url || uploadResult.url,
            r2Key: uploadResult.r2Key || uploadResult.publicId,
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

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/heic,image/heif,image/bmp,image/tiff,video/mp4,video/quicktime,video/x-m4v,video/3gpp,video/avi,video/mpeg,video/webm"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

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

        {/* Add Images Button */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Add Images or Videos *
          </label>
          <button
            type="button"
            onClick={() => setShowUploadOptions(true)}
            className="w-full py-4 px-6 border-2 border-dashed border-orange-300 rounded-xl text-base font-bold text-orange-600 bg-orange-50/50 hover:bg-orange-100 hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Images or Videos
          </button>
          <p className="mt-2 text-xs text-slate-500">
            Choose to upload from gallery or take a live photo with camera
          </p>
        </div>

        {/* Submit Button - Moved Below */}
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
              Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...
            </span>
          ) : (
            selectedFiles.length > 0
              ? `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''} to ${sharedTitle || 'Heritage Site'}`
              : 'Select Files to Upload'
          )}
        </button>
      </form>

      {/* Upload Options Modal */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 transform animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Choose Upload Method</h3>
              <button
                onClick={() => setShowUploadOptions(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {/* Upload from Gallery */}
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                  setShowUploadOptions(false)
                }}
                className="w-full p-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-4"
              >
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg">Upload from Gallery</div>
                  <div className="text-sm text-blue-100">Select images/videos from your device</div>
                </div>
              </button>

              {/* Take Live Photo */}
              <button
                onClick={openCamera}
                className="w-full p-4 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-4"
              >
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-lg">Take Live Photo</div>
                  <div className="text-sm text-orange-100">Capture with camera & GPS location</div>
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-4">
              Live photos will automatically capture your current location
            </p>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Camera Header */}
          <div className="bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Camera Active</span>
              {currentLocation && (
                <span className="text-green-400 text-sm">📍 GPS Locked</span>
              )}
            </div>
            <button
              onClick={closeCamera}
              className="text-white hover:text-red-400 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Camera View */}
          <div className="flex-1 relative bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Capture Button */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full bg-white border-4 border-orange-500 shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-orange-500"></div>
              </button>
            </div>

            {/* Location Info */}
            {currentLocation && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                📍 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </div>
            )}
          </div>

          {/* Hidden Canvas for Photo Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
