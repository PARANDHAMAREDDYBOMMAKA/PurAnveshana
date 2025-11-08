import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Join Puranveshana to start discovering and documenting India\'s rich heritage sites. Create your account and earn rewards for heritage preservation.',
  openGraph: {
    title: 'Sign Up | Puranveshana',
    description: 'Join Puranveshana and start documenting heritage sites.',
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
