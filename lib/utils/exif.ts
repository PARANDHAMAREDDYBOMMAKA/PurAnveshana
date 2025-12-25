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
      gps: true,
      tiff: true,
      xmp: true,
      icc: true,
      iptc: true,
      jfif: true,
      ihdr: true,
      pick: undefined,
      skip: undefined,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
      sanitize: true,
      mergeOutput: true,
    })

    console.log('Extracted EXIF data:', exif)

    if (!exif) {
      return {
        isVerified: false,
        cameraModel: null,
        latitude: null,
        longitude: null,
      }
    }

    const hasCameraInfo = !!(exif.Make || exif.Model || exif.Software)

    let cameraModel = null
    if (exif.Make && exif.Model) {
      cameraModel = `${exif.Make} ${exif.Model}`
    } else if (exif.Model) {
      cameraModel = exif.Model
    } else if (exif.Make) {
      cameraModel = exif.Make
    } else if (exif.Software) {
      cameraModel = exif.Software
    }

    let latitude = exif.latitude || exif.GPSLatitude || null
    let longitude = exif.longitude || exif.GPSLongitude || null

    return {
      isVerified: hasCameraInfo,
      cameraModel: cameraModel,
      latitude: latitude,
      longitude: longitude,
      captureDate: exif.DateTimeOriginal || exif.DateTime || exif.DateTimeDigitized || null
    }
  } catch (error) {
    console.error('EXIF extraction error:', error)
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
