import { Metadata } from 'next'

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
  return children
}
