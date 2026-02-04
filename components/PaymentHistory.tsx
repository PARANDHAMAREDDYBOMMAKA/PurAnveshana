'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Calendar, CreditCard, FileText, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

export default function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      const data = await response.json()
      if (data.success) {
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalEarned = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
      default:
        return <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-700 text-white'
      case 'IN_PROGRESS':
        return 'bg-amber-700 text-white'
      default:
        return 'bg-amber-400/60 text-amber-900'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-5 sm:p-6 animate-pulse border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 sm:h-10 bg-amber-200/60 rounded-lg w-24 sm:w-32"></div>
              <div className="h-6 sm:h-8 bg-amber-200/60 rounded-full w-20 sm:w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-amber-200/60 rounded w-3/4"></div>
              <div className="h-4 bg-amber-200/60 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 text-amber-300 mx-auto mb-4" />
        <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>No Payments Yet</h3>
        <p className="text-sm sm:text-base text-amber-800/70 max-w-md mx-auto">
          Your payment history will appear here once you start receiving payments for your heritage site submissions.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Total Earned Summary Card */}
      <div className="relative w-full rounded-xl p-5 sm:p-6 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
          boxShadow: '0 4px 24px rgba(180, 100, 40, 0.12)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)' }}></div>
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-700/30"></div>
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-700/30"></div>
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-700/30"></div>
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-700/30"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
              <p className="text-xs sm:text-sm font-semibold text-amber-800/70">Total Earnings</p>
            </div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>₹{totalEarned.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-amber-800/60 mt-1">{payments.filter(p => p.status === 'COMPLETED').length} completed transactions</p>
          </div>
          <div className="bg-amber-800 p-3 sm:p-4 rounded-xl shadow-lg shadow-amber-900/20">
            <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-amber-50" />
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3 sm:space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="group relative rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200/60 hover:border-amber-300 transition-all duration-300"
            style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.06)' }}
          >
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Left: Amount and Status */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>₹{payment.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-sm ${getStatusStyle(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="text-xs sm:text-sm font-bold">
                      {payment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-800/70">
                    <div className="p-1.5 bg-amber-100/60 rounded">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-amber-700" />
                    </div>
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {payment.paymentMethod && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-800/70">
                      <div className="p-1.5 bg-amber-100/60 rounded">
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-amber-700" />
                      </div>
                      <span>{payment.paymentMethod}</span>
                    </div>
                  )}
                </div>

                {payment.notes && (
                  <div className="mt-3 p-3 bg-amber-50/60 rounded-lg border border-amber-200/40">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-amber-800/70 line-clamp-2">{payment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Transaction ID */}
              {payment.transactionId && (
                <div className="sm:self-start">
                  <div className="bg-amber-50/80 px-4 py-3 rounded-xl border border-amber-200/60">
                    <p className="text-[10px] sm:text-xs text-amber-700/60 font-semibold mb-1">Transaction ID</p>
                    <p className="text-xs sm:text-sm font-mono text-amber-900 font-bold break-all">{payment.transactionId}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
