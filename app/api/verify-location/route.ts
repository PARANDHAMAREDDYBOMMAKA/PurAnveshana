import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string
      }[]
    }
  }[]
  error?: {
    message: string
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured')
      return NextResponse.json(
        { error: 'Location verification service not configured' },
        { status: 500 }
      )
    }

    const { text, fieldName } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required for verification' },
        { status: 400 }
      )
    }

    // Prompt to detect location information in the text
    const prompt = `You are a content moderator for a heritage site protection platform. Your task is to analyze text and detect if it contains specific location information that could reveal the exact location of a heritage site.

Analyze the following text from the "${fieldName || 'yatra story'}" field:

"""
${text}
"""

Check if the text contains any of the following location-revealing information:
1. Exact GPS coordinates or latitude/longitude
2. Specific village, town, or city names
3. Specific district or state/region names combined with landmarks
4. Exact addresses or road names
5. Distance and direction from known landmarks (e.g., "5 km north of XYZ temple")
6. Google Maps links or coordinates
7. Specific landmarks that could pinpoint the location

IMPORTANT: Generic descriptions like "in a forest", "near a river", "in the hills", "in South India" are ACCEPTABLE and should NOT be flagged.

Respond in JSON format only:
{
  "containsLocation": true/false,
  "confidence": "high"/"medium"/"low",
  "detectedLocations": ["list of detected specific locations if any"],
  "reason": "brief explanation"
}

Only set containsLocation to true if you find SPECIFIC location identifiers that could help someone pinpoint the exact heritage site location.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to verify location content' },
        { status: 500 }
      )
    }

    const data: GeminiResponse = await response.json()

    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from verification service' },
        { status: 500 }
      )
    }

    // Parse the JSON response from Gemini
    try {
      // Extract JSON from the response (handle markdown code blocks if present)
      let jsonStr = responseText
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }

      const result = JSON.parse(jsonStr.trim())

      return NextResponse.json({
        success: true,
        containsLocation: result.containsLocation || false,
        confidence: result.confidence || 'low',
        detectedLocations: result.detectedLocations || [],
        reason: result.reason || '',
      })
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText)
      // If parsing fails, assume safe (don't block user)
      return NextResponse.json({
        success: true,
        containsLocation: false,
        confidence: 'low',
        detectedLocations: [],
        reason: 'Unable to parse verification response',
      })
    }
  } catch (error) {
    console.error('Location verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error during verification' },
      { status: 500 }
    )
  }
}
