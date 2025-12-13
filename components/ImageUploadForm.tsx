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
  const [siteType, setSiteType] = useState('')
  const [customType, setCustomType] = useState('')
  const [referenceLinks, setReferenceLinks] = useState<string[]>([''])
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

  const addReferenceLink = () => {
    setReferenceLinks(prev => [...prev, ''])
  }

  const updateReferenceLink = (index: number, value: string) => {
    setReferenceLinks(prev => prev.map((link, i) => i === index ? value : link))
  }

  const removeReferenceLink = (index: number) => {
    setReferenceLinks(prev => prev.filter((_, i) => i !== index))
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

      const filteredReferenceLinks = referenceLinks.filter(link => link.trim() !== '')

      const finalType = siteType === 'OTHER' ? (customType || 'OTHER') : siteType

      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sharedTitle,
          description: sharedDescription,
          type: finalType || null,
          referenceLinks: filteredReferenceLinks,
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

      setSharedTitle('')
      setSharedDescription('')
      setSiteType('')
      setCustomType('')
      setReferenceLinks([''])
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
    <div className="bg-linear-to-br from-white via-orange-50/30 to-amber-50/20 rounded-xl shadow-lg p-6 md:p-8 border border-orange-100/50 backdrop-blur-sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="bg-linear-to-br from-orange-400 to-amber-500 p-3 rounded-lg shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Document Heritage Site</h2>
          <p className="text-sm text-slate-600 mt-1">Share your heritage discoveries with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shared Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5 items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Site Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-900 placeholder-slate-400 bg-white/60 hover:bg-white transition-all"
            placeholder="e.g., Ancient Temple at Hampi"
            value={sharedTitle}
            onChange={(e) => setSharedTitle(e.target.value)}
          />
        </div>

        {/* Shared Description */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Description <span className="text-red-500">*</span>
            </label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sharedDescription.trim().split(/\s+/).filter(w => w.length > 0).length >= 50 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {sharedDescription.trim().split(/\s+/).filter(w => w.length > 0).length} / 50
            </span>
          </div>
          <textarea
            id="description"
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-900 placeholder-slate-400 bg-white/60 hover:bg-white transition-all resize-none"
            placeholder="Describe the heritage site, its historical significance, architecture, and any interesting details..."
            value={sharedDescription}
            onChange={(e) => setSharedDescription(e.target.value)}
          />
        </div>

        {/* Site Type and Location in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1.5 items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Site Type
            </label>
            <select
              id="type"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-900 bg-white/60 hover:bg-white transition-all"
              value={siteType}
              onChange={(e) => {
                setSiteType(e.target.value)
                if (e.target.value !== 'OTHER') {
                  setCustomType('')
                }
              }}
            >
              <option value="">Select type</option>
              <option value="TEMPLE">🕌 Temple</option>
              <option value="FORT_PALACE">🏰 Fort / Palace</option>
              <option value="CAVES_ROCK_CUT">⛰️ Caves / Rock-Cut</option>
              <option value="RUINS">🏛️ Ruins</option>
              <option value="INSCRIPTIONS">📜 Inscriptions</option>
              <option value="ROCK_ART">🎨 Rock Art</option>
              <option value="MEGALITHIC_SITE">🗿 Megalithic Site</option>
              <option value="BURIAL_SITE">⚰️ Burial Site</option>
              <option value="WATER_STRUCTURE">💧 Water Structure</option>
              <option value="ANCIENT_SETTLEMENT">🏘️ Ancient Settlement</option>
              <option value="ARTIFACT_FOUND">🏺 Artifact Found</option>
              <option value="OTHER">📋 Other</option>
            </select>
          </div>

          {/* Site Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1.5 items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Location {!selectedFiles.some(f => f.autoDetectedLocation) && <span className="text-red-500">*</span>}
              {selectedFiles.some(f => f.autoDetectedLocation) && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">✓ GPS</span>
              )}
            </label>
            <input
              type="text"
              id="location"
              required={!selectedFiles.some(f => f.autoDetectedLocation)}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-900 placeholder-slate-400 bg-white/60 hover:bg-white transition-all"
              placeholder="Place, District, State, Pincode"
              value={sharedLocation}
              onChange={(e) => setSharedLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Custom Type Input */}
        {siteType === 'OTHER' && (
          <div className="animate-in slide-in-from-top duration-200">
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-slate-900 placeholder-slate-400 bg-white/60 hover:bg-white transition-all"
              placeholder="Specify custom type"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
            />
          </div>
        )}

        {/* Reference Links */}
        <div className="border-t border-slate-200 pt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2 items-center gap-1.5">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Reference Links <span className="text-slate-400 text-xs font-normal">(Optional)</span>
          </label>
          <div className="space-y-2">
            {referenceLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm text-slate-900 placeholder-slate-400 bg-white/60 hover:bg-white transition-all"
                  placeholder="https://en.wikipedia.org/wiki/..."
                  value={link}
                  onChange={(e) => updateReferenceLink(index, e.target.value)}
                />
                {referenceLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeReferenceLink(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addReferenceLink}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1.5 hover:gap-2 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Link
            </button>
          </div>
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
          <div className="bg-linear-to-br from-slate-50 to-blue-50/30 rounded-lg p-4 space-y-3 border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-1.5 rounded">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} selected
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFiles([])}
                className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {selectedFiles.map((fileData, index) => (
                <div key={index} className="relative bg-white rounded-lg border border-slate-200 overflow-hidden group hover:border-orange-400 transition-all">
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

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white p-1 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Verified badge */}
                    {fileData.exifData.isVerified && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white p-0.5 rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* GPS/Video indicator */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-1">
                      <div className="flex items-center justify-between text-white text-[10px]">
                        <span>{fileData.isVideo ? '🎥' : '📷'}</span>
                        {fileData.isVideo && fileData.videoDuration && (
                          <span>{Math.round(fileData.videoDuration)}s</span>
                        )}
                        {!fileData.isVideo && fileData.autoDetectedLocation && (
                          <span>📍</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Images Button */}
        <div className="border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => setShowUploadOptions(true)}
            className="w-full py-3.5 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:text-orange-600 hover:border-orange-400 hover:bg-linear-to-r hover:from-orange-50 hover:to-amber-50 transition-all flex items-center justify-center gap-2 group"
          >
            <div className="bg-slate-200 group-hover:bg-orange-400 p-1.5 rounded transition-colors">
              <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {selectedFiles.length > 0 ? 'Add More Files' : 'Add Images or Videos'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || selectedFiles.length === 0 || !sharedTitle || !sharedDescription || (!sharedLocation && !selectedFiles.some(f => f.autoDetectedLocation))}
          className="w-full py-3.5 px-6 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {selectedFiles.length > 0 ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Submit {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
                </>
              ) : (
                'Add files to submit'
              )}
            </span>
          )}
        </button>
      </form>

      {/* Upload Options Modal */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add Files</h3>
              <button
                onClick={() => setShowUploadOptions(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {/* Upload from Gallery */}
              <button
                onClick={() => {
                  fileInputRef.current?.click()
                  setShowUploadOptions(false)
                }}
                className="w-full p-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all flex items-center gap-3 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1 text-left">
                  <div className="font-medium">From Gallery</div>
                  <div className="text-xs text-blue-100">Choose from device</div>
                </div>
              </button>

              {/* Take Live Photo */}
              <button
                onClick={openCamera}
                className="w-full p-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all flex items-center gap-3 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="flex-1 text-left">
                  <div className="font-medium">Camera</div>
                  <div className="text-xs text-orange-100">Capture with GPS</div>
                </div>
              </button>
            </div>
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
