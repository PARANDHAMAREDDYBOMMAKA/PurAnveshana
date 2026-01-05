import { Metadata } from 'next'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your heritage site images, verify EXIF metadata, and explore archaeological discoveries on your Puranveshana dashboard.',
  openGraph: {
    title: 'Dashboard | Puranveshana',
    description: 'Manage your heritage site images and archaeological discoveries.',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </>
  )
}
