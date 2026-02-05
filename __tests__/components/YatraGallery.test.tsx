import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import YatraGallery from '@/components/YatraGallery'

global.fetch = jest.fn()

describe('YatraGallery Component', () => {
  const mockStories = [
    {
      id: 'story1',
      userId: 'user1',
      heritageSiteId: 'site1',
      title: 'Ancient Temple Discovery',
      discoveryContext: 'Found this amazing temple',
      journeyNarrative: 'Journey was incredible',
      historicalIndicators: ['temple', 'ancient'],
      historicalIndicatorsDetails: null,
      evidenceTypes: ['photo'],
      safeVisuals: ['https://example.com/image1.jpg'],
      personalReflection: null,
      submissionConfirmed: true,
      publishStatus: 'APPROVED_PUBLIC',
      culturalInsights: '',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      author: {
        id: 'user1',
        name: 'Test User',
      },
      heritageSite: {
        id: 'site1',
        title: 'Heritage Site 1',
        type: 'TEMPLE',
        images: [
          {
            id: 'img1',
            r2Url: 'https://example.com/img1.jpg',
            cloudinaryUrl: null,
            location: 'Karnataka',
          },
        ],
      },
      _count: {
        likes: 5,
        comments: 3,
      },
    },
  ]

  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    ;(fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
        })
    )

    render(<YatraGallery userId="user1" isAdmin={false} />)

    expect(screen.getByText(/loading stories/i)).toBeInTheDocument()
  })

  it('should render yatra stories after loading', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: mockStories }),
    })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByText('Ancient Temple Discovery')).toBeInTheDocument()
    })

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Heritage Site 1')).toBeInTheDocument()
  })

  it('should display search input', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: mockStories }),
    })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search stories/i)).toBeInTheDocument()
    })
  })

  it('should filter stories based on search query', async () => {
    const multipleStories = [
      ...mockStories,
      {
        ...mockStories[0],
        id: 'story2',
        title: 'Fort Discovery',
      },
    ]

    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: multipleStories }),
    })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByText('Ancient Temple Discovery')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/search stories/i)
    await userEvent.type(searchInput, 'Temple')

    await waitFor(() => {
      expect(screen.getByText('Ancient Temple Discovery')).toBeInTheDocument()
      expect(screen.queryByText('Fort Discovery')).not.toBeInTheDocument()
    })
  })

  it('should show create button for non-admin users', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: mockStories }),
    })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByText(/create/i)).toBeInTheDocument()
    })
  })

  it('should not show create button for admin users', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: mockStories }),
    })

    render(<YatraGallery userId="admin1" isAdmin={true} />)

    await waitFor(() => {
      expect(screen.queryByText(/create/i)).not.toBeInTheDocument()
    })
  })

  it('should show admin filters for admin users', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: mockStories }),
    })

    render(<YatraGallery userId="admin1" isAdmin={true} />)

    await waitFor(() => {
      expect(screen.getByText(/filter by status/i)).toBeInTheDocument()
    })
  })

  it('should display empty state when no stories exist', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ stories: [] }),
    })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByText(/share your first story/i)).toBeInTheDocument()
    })
  })

  it('should handle like button click', async () => {
    ;(fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stories: mockStories }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ liked: false, likeCount: 5 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ comments: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ liked: true, likeCount: 6 }),
      })

    render(<YatraGallery userId="user1" isAdmin={false} />)

    await waitFor(() => {
      expect(screen.getByText('Ancient Temple Discovery')).toBeInTheDocument()
    })

    const likeButton = screen.getAllByRole('button').find((btn) => btn.innerHTML.includes('Heart'))

    if (likeButton) {
      fireEvent.click(likeButton)

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/yatra/story1/like',
          expect.objectContaining({ method: 'POST' })
        )
      })
    }
  })
})
