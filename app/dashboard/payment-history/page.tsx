import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import PaymentHistory from '@/components/PaymentHistory'
import Link from 'next/link'
import { DollarSign, TrendingUp, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

export default async function PaymentHistoryPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isAdmin = session.role === 'admin'

  const profile = await prisma.profile.findUnique({
    where: { id: session.userId },
    select: { email: true }
  })

  const userEmail = profile?.email || ''

  const sites = await prisma.heritageSite.findMany({
    where: isAdmin ? {} : { userId: session.userId },
    select: {
      paymentStatus: true,
    }
  })

  const totalSites = sites.length
  const completedPayments = sites.filter((s) => s.paymentStatus === 'COMPLETED').length
  const pendingPayments = sites.filter((s) => s.paymentStatus === 'NOT_STARTED').length
  const inProgressPayments = sites.filter((s) => s.paymentStatus === 'IN_PROGRESS').length

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Anveshan</span>
          </Link>

          {/* Feature Header */}
          <div className="relative w-full rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
              boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08)',
            }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)' }}></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-amber-500 to-amber-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent"></div>
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30"></div>
            <div className="relative flex items-center gap-3">
              <div className="bg-amber-800 p-3 rounded-xl shadow-lg shadow-amber-900/30">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-amber-50" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                  Payment History
                </h1>
                <p className="text-amber-800/70 text-sm sm:text-base mt-1" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Track your earnings and payment status for all submitted sites
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[
              { icon: TrendingUp, value: totalSites, label: 'Total Sites' },
              { icon: CheckCircle, value: completedPayments, label: 'Completed' },
              { icon: Clock, value: inProgressPayments, label: 'In Progress' },
              { icon: Clock, value: pendingPayments, label: 'Pending' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-amber-100 p-2.5 sm:p-3 rounded-lg">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-amber-900 mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-amber-800/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Payment History Table */}
          <div className="relative rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-amber-200/60 overflow-hidden" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}>
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900 flex items-center gap-3" style={{ fontFamily: 'Georgia, serif' }}>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
                Transaction Details
              </h2>
              <p className="text-sm text-amber-800/70 mt-2">Complete history of all your payment transactions</p>
            </div>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
