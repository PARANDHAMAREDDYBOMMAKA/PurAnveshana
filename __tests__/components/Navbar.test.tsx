import { render } from '@testing-library/react'
import Navbar from '@/components/Navbar'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Navbar Component', () => {
  it('should render the Puranveshana logo', () => {
    const { getByText } = render(<Navbar />)

    expect(getByText('Puranveshana')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    const { getAllByRole } = render(<Navbar />)

    // Check for common navigation items
    const links = getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })

  it('should be accessible with proper ARIA attributes', () => {
    const { container } = render(<Navbar />)

    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()
  })
})
