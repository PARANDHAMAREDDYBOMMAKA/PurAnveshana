import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import YatraGallery from '@/components/YatraGallery'
import YatraPendingBanner from '@/components/YatraPendingBanner'

export default async function YatraPage() {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAdmin && <YatraPendingBanner />}

        <YatraGallery userId={session.userId} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
