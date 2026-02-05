'use client'

import { useEffect, useState } from 'react'
import { ClockIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Version {
  id: string
  versionNumber: number
  title: string
  changeDescription?: string
  editedBy: string
  createdAt: string
}

interface VersionDetails extends Version {
  discoveryContext: string
  journeyNarrative: string
  historicalIndicators: string[]
  historicalIndicatorsDetails?: string
  evidenceTypes: string[]
  safeVisuals: string[]
  personalReflection?: string
  culturalInsights?: string
  publishStatus: string
}

interface VersionHistoryProps {
  storyId: string
  currentVersion?: number
}

export default function VersionHistory({ storyId, currentVersion }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<VersionDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchVersions()
  }, [storyId])

  const fetchVersions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/yatra/${storyId}/versions`)
      if (response.ok) {
        const data = await response.json()
        setVersions(data.versions || [])
      } else {
        toast.error('Failed to load version history')
      }
    } catch (error) {
      console.error('Error fetching versions:', error)
      toast.error('Error loading versions')
    } finally {
      setLoading(false)
    }
  }

  const viewVersion = async (versionId: string) => {
    try {
      const response = await fetch(`/api/yatra/${storyId}/versions/${versionId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedVersion(data.version)
        setShowModal(true)
      } else {
        toast.error('Failed to load version details')
      }
    } catch (error) {
      console.error('Error viewing version:', error)
      toast.error('Error loading version details')
    }
  }

  const restoreVersion = async (versionId: string, versionNumber: number) => {
    if (!confirm(`Are you sure you want to restore to version ${versionNumber}? This will create a new version with the restored content.`)) {
      return
    }

    try {
      setRestoring(true)
      const response = await fetch(`/api/yatra/${storyId}/versions/${versionId}`, {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Version restored successfully!')
        setShowModal(false)
        fetchVersions()
        setTimeout(() => window.location.reload(), 1000)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to restore version')
      }
    } catch (error) {
      console.error('Error restoring version:', error)
      toast.error('Error restoring version')
    } finally {
      setRestoring(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="text-center p-6 sm:p-8 text-gray-500 dark:text-gray-400">
        <ClockIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm sm:text-base">No version history yet</p>
        <p className="text-xs sm:text-sm mt-1">Versions will be created when you edit this story</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Version Timeline */}
      <div className="space-y-3">
        {versions.map((version, index) => (
          <div
            key={version.id}
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            {/* Version Number Badge */}
            <div className="shrink-0">
              <div className={`flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full ${
                index === 0
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <span className="text-xs sm:text-sm font-bold">v{version.versionNumber}</span>
              </div>
            </div>

            {/* Version Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                    {version.title}
                  </h4>
                  {version.changeDescription && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {version.changeDescription}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(version.createdAt)}
                  </p>
                </div>

                {/* Current Version Badge */}
                {index === 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Current
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => viewVersion(version.id)}
                  className="text-xs sm:text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  View Details
                </button>
                {index !== 0 && (
                  <button
                    onClick={() => restoreVersion(version.id, version.versionNumber)}
                    disabled={restoring}
                    className="text-xs sm:text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <ArrowPathIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    Restore
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Version Details Modal */}
      {showModal && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Version {selectedVersion.versionNumber} Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</h4>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedVersion.title}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Discovery Context</h4>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">{selectedVersion.discoveryContext}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Journey Narrative</h4>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">{selectedVersion.journeyNarrative}</p>
              </div>

              {selectedVersion.culturalInsights && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cultural Insights</h4>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white whitespace-pre-wrap">{selectedVersion.culturalInsights}</p>
                </div>
              )}

              {selectedVersion.changeDescription && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Change Description</h4>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white">{selectedVersion.changeDescription}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Created</h4>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white">{formatDate(selectedVersion.createdAt)}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
              {selectedVersion.versionNumber !== versions[0]?.versionNumber && (
                <button
                  onClick={() => restoreVersion(selectedVersion.id, selectedVersion.versionNumber)}
                  disabled={restoring}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  {restoring ? 'Restoring...' : 'Restore This Version'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
