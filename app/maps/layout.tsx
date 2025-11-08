import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Heritage Site Map',
  description: 'Explore heritage sites on an interactive map. View archaeological locations with verified EXIF metadata and geographical information.',
  openGraph: {
    title: 'Heritage Site Map | Puranveshana',
    description: 'Explore heritage sites on an interactive map with verified metadata.',
  },
}

export default function MapsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
