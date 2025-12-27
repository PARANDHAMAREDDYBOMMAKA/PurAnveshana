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
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-linear-to-br from-slate-50 to-slate-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-8 sm:h-10 bg-slate-200 rounded-lg w-24 sm:w-32"></div>
              <div className="h-6 sm:h-8 bg-slate-200 rounded-full w-20 sm:w-24"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="relative overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-50 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Payments Yet</h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Your payment history will appear here once you start receiving payments for your heritage site submissions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Total Earned Summary Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-green-500 via-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full -mr-16 -mt-16 sm:-mr-20 sm:-mt-20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -ml-12 -mb-12 sm:-ml-16 sm:-mb-16"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
              <p className="text-xs sm:text-sm font-semibold text-green-50">Total Earnings</p>
            </div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold">₹{totalEarned.toFixed(2)}</p>
            <p className="text-xs sm:text-sm text-green-100 mt-1">{payments.filter(p => p.status === 'COMPLETED').length} completed transactions</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
            <DollarSign className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3 sm:space-y-4">
        {payments.map((payment, index) => (
          <div
            key={payment.id}
            className="group relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-green-200"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-50 to-emerald-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Left: Amount and Status */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-linear-to-br from-green-100 to-emerald-100 rounded-lg">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900">₹{payment.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md ${getStatusStyle(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="text-xs sm:text-sm font-bold">
                      {payment.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <div className="p-1.5 bg-slate-100 rounded">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
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
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                      <div className="p-1.5 bg-slate-100 rounded">
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <span>{payment.paymentMethod}</span>
                    </div>
                  )}
                </div>

                {payment.notes && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{payment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Transaction ID */}
              {payment.transactionId && (
                <div className="sm:self-start">
                  <div className="bg-linear-to-br from-slate-50 to-slate-100 px-4 py-3 rounded-xl border border-slate-200">
                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mb-1">Transaction ID</p>
                    <p className="text-xs sm:text-sm font-mono text-slate-900 font-bold break-all">{payment.transactionId}</p>
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
