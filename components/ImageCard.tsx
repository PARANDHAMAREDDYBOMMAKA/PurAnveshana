'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageCardProps {
  image: {
    id: string
    title: string
    description: string
    location: string
    cloudinaryUrl: string
    isVerified: boolean
    cameraModel: string | null
    latitude: number | null
    longitude: number | null
    createdAt: string
    profiles?: {
      email: string
    }
  }
  showUser?: boolean
}

export default function ImageCard({
  image,
  showUser = false
}: ImageCardProps) {
  const [showFullImage, setShowFullImage] = useState(false)

  // Helper function to detect if URL is a video
  const isVideo = (url: string) => url.includes('/video/upload/')

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-orange-100 hover:border-orange-300">
        {/* Image */}
        <div className="relative h-64 w-full bg-linear-to-br from-orange-100 to-amber-100 overflow-hidden">
          {isVideo(image.cloudinaryUrl) ? (
            <video
              src={image.cloudinaryUrl}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              controls
              onClick={() => setShowFullImage(true)}
            />
          ) : (
            <Image
              src={image.cloudinaryUrl}
              alt={image.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onClick={() => setShowFullImage(true)}
            />
          )}
          {/* Verified Badge */}
          {image.isVerified && (
            <div className="absolute top-3 right-3 bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* View Full Image Button */}
          <button
            onClick={() => setShowFullImage(true)}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">{image.title}</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">{image.description}</p>

          {/* Metadata */}
          <div className="space-y-2.5 text-sm border-t-2 border-orange-100 pt-4">
            {/* Location */}
            <div className="flex items-start bg-orange-50 rounded-lg p-3 border border-orange-200">
              <svg className="w-5 h-5 text-orange-600 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex-1">
                <span className="text-slate-900 font-semibold block">{image.location}</span>
                {image.latitude && image.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${image.latitude},${image.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1 mt-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View on Map
                  </a>
                )}
              </div>
            </div>

            {/* Camera Model */}
            {image.cameraModel && (
              <div className="flex items-start bg-blue-50 rounded-lg p-3 border border-blue-200">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-slate-900 font-semibold">{image.cameraModel}</span>
              </div>
            )}

            {/* Date */}
            <div className="flex items-start bg-purple-50 rounded-lg p-3 border border-purple-200">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-slate-900 font-semibold">
                {new Date(image.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* User (Admin View) */}
            {showUser && image.profiles && (
              <div className="flex items-start bg-amber-50 rounded-lg p-3 border border-amber-300">
                <svg className="w-5 h-5 text-amber-700 mt-0.5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="flex-1">
                  <span className="text-xs text-amber-700 font-semibold block mb-0.5">Submitted by</span>
                  <span className="text-slate-900 font-bold">{image.profiles.email}</span>
                </div>
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
              {isVideo(image.cloudinaryUrl) ? (
                <video
                  src={image.cloudinaryUrl}
                  controls
                  className="w-full h-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <Image
                  src={image.cloudinaryUrl}
                  alt={image.title}
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-full rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{image.title}</h3>
              <p className="text-white/90 text-sm">{image.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
