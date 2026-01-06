import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import PaymentHistory from '@/components/PaymentHistory'
import Link from 'next/link'
import { DollarSign, TrendingUp, Clock, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react'

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
    where: { userId: session.userId },
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
            className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Anveshan</span>
          </Link>

          {/* Feature Header */}
          <div className="relative overflow-hidden bg-linear-to-br from-green-600 via-emerald-600 to-green-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    Payment History
                  </h1>
                </div>
                <p className="text-green-50 text-sm sm:text-base lg:text-lg font-medium max-w-2xl">
                  Track your earnings and payment status for all submitted sites
                </p>
              </div>
              <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 opacity-20 self-end sm:self-auto animate-pulse" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            <div className="relative overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{totalSites}</p>
                <p className="text-xs sm:text-sm text-blue-100 font-medium">Total Sites</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-green-600 via-emerald-600 to-green-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{completedPayments}</p>
                <p className="text-xs sm:text-sm text-green-100 font-medium">Completed</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-yellow-500 via-amber-600 to-orange-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{inProgressPayments}</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium">In Progress</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-red-600 via-rose-600 to-red-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{pendingPayments}</p>
                <p className="text-xs sm:text-sm text-red-100 font-medium">Pending</p>
              </div>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:p-8 border border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                Transaction Details
              </h2>
              <p className="text-sm text-slate-600 mt-2">Complete history of all your payment transactions</p>
            </div>
            <PaymentHistory />
          </div>
        </div>
      </div>
    </div>
  )
}
