'use client'

import { useEffect, useState, useRef } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
  actorName?: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
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
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIconColor = (type: string) => {
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
      case 'STORY_REJECTED':
        return 'bg-slate-100 text-slate-600'
      default:
        return 'bg-slate-100 text-slate-600'
    }
  }

  const getNotificationIconLetter = (type: string) => {
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
      case 'STORY_REJECTED':
        return 'R'
      default:
        return 'N'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellIconSolid className="h-6 w-6 text-orange-600" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[80vh] overflow-hidden bg-white rounded-lg shadow-xl border border-orange-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-orange-100">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-slate-500">
                <BellIcon className="h-12 w-12 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-orange-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-orange-50 transition-colors ${
                      !notification.isRead ? 'bg-orange-50/50' : ''
                    }`}
                  >
                    {notification.link ? (
                      <Link
                        href={notification.link}
                        onClick={() => {
                          markAsRead(notification.id)
                          setIsOpen(false)
                        }}
                        className="block"
                      >
                        <NotificationContent
                          notification={notification}
                          getNotificationIconColor={getNotificationIconColor}
                          getNotificationIconLetter={getNotificationIconLetter}
                          formatTime={formatTime}
                        />
                      </Link>
                    ) : (
                      <div onClick={() => markAsRead(notification.id)}>
                        <NotificationContent
                          notification={notification}
                          getNotificationIconColor={getNotificationIconColor}
                          getNotificationIconLetter={getNotificationIconLetter}
                          formatTime={formatTime}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-orange-100">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NotificationContent({
  notification,
  getNotificationIconColor,
  getNotificationIconLetter,
  formatTime,
}: {
  notification: Notification
  getNotificationIconColor: (type: string) => string
  getNotificationIconLetter: (type: string) => string
  formatTime: (dateString: string) => string
}) {
  return (
    <div className="flex gap-3">
      {/* Icon */}
      <div className={`shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold ${getNotificationIconColor(notification.type)}`}>
        {getNotificationIconLetter(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-slate-900">
          {notification.title}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {formatTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="shrink-0">
          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
        </div>
      )}
    </div>
  )
}
