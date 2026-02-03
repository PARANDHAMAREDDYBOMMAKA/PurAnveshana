'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { SupportTicket, CreateTicketRequest } from '@/types/support'

export default function SupportPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const [userEmail, setUserEmail] = useState('')
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [formData, setFormData] = useState<CreateTicketRequest>({
    subject: '',
    message: '',
    category: '',
    priority: 'MEDIUM'
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

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

      const ticketsEndpoint = profileData.profile.role === 'admin'
        ? '/api/admin/support/tickets'
        : '/api/support/tickets'

      const ticketsResponse = await fetch(ticketsEndpoint)

      if (!ticketsResponse.ok) {
        throw new Error('Failed to fetch tickets')
      }

      const ticketsData = await ticketsResponse.json()
      setTickets(ticketsData.tickets || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load support tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create ticket')
      }

      toast.success('Support ticket created successfully')
      setShowNewTicketForm(false)
      setFormData({
        subject: '',
        message: '',
        category: '',
        priority: 'MEDIUM'
      })
      fetchData()
    } catch (error) {
      toast.error('Failed to create ticket')
    } finally {
      setSubmitting(false)
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
          <p className="mt-4 text-slate-900 font-medium">Loading support tickets...</p>
        </div>
      </div>
    )
  }

  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
                {isAdmin ? 'All Support Tickets' : 'Support Tickets'}
              </h1>
              <p className="mt-2 text-slate-600">
                {isAdmin
                  ? 'View and manage all user support requests'
                  : 'Manage your support requests and get help'}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-12 h-px bg-amber-400/50"></span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                <span className="w-12 h-px bg-amber-400/50"></span>
              </div>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowNewTicketForm(true)}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold rounded-full shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Ticket</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {!isAdmin && showNewTicketForm && (
          <div
            className="mb-8 rounded-xl border border-amber-200/60 p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute bottom-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute bottom-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Create New Ticket</h2>
              <button
                onClick={() => setShowNewTicketForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-amber-200/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/60 text-black placeholder:text-slate-500"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-amber-200/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/60 text-black placeholder:text-slate-500"
                  placeholder="Detailed description of your issue..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-amber-200/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/60 text-black placeholder:text-slate-500"
                    placeholder="e.g., Technical, Billing, General"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-amber-200/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/60 text-black"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold rounded-full shadow-lg shadow-amber-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-6 py-3 bg-amber-100 text-amber-800 font-semibold rounded-full hover:bg-amber-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div
              className="rounded-xl border border-amber-200/50 p-12 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}
            >
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
                <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
                <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-3 left-3 w-6 h-px bg-amber-300/60"></div>
                <div className="absolute bottom-3 left-3 w-px h-6 bg-amber-300/60"></div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
                <div className="absolute bottom-3 right-3 w-6 h-px bg-amber-300/60"></div>
                <div className="absolute bottom-3 right-3 w-px h-6 bg-amber-300/60"></div>
              </div>

              <svg className="w-16 h-16 mx-auto text-amber-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>No support tickets yet</h3>
              <p className="text-slate-600 mb-6">Create your first support ticket to get help</p>
              <button
                onClick={() => setShowNewTicketForm(true)}
                className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold rounded-full shadow-lg shadow-amber-900/20 transition-all transform hover:scale-105"
              >
                Create Ticket
              </button>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => router.push(`/dashboard/support/${ticket.id}`)}
                className="bg-white rounded-xl border border-amber-200/50 p-6 hover:border-amber-300 transition-all cursor-pointer"
                style={{ boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="shrink-0">
                        <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1 truncate">{ticket.subject}</h3>
                        <p className="text-sm text-slate-500">
                          Ticket #{ticket.id.slice(0, 8)} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      {ticket.category && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                          {ticket.category}
                        </span>
                      )}
                      {isAdmin && ticket.profile && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                          User: {ticket.profile.name || ticket.profile.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    {ticket._count && ticket._count.messages > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{ticket._count.messages}</span>
                      </div>
                    )}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
