import * as exifr from 'exifr'

export interface ExifData {
  isVerified: boolean
  cameraModel: string | null
  latitude: number | null
  longitude: number | null
  location?: string
  captureDate?: Date | null
}

export async function extractExifData(file: File): Promise<ExifData> {
  try {
    const exif = await exifr.parse(file, {
      pick: ['Make', 'Model', 'latitude', 'longitude', 'DateTimeOriginal', 'Software', 'ISO', 'FNumber', 'ExposureTime'],
    })

    if (!exif) {
      return {
        isVerified: false,
        cameraModel: null,
        latitude: null,
        longitude: null,
      }
    }

    // Verification based on camera details:
    // Image is verified if it has BOTH Make AND Model (camera identification)
    const hasBothMakeAndModel = !!(exif.Make && exif.Model)

    // Construct camera model string
    const cameraModel = exif.Make && exif.Model
      ? `${exif.Make} ${exif.Model}`
      : null

    // Extract GPS coordinates
    const latitude = exif.latitude || null
    const longitude = exif.longitude || null

    // Return verification based on presence of camera details
    return {
      isVerified: hasBothMakeAndModel,
      cameraModel: cameraModel,
      latitude: latitude,
      longitude: longitude,
      captureDate: exif.DateTimeOriginal || null
    }
  } catch (error) {
    console.error('Error extracting EXIF data:', error)
    return {
      isVerified: false,
      cameraModel: null,
      latitude: null,
      longitude: null,
    }
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    // Using OpenStreetMap Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'ImageVerificationApp/1.0',
        },
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.display_name || null
  } catch (error) {
    console.error('Error reverse geocoding:', error)
    return null
  }
}
