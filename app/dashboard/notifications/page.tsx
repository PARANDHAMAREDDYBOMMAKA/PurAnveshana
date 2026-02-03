'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BellIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const url = filter === 'unread'
        ? '/api/notifications?unreadOnly=true&limit=100'
        : '/api/notifications?limit=100'

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
        toast.success('Notification deleted')
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const deleteAllRead = async () => {
    if (!confirm('Delete all read notifications?')) {
      return
    }

    try {
      setDeleting(true)
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => !n.isRead))
        toast.success('Read notifications deleted')
      }
    } catch (error) {
      console.error('Error deleting notifications:', error)
      toast.error('Failed to delete notifications')
    } finally {
      setDeleting(false)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        toast.success('All marked as read')
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
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

  const getIconColor = (type: string) => {
    switch (type) {
      case 'COMMENT':
      case 'COMMENT_REPLY':
        return 'bg-orange-100 text-orange-600'
      case 'LIKE':
        return 'bg-amber-100 text-amber-600'
      case 'STORY_APPROVED':
        return 'bg-green-100 text-green-600'
      case 'STORY_FEATURED':
        return 'bg-orange-200 text-orange-700'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const getIconLetter = (type: string) => {
    switch (type) {
      case 'COMMENT':
      case 'COMMENT_REPLY':
        return 'C'
      case 'LIKE':
        return 'L'
      case 'STORY_APPROVED':
        return 'A'
      case 'STORY_FEATURED':
        return 'F'
      default:
        return 'N'
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-white py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-4 w-fit"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm sm:text-base font-medium">Back to Dashboard</span>
          </Link>

          <h1
            className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Notifications
          </h1>
          <p className="text-sm sm:text-base text-amber-800/70">
            Manage your notifications and preferences
          </p>

          {/* Ornamental Divider */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-amber-300/60"></div>
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-amber-400"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
              <div className="h-1 w-1 rounded-full bg-amber-400"></div>
            </div>
            <div className="flex-1 h-px bg-amber-300/60"></div>
          </div>
        </div>

        {/* Actions Bar */}
        <div
          className="rounded-lg border border-amber-200/60 p-4 mb-6"
          style={{
            background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
            boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-amber-800 text-amber-50 shadow-md'
                    : 'bg-amber-100/60 text-amber-800 hover:bg-amber-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-amber-800 text-amber-50 shadow-md'
                    : 'bg-amber-100/60 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Unread
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={markAllAsRead}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100/60 rounded-md transition-colors"
              >
                Mark all read
              </button>
              <button
                onClick={deleteAllRead}
                disabled={deleting}
                className="px-3 sm:px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <TrashIcon className="h-4 w-4" />
                Delete read
              </button>
              <Link
                href="/dashboard/notifications/preferences"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100/60 rounded-md transition-colors flex items-center gap-1"
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Preferences
              </Link>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div
            className="relative rounded-lg border border-amber-200/60 p-12 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
              boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)',
            }}
          >
            {/* Decorative corner elements */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-300/60 rounded-tl-sm"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-300/60 rounded-tr-sm"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-300/60 rounded-bl-sm"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-300/60 rounded-br-sm"></div>

            <BellIcon className="h-16 w-16 mx-auto mb-4 text-amber-300" />
            <h3
              className="text-lg font-medium text-amber-900 mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              No notifications
            </h3>
            <p className="text-sm text-amber-800/70">
              {filter === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg border transition-colors ${
                  notification.isRead
                    ? 'border-amber-200/60'
                    : 'border-amber-300 bg-amber-50/50'
                }`}
                style={{
                  background: notification.isRead
                    ? 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)'
                    : undefined,
                  boxShadow: '0 2px 12px rgba(139, 90, 43, 0.06)',
                }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold ${getIconColor(notification.type)}`}>
                      {getIconLetter(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm sm:text-base font-semibold text-amber-900">
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-amber-600 rounded-full shrink-0 mt-1"></div>
                        )}
                      </div>

                      <p className="text-sm text-amber-900/70 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                        <span className="text-amber-700/60">
                          {formatDate(notification.createdAt)}
                        </span>

                        <div className="flex gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-amber-700 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                          {notification.link && (
                            <Link
                              href={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="text-amber-700 hover:underline"
                            >
                              View
                            </Link>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
