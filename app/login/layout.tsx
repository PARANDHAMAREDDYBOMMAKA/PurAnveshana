import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to Puranveshana to access your heritage discovery dashboard, upload archaeological site images, and verify EXIF metadata.',
  openGraph: {
    title: 'Login | Puranveshana',
    description: 'Login to access your heritage discovery dashboard.',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
