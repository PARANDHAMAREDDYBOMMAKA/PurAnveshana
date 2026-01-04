'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Preferences {
  emailComments: boolean
  emailLikes: boolean
  emailStoryApproval: boolean
  emailStoryFeatured: boolean
  pushComments: boolean
  pushLikes: boolean
  pushStoryApproval: boolean
  pushStoryFeatured: boolean
}

export default function NotificationPreferencesPage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<Preferences>({
    emailComments: true,
    emailLikes: true,
    emailStoryApproval: true,
    emailStoryFeatured: true,
    pushComments: true,
    pushLikes: true,
    pushStoryApproval: true,
    pushStoryFeatured: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/preferences')
      if (response.ok) {
        const data = await response.json()
        if (data.preferences) {
          setPreferences({
            emailComments: data.preferences.emailComments,
            emailLikes: data.preferences.emailLikes,
            emailStoryApproval: data.preferences.emailStoryApproval,
            emailStoryFeatured: data.preferences.emailStoryFeatured,
            pushComments: data.preferences.pushComments,
            pushLikes: data.preferences.pushLikes,
            pushStoryApproval: data.preferences.pushStoryApproval,
            pushStoryFeatured: data.preferences.pushStoryFeatured,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      toast.error('Failed to load preferences')
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (response.ok) {
        toast.success('Preferences saved successfully')
      } else {
        toast.error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const togglePreference = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4 sm:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-orange-600 hover:underline mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Notification Preferences
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Choose how you want to be notified about activity
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
              Email Notifications
            </h2>

            <div className="space-y-4">
              <PreferenceToggle
                label="Comments"
                description="Receive emails when someone comments on your story"
                enabled={preferences.emailComments}
                onChange={() => togglePreference('emailComments')}
              />

              <PreferenceToggle
                label="Likes"
                description="Receive emails when someone likes your story"
                enabled={preferences.emailLikes}
                onChange={() => togglePreference('emailLikes')}
              />

              <PreferenceToggle
                label="Story Approval"
                description="Receive emails when your story is approved or rejected"
                enabled={preferences.emailStoryApproval}
                onChange={() => togglePreference('emailStoryApproval')}
              />

              <PreferenceToggle
                label="Story Featured"
                description="Receive emails when your story is featured"
                enabled={preferences.emailStoryFeatured}
                onChange={() => togglePreference('emailStoryFeatured')}
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">
              Push Notifications
            </h2>

            <div className="space-y-4">
              <PreferenceToggle
                label="Comments"
                description="Show in-app notifications when someone comments on your story"
                enabled={preferences.pushComments}
                onChange={() => togglePreference('pushComments')}
              />

              <PreferenceToggle
                label="Likes"
                description="Show in-app notifications when someone likes your story"
                enabled={preferences.pushLikes}
                onChange={() => togglePreference('pushLikes')}
              />

              <PreferenceToggle
                label="Story Approval"
                description="Show in-app notifications when your story is approved or rejected"
                enabled={preferences.pushStoryApproval}
                onChange={() => togglePreference('pushStoryApproval')}
              />

              <PreferenceToggle
                label="Story Featured"
                description="Show in-app notifications when your story is featured"
                enabled={preferences.pushStoryFeatured}
                onChange={() => togglePreference('pushStoryFeatured')}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={savePreferences}
              disabled={saving}
              className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium rounded-md transition-all shadow-md disabled:opacity-50 text-sm sm:text-base"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreferenceToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-slate-900">
          {label}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          enabled ? 'bg-linear-to-r from-orange-500 to-amber-600' : 'bg-slate-200'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
