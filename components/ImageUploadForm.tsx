'use client'

import { useState, useRef } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary/upload'
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

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

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

        // Handle location if available - set as shared location if first image with GPS
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
        console.error('Error extracting EXIF:', error)
      }

      newFiles.push({
        file,
        preview,
        autoDetectedLocation,
        exifData
      })
    }

    setSelectedFiles(prev => [...prev, ...newFiles])

    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} selected`)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    if (!sharedTitle || !sharedDescription || !sharedLocation) {
      toast.error('Please fill in title, description, and location')
      return
    }

    setLoading(true)

    try {
      // Upload all images to Cloudinary first
      const uploadedImages = []
      let uploadFailures = 0

      for (const fileData of selectedFiles) {
        try {
          const uploadResult = await uploadToCloudinary(fileData.file)
          uploadedImages.push({
            location: sharedLocation, // Use shared location for all images
            cloudinaryUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
            isVerified: fileData.exifData.isVerified || false,
            cameraModel: fileData.exifData.cameraModel || null,
            latitude: fileData.exifData.latitude || null,
            longitude: fileData.exifData.longitude || null,
          })
        } catch (error: any) {
          console.error('Upload error:', error)
          uploadFailures++
        }
      }

      if (uploadedImages.length === 0) {
        toast.error('All image uploads failed')
        return
      }

      // Create heritage site with all images in one request
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: sharedTitle,
          description: sharedDescription,
          images: uploadedImages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create heritage site')
      }

      toast.success(
        `Heritage site "${sharedTitle}" created with ${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''}!`
      )

      if (uploadFailures > 0) {
        toast.error(`${uploadFailures} image${uploadFailures > 1 ? 's' : ''} failed to upload`)
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
      toast.error(error.message || 'Failed to upload images')
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
          <h2 className="text-2xl font-bold text-gray-900">Document Heritage Sites</h2>
          <p className="text-sm text-gray-600">Upload multiple images with a single title and description</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shared Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
            Heritage Site Title *
          </label>
          <input
            type="text"
            id="title"
            required
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium placeholder-gray-400 bg-white transition-all"
            placeholder="Enter the heritage site name"
            value={sharedTitle}
            onChange={(e) => setSharedTitle(e.target.value)}
          />
        </div>

        {/* Shared Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium placeholder-gray-400 bg-white transition-all resize-none"
            placeholder="Describe the heritage site, its history, and significance"
            value={sharedDescription}
            onChange={(e) => setSharedDescription(e.target.value)}
          />
        </div>

        {/* Site Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-bold text-gray-900 mb-2">
            Site Location *
            {selectedFiles.some(f => f.autoDetectedLocation) && (
              <span className="ml-2 text-green-600 text-xs">✓ Auto-detected from GPS</span>
            )}
          </label>
          <input
            type="text"
            id="location"
            required
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium placeholder-gray-400 bg-white transition-all"
            placeholder="Enter the location of this heritage site"
            value={sharedLocation}
            onChange={(e) => setSharedLocation(e.target.value)}
          />
          <p className="mt-2 text-xs text-gray-500">This location will be used for all images of this site</p>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Select Images *
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-4 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-linear-to-r file:from-orange-500 file:to-amber-600 file:text-white hover:file:from-orange-600 hover:file:to-amber-700 file:transition-all file:shadow-lg file:cursor-pointer cursor-pointer border-2 border-dashed border-orange-300 rounded-xl p-4 hover:border-orange-500 transition-colors bg-orange-50/50"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">You can select multiple images of the same heritage site</p>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Selected Images ({selectedFiles.length})
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
                  {/* Preview Image */}
                  <div className="relative aspect-square">
                    <img
                      src={fileData.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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

                    {/* Image number overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-2">
                      <span className="text-white text-xs font-bold">Image {index + 1}</span>
                      {fileData.autoDetectedLocation && (
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
                    All {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} will be uploaded with the shared title, description, and location "{sharedLocation || 'site location'}".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || selectedFiles.length === 0 || !sharedTitle || !sharedDescription || !sharedLocation}
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
