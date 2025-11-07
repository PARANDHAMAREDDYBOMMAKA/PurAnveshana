'use client'

import { useState, useEffect } from 'react'

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

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Payment History
        </h3>
        <p className="text-slate-600">No payment history yet. Once you receive payments, they will appear here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-orange-100">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden sm:inline">Payment History</span>
          <span className="sm:hidden">Payments</span>
        </h3>
        <div className="bg-linear-to-br from-green-500 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md">
          <div className="text-[10px] sm:text-xs font-semibold opacity-90">Total Earned</div>
          <div className="text-lg sm:text-2xl font-bold">₹{totalEarned.toFixed(2)}</div>
        </div>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border-2 border-orange-100 rounded-lg p-3 sm:p-4 hover:border-orange-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl sm:text-2xl font-bold text-green-600">₹{payment.amount}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    payment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {payment.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(payment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {payment.paymentMethod && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>{payment.paymentMethod}</span>
                    </div>
                  )}
                </div>
                {payment.notes && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">{payment.notes}</p>
                )}
              </div>
              {payment.transactionId && (
                <div className="bg-slate-50 px-3 py-1.5 rounded-lg shrink-0">
                  <div className="text-[10px] text-slate-500 font-semibold">Transaction ID</div>
                  <div className="text-xs font-mono text-slate-700 truncate max-w-[150px]">{payment.transactionId}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
