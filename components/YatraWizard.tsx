'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Compass,
  Footprints,
  Landmark,
  FileText,
  Image as ImageIcon,
  Heart,
  CheckCircle2,
  Upload,
  X
} from 'lucide-react'
import { uploadFile } from '@/lib/cloudinary/upload'
import { extractExifData } from '@/lib/utils/exif'

interface HeritageSite {
  id: string
  title: string
  type: string | null
  images: {
    r2Url: string | null
    cloudinaryUrl: string | null
    location: string
  }[]
}

interface YatraWizardProps {
  paidSites: HeritageSite[]
  selectedSiteId: string | null
  isEditMode?: boolean
  initialData?: {
    id: string
    heritageSiteId: string
    title: string
    discoveryContext: string
    journeyNarrative: string
    historicalIndicators: string[]
    historicalIndicatorsDetails: string | null
    evidenceTypes: string[]
    safeVisuals: string[]
    personalReflection: string | null
    submissionConfirmed: boolean
  }
}

const HISTORICAL_INDICATORS = [
  'Stone structures',
  'Inscriptions or scripts',
  'Sculptures, carvings, or motifs',
  'Ruins, foundations, or collapsed structures',
  'Local oral history or legends'
]

const EVIDENCE_TYPES = [
  'Photographs',
  'Sketches or drawings',
  'Written notes or measurements',
  'Local testimonies'
]

interface ImageWithPreview {
  file: File
  preview: string
  isVerified: boolean
  cameraModel: string | null
  uploadedUrl?: string
}

export default function YatraWizard({ paidSites, selectedSiteId, isEditMode = false, initialData }: YatraWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<ImageWithPreview[]>([])

  const [formData, setFormData] = useState({
    // Step 0: Site Selection
    heritageSiteId: initialData?.heritageSiteId || selectedSiteId || (paidSites.length > 0 ? paidSites[0].id : ''),

    // Step 1: Yatra Title
    title: initialData?.title || '',

    // Step 2: Discovery Context
    discoveryContext: initialData?.discoveryContext || '',

    // Step 3: Journey & Effort
    journeyNarrative: initialData?.journeyNarrative || '',

    // Step 4: Historical Indicators
    historicalIndicators: initialData?.historicalIndicators || ([] as string[]),
    historicalIndicatorsDetails: initialData?.historicalIndicatorsDetails || '',

    // Step 5: Evidence Summary
    evidenceTypes: initialData?.evidenceTypes || ([] as string[]),

    // Step 6: Safe Visuals
    safeVisuals: initialData?.safeVisuals || ([] as string[]),

    // Step 7: Personal Reflection
    personalReflection: initialData?.personalReflection || '',

    // Step 8: Declaration
    submissionConfirmed: initialData?.submissionConfirmed || false,
  })

  const selectedSite = paidSites.find((site) => site.id === formData.heritageSiteId)
  const imageUrl = selectedSite?.images[0]?.r2Url || selectedSite?.images[0]?.cloudinaryUrl

  const steps = [
    {
      title: 'Select Site',
      icon: MapPin,
      required: true,
    },
    {
      title: 'Yatra Title',
      icon: Compass,
      required: true,
    },
    {
      title: 'Discovery Context',
      icon: Footprints,
      required: true,
    },
    {
      title: 'Journey & Effort',
      icon: Footprints,
      required: true,
    },
    {
      title: 'Historical Indicators',
      icon: Landmark,
      required: true,
    },
    {
      title: 'Evidence Summary',
      icon: FileText,
      required: true,
    },
    {
      title: 'Safe Visuals',
      icon: ImageIcon,
      required: false,
    },
    {
      title: 'Personal Reflection',
      icon: Heart,
      required: false,
    },
    {
      title: 'Review & Submit',
      icon: CheckCircle2,
      required: true,
    },
  ]

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.heritageSiteId) {
          toast.error('Please select a heritage site')
          return false
        }
        return true

      case 1:
        if (!formData.title.trim()) {
          toast.error('Please enter a title for your Yatra')
          return false
        }
        if (formData.title.length > 80) {
          toast.error('Title must be 80 characters or less')
          return false
        }
        return true

      case 2:
        const wordCount = formData.discoveryContext.trim().split(/\s+/).length
        if (!formData.discoveryContext.trim()) {
          toast.error('Please describe how you discovered this site')
          return false
        }
        if (wordCount < 50) {
          toast.error('Discovery context must be at least 50 words (150-300 recommended)')
          return false
        }
        if (wordCount > 400) {
          toast.error('Discovery context is too long. Please keep it under 400 words.')
          return false
        }
        return true

      case 3:
        if (!formData.journeyNarrative.trim()) {
          toast.error('Please describe your journey to reach this place')
          return false
        }
        if (formData.journeyNarrative.length < 100) {
          toast.error('Journey description must be at least 100 characters')
          return false
        }
        return true

      case 4:
        if (formData.historicalIndicators.length === 0) {
          toast.error('Please select at least one historical indicator')
          return false
        }
        return true

      case 5:
        if (formData.evidenceTypes.length === 0) {
          toast.error('Please select at least one type of evidence')
          return false
        }
        return true

      case 6:
        // Optional step
        return true

      case 7:
        // Optional step
        return true

      case 8:
        if (!formData.submissionConfirmed) {
          toast.error('Please confirm that the information is true and sensitive details are excluded')
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > 3) {
      toast.error('You can upload a maximum of 3 images')
      return
    }

    const newImages: ImageWithPreview[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

      // Create preview
      const reader = new FileReader()
      const preview = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

      // Extract EXIF data
      try {
        const exifData = await extractExifData(file)

        if (!exifData.isVerified) {
          toast.error(`${file.name}: Image rejected - No valid camera EXIF data (Make/Model required)`)
          continue
        }

        newImages.push({
          file,
          preview,
          isVerified: exifData.isVerified,
          cameraModel: exifData.cameraModel,
        })

        toast.success(`${file.name} verified ✓`)
      } catch (error) {
        toast.error(`${file.name}: Failed to extract EXIF data`)
        continue
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages])

    if (newImages.length > 0) {
      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added`)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    toast.success('Image removed')
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      // Upload images first if any
      const uploadedUrls: string[] = []

      if (uploadedImages.length > 0) {
        toast.loading(`Uploading ${uploadedImages.length} image${uploadedImages.length > 1 ? 's' : ''}...`)

        for (const imageData of uploadedImages) {
          try {
            const uploadResult = await uploadFile(imageData.file)
            const url = uploadResult.r2Url || uploadResult.url
            uploadedUrls.push(url)
          } catch (error) {
            console.error('Error uploading image:', error)
            toast.error(`Failed to upload ${imageData.file.name}`)
          }
        }

        toast.dismiss()

        if (uploadedUrls.length > 0) {
          toast.success(`${uploadedUrls.length} image${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully`)
        }
      }

      // Submit form with uploaded image URLs
      const url = isEditMode ? `/api/yatra/${initialData?.id}` : '/api/yatra'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          safeVisuals: uploadedUrls.length > 0 ? uploadedUrls : formData.safeVisuals,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(isEditMode ? 'Story updated successfully!' : 'Yatra story submitted successfully! Awaiting review.')
        router.push(isEditMode ? `/dashboard/yatra/${initialData?.id}` : '/dashboard/yatra')
      } else {
        toast.error(data.error || (isEditMode ? 'Failed to update story' : 'Failed to create story'))
      }
    } catch (error) {
      console.error('Error creating story:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Which heritage site is this about?
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Select the site you'd like to share your discovery journey about
              </p>
            </div>

            <div className="space-y-4">
              {paidSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setFormData({ ...formData, heritageSiteId: site.id })}
                  className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all ${
                    formData.heritageSiteId === site.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {(site.images[0]?.r2Url || site.images[0]?.cloudinaryUrl) && (
                      <img
                        src={site.images[0]?.r2Url || site.images[0]?.cloudinaryUrl || ''}
                        alt={site.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{site.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-900 truncate">{site.type}</p>
                    </div>
                    {formData.heritageSiteId === site.id && (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                What is the title of your Yatra?
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Keep it within 80 characters, descriptive but not sensational
              </p>
            </div>

            <div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E.g., Ancient temple ruins in..."
                maxLength={80}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
              />
              <div className="mt-2 text-right text-xs sm:text-sm text-gray-900">
                {formData.title.length}/80 characters
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Guidelines:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Make it descriptive and informative</li>
                <li>✗ Avoid exact location names for safety</li>
                <li>✗ Don't use sensational language</li>
              </ul>
            </div>
          </div>
        )

      case 2:
        const wordCount = formData.discoveryContext.trim().split(/\s+/).filter(w => w).length
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                How did you come across this site?
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Share the story of your discovery (150-300 words recommended)
              </p>
            </div>

            <div>
              <textarea
                value={formData.discoveryContext}
                onChange={(e) => setFormData({ ...formData, discoveryContext: e.target.value })}
                placeholder="Was it through local people, elders, family stories? During travel, farming, trekking? Through old maps or texts?"
                rows={8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-400 sm:placeholder:text-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none resize-none"
              />
              <div className="mt-2 flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                <span className={`${wordCount < 50 ? 'text-red-600' : wordCount > 300 ? 'text-orange-600' : 'text-green-600'}`}>
                  {wordCount} words {wordCount < 50 && '(minimum 50)'}
                </span>
                <span className="text-gray-900">
                  {wordCount >= 150 && wordCount <= 300 ? '✓ Perfect length' : '150-300 recommended'}
                </span>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Describe your journey to reach this place
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                How far did you travel? What terrain? Any difficulties?
              </p>
            </div>

            <div>
              <textarea
                value={formData.journeyNarrative}
                onChange={(e) => setFormData({ ...formData, journeyNarrative: e.target.value })}
                placeholder="Describe your journey: distance traveled, terrain crossed (forest, hill, farmland, ruins), weather conditions, lack of paths, or safety risks..."
                rows={8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-400 sm:placeholder:text-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none resize-none"
              />
              <div className="mt-2 text-right text-xs sm:text-sm">
                <span className={formData.journeyNarrative.length >= 100 ? 'text-green-600' : 'text-gray-900'}>
                  {formData.journeyNarrative.length} characters (minimum 100)
                </span>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                What historical indicators did you observe?
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Select all that apply from what you personally witnessed
              </p>
            </div>

            <div className="space-y-3">
              {HISTORICAL_INDICATORS.map((indicator) => (
                <label
                  key={indicator}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={formData.historicalIndicators.includes(indicator)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          historicalIndicators: [...formData.historicalIndicators, indicator],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          historicalIndicators: formData.historicalIndicators.filter(
                            (i) => i !== indicator
                          ),
                        })
                      }
                    }}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-900 font-medium">{indicator}</span>
                </label>
              ))}
            </div>

            {formData.historicalIndicators.length > 0 && (
              <div className="mt-6">
                <label className="block text-gray-900 font-semibold mb-2">
                  Briefly explain what you noticed (Optional)
                </label>
                <textarea
                  value={formData.historicalIndicatorsDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, historicalIndicatorsDetails: e.target.value })
                  }
                  placeholder="Describe the indicators in more detail..."
                  rows={4}
                  className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-900 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                What evidence did you submit privately?
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Select the types of evidence you've provided for verification
              </p>
            </div>

            <div className="space-y-3">
              {EVIDENCE_TYPES.map((evidence) => (
                <label
                  key={evidence}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={formData.evidenceTypes.includes(evidence)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          evidenceTypes: [...formData.evidenceTypes, evidence],
                        })
                      } else {
                        setFormData({
                          ...formData,
                          evidenceTypes: formData.evidenceTypes.filter((t) => t !== evidence),
                        })
                      }
                    }}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-gray-900 font-medium">{evidence}</span>
                </label>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-900">
                <strong>Note:</strong> Detailed evidence has been submitted privately to <span className="notranslate" translate="no">Puranveshana</span> for expert review.
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Add safe visuals for public viewing (Optional)
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Maximum 3 images - only verified images with camera EXIF data accepted
              </p>
            </div>

            {/* Upload Button */}
            {uploadedImages.length < 3 && (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-center gap-3 group"
                >
                  <Upload className="h-6 w-6 text-gray-900 group-hover:text-orange-600" />
                  <span className="text-gray-900 group-hover:text-orange-600 font-medium">
                    {uploadedImages.length > 0 ? 'Add More Images' : 'Upload Images'}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            )}

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">
                    {uploadedImages.length} / 3 images
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadedImages([])}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((imageData, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                    >
                      <img
                        src={imageData.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      {/* Verified badge */}
                      {imageData.isVerified && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white p-1 rounded flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span className="text-[10px] font-semibold">Verified</span>
                        </div>
                      )}

                      {/* Camera info */}
                      {imageData.cameraModel && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1 text-[10px] truncate">
                          {imageData.cameraModel}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Requirements:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>✓ Maximum 3 images</li>
                <li>✓ Images must have valid camera EXIF data (Make/Model)</li>
                <li>✓ Images should not reveal exact location</li>
                <li>✓ <span className="notranslate" translate="no">Puranveshana</span> may crop, blur, or watermark images for safety</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Skip this step →
              </button>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Why does this discovery matter? (Optional)
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Share your personal thoughts on its cultural or historical importance
              </p>
            </div>

            <div>
              <textarea
                value={formData.personalReflection}
                onChange={(e) => setFormData({ ...formData, personalReflection: e.target.value })}
                placeholder="Why is this discovery important? Is there a risk of damage or neglect? What personal emotions or sense of responsibility do you feel?"
                rows={6}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-400 sm:placeholder:text-gray-900 rounded-xl sm:rounded-2xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Skip this step →
              </button>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                Review Your Submission
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Please review all information before submitting
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Heritage Site</h3>
                <p className="text-gray-700">{selectedSite?.title}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Yatra Title</h3>
                <p className="text-gray-700">{formData.title}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Discovery Context</h3>
                <p className="text-gray-700 line-clamp-3">{formData.discoveryContext}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Historical Indicators</h3>
                <p className="text-gray-700">{formData.historicalIndicators.join(', ')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Evidence Types</h3>
                <p className="text-gray-700">{formData.evidenceTypes.join(', ')}</p>
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Safe Visuals</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={img.preview}
                          alt={`Visual ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {img.isVerified && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white p-1 rounded">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submissionConfirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, submissionConfirmed: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                />
                <div>
                  <p className="text-gray-900 font-semibold mb-1">Declaration</p>
                  <p className="text-gray-700 text-sm">
                    I confirm that the information shared is true to my knowledge and that sensitive
                    details (exact locations, GPS coordinates) have been intentionally excluded to
                    protect the heritage site.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/yatra')}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 group transition-colors"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Yatra Gallery</span>
        </button>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-900">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-900">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="hidden md:flex items-center justify-between mt-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isCompleted = index < currentStep
              const isCurrent = index === currentStep

              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {isCompleted ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                  </div>
                  <span className={`text-xs text-center ${isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-900'}`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border-2 border-gray-300 font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm sm:text-base hover:shadow-lg transition-all"
            >
              Next
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.submissionConfirmed}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm sm:text-base hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">{loading ? 'Submitting...' : 'Submit Yatra'}</span>
              <span className="sm:hidden">{loading ? 'Submitting...' : 'Submit'}</span>
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
