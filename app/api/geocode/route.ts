import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const location = searchParams.get('location')

    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      )
    }

    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'PurAnveshana-Heritage-App/1.0',
          'Referer': request.headers.get('referer') || 'https://puranveshana.com',
        },
      }
    )

    if (!geocodeResponse.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await geocodeResponse.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Geocoding error:', error)
    return NextResponse.json(
      { error: 'Failed to geocode location' },
      { status: 500 }
    )
  }
}
