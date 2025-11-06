'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface HeritageSiteCardProps {
  site: {
    id: string
    title: string
    description: string
    createdAt: string
    images: Array<{
      id: string
      location: string
      cloudinaryUrl: string
      isVerified: boolean
      cameraModel: string | null
      gpsLatitude: number | null
      gpsLongitude: number | null
      createdAt: string
    }>
    profile?: {
      email: string
    }
  }
  showUser?: boolean
}

export default function HeritageSiteCard({
  site,
  showUser = false
}: HeritageSiteCardProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [showFullImage, setShowFullImage] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  // Safety check for images
  if (!site.images || site.images.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{site.title}</h3>
        <p className="text-gray-600 mb-4">{site.description}</p>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No images uploaded for this site yet</p>
        </div>
      </div>
    )
  }

  const currentImage = site.images[selectedImage]
  const verifiedCount = site.images.filter(img => img.isVerified).length

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-all">
        {/* Main Image Display */}
        <div className="relative">
          <div className="relative h-96 bg-linear-to-br from-orange-100 to-amber-100 overflow-hidden group">
            <Image
              src={currentImage.cloudinaryUrl}
              alt={site.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              onClick={() => setShowFullImage(true)}
            />

            {/* Verified Badge */}
            {currentImage.isVerified && (
              <div className="absolute top-4 right-4 bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}

            {/* Image Counter & Count */}
            <div className="absolute top-4 left-4 flex gap-3">
              <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold">
                {selectedImage + 1} / {site.images.length}
              </div>
              <div className="bg-orange-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {site.images.length}
              </div>
            </div>

            {/* View Full Button */}
            <button
              onClick={() => setShowFullImage(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Full
            </button>
          </div>

          {/* Thumbnail Strip */}
          {site.images.length > 1 && (
            <div className="bg-gray-50 p-4 border-t-2 border-orange-100">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {site.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border-3 transition-all ${
                      selectedImage === index
                        ? 'border-orange-500 scale-105 shadow-lg'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <Image
                      src={img.cloudinaryUrl}
                      alt={`${site.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {img.isVerified && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white p-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="p-6 border-b-2 border-orange-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{site.title}</h3>
          <div className="relative">
            <p className={`text-gray-600 leading-relaxed ${!isDescriptionExpanded && site.description.length > 150 ? 'line-clamp-3' : ''}`}>
              {site.description}
            </p>
            {site.description.length > 150 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-orange-600 hover:text-orange-700 font-semibold text-sm mt-2 inline-flex items-center gap-1"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Show less</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Current Image Details */}
        <div className="p-6 space-y-5">
          <div className={`grid ${showUser && currentImage.cameraModel ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-5`}>
            {/* Location */}
            <div className="group relative bg-linear-to-br from-orange-50 via-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-linear-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Location</span>
                    {currentImage.gpsLatitude && currentImage.gpsLongitude && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        GPS
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-bold text-base leading-snug mb-3">{currentImage.location}</p>
                  <div className="space-y-2">
                    {currentImage.gpsLatitude && currentImage.gpsLongitude && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="font-mono font-semibold">
                          {currentImage.gpsLatitude.toFixed(6)}, {currentImage.gpsLongitude.toFixed(6)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {currentImage.gpsLatitude && currentImage.gpsLongitude ? (
                        <a
                          href={`https://www.google.com/maps?q=${currentImage.gpsLatitude},${currentImage.gpsLongitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Google Maps
                        </a>
                      ) : (
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(currentImage.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Search on Google Maps
                        </a>
                      )}
                      {showUser && (
                        <Link
                          href={`/maps/${site.id}`}
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          Route from Bengaluru
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Camera Model - Only for Admin */}
            {showUser && currentImage.cameraModel && (
              <div className="group relative bg-linear-to-br from-blue-50 via-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md">
                <div className="flex items-start">
                  <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Camera</span>
                      {currentImage.isVerified && (
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-bold text-base leading-snug wrap-break-word">{currentImage.cameraModel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Site Metadata */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-orange-100 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">
                {new Date(site.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{verifiedCount}/{site.images.length} Verified</span>
            </div>

            {showUser && site.profile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-300">
                <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-900 font-bold">{site.profile.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full max-h-[90vh]">
              <Image
                src={currentImage.cloudinaryUrl}
                alt={site.title}
                width={1920}
                height={1080}
                className="object-contain w-full h-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{site.title}</h3>
              <p className="text-white/90 text-sm mb-1">{currentImage.location}</p>
              <p className="text-white/70 text-xs">Image {selectedImage + 1} of {site.images.length}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
