'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HeritageSite {
  id: string
  title: string
  type: string | null
}

export default function YatraPendingBanner() {
  const [unpromptedSites, setUnpromptedSites] = useState<HeritageSite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUnpromptedSites()
  }, [])

  const checkUnpromptedSites = async () => {
    try {
      const response = await fetch('/api/yatra/check-unprompted')
      if (response.ok) {
        const data = await response.json()
        if (data.hasUnpromptedSites) {
          setUnpromptedSites(data.sites)
        }
      }
    } catch (error) {
      console.error('Error checking unprompted sites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || unpromptedSites.length === 0) {
    return null
  }

  return (
    <div
      className="relative mb-6 rounded-xl border border-amber-200/60 p-5 sm:p-6 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-700/30"></div>
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-700/30"></div>
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-700/30"></div>
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-700/30"></div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="bg-amber-800 p-1.5 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            Share Your Discovery Journey
          </h3>
          <p className="text-sm text-amber-800/70">
            You have <strong className="text-amber-900">{unpromptedSites.length}</strong> heritage{' '}
            {unpromptedSites.length === 1 ? 'site' : 'sites'} waiting for your
            story! Share how you discovered{' '}
            {unpromptedSites.length === 1 ? 'it' : 'them'} and inspire others.
          </p>
          {unpromptedSites.length <= 3 && (
            <div className="mt-3 space-y-1">
              {unpromptedSites.map((site) => (
                <Link
                  key={site.id}
                  href={`/dashboard/yatra/create?siteId=${site.id}`}
                  className="block text-sm font-medium text-amber-800 hover:text-amber-900 hover:underline"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  &bull; {site.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/yatra/create"
            className="rounded-xl bg-amber-800 px-6 py-3 font-semibold text-amber-50 shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
  )
}
