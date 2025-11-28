'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { SupportTicket, SupportMessage } from '@/types/support'

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ticketId = params.ticketId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const [userEmail, setUserEmail] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedPriority, setSelectedPriority] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchData = async () => {
    try {
      const profileResponse = await fetch('/api/profile')

      if (!profileResponse.ok) {
        if (profileResponse.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }

      const profileData = await profileResponse.json()
      setUserEmail(profileData.profile.email)
      setUserRole(profileData.profile.role)

      // Fetch ticket from appropriate endpoint based on role
      const ticketEndpoint = profileData.profile.role === 'admin'
        ? `/api/admin/support/tickets/${ticketId}`
        : `/api/support/tickets/${ticketId}`

      const ticketResponse = await fetch(ticketEndpoint)

      if (!ticketResponse.ok) {
        throw new Error('Failed to fetch ticket')
      }

      const ticketData = await ticketResponse.json()
      setTicket(ticketData.ticket)
      setMessages(ticketData.ticket.messages || [])
      setSelectedStatus(ticketData.ticket.status)
      setSelectedPriority(ticketData.ticket.priority)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load ticket details')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success('Message sent')
      setNewMessage('')
      fetchData()
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleUpdateTicket = async () => {
    const statusChanged = selectedStatus !== ticket?.status
    const priorityChanged = selectedPriority !== ticket?.priority

    if (!statusChanged && !priorityChanged) return

    setUpdatingStatus(true)

    try {
      const updates: any = {}
      if (statusChanged) updates.status = selectedStatus
      if (priorityChanged) updates.priority = selectedPriority

      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update ticket')
      }

      toast.success('Ticket updated successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to update ticket')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'WAITING_FOR_CUSTOMER':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-slate-900 font-medium">Loading ticket...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
        <Navbar userEmail={userEmail} isAdmin={userRole === 'admin'} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ticket not found</h2>
            <button
              onClick={() => router.push('/dashboard/support')}
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Back to Support
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/support')}
            className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Support</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-orange-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{ticket.subject}</h1>
                <p className="text-sm text-slate-500">
                  Ticket #{ticket.id.slice(0, 8)} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace(/_/g, ' ')}
                </span>
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>

            {ticket.category && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-medium">Category:</span>
                <span>{ticket.category}</span>
              </div>
            )}

            {isAdmin && ticket.profile && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">User:</span>
                  <span>{ticket.profile.name || ticket.profile.email}</span>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Admin Controls</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_FOR_CUSTOMER">Waiting for Customer</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Priority</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateTicket}
                    disabled={updatingStatus || (selectedStatus === ticket.status && selectedPriority === ticket.priority)}
                    className="w-full px-4 py-2 text-sm bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {updatingStatus ? 'Updating...' : 'Update Ticket'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 mb-6">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Conversation</h2>
          </div>

          <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((message) => {
                // Determine who sent the message
                let senderName: string
                if (message.isAdminReply) {
                  // Admin messages always show "Support Team"
                  senderName = 'Support Team'
                } else {
                  // User messages: show name for admins, "You" for regular users
                  senderName = isAdmin
                    ? (message.profile?.name || message.profile?.email || 'Unknown User')
                    : 'You'
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${message.isAdminReply ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] ${message.isAdminReply ? 'bg-slate-100' : 'bg-linear-to-r from-orange-500 to-amber-600 text-white'} rounded-lg p-4 shadow-sm`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${message.isAdminReply ? 'bg-blue-500' : 'bg-white'}`}></div>
                        <span className={`text-xs font-semibold ${message.isAdminReply ? 'text-slate-600' : 'text-white/90'}`}>
                          {senderName}
                        </span>
                        <span className={`text-xs ${message.isAdminReply ? 'text-slate-400' : 'text-white/70'}`}>
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${message.isAdminReply ? 'text-slate-800' : 'text-white'} whitespace-pre-wrap`}>
                        {message.message}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {ticket.status !== 'CLOSED' && (
            <div className="p-6 border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black placeholder:text-slate-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-2 bg-linear-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          )}

          {ticket.status === 'CLOSED' && (
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-medium">This ticket is closed. You cannot send new messages.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
