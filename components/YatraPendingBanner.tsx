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
    <div className="mb-6 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-orange-900">
            <span>🗺️</span>
            Share Your Discovery Journey
          </h3>
          <p className="text-sm text-orange-800">
            You have <strong>{unpromptedSites.length}</strong> heritage{' '}
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
                  className="block text-sm font-medium text-orange-700 hover:text-orange-900 hover:underline"
                >
                  • {site.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/yatra/create"
            className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-orange-700"
          >
            Share Your Story
          </Link>
        </div>
      </div>
    </div>
  )
}
