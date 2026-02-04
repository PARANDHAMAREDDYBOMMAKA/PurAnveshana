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

const cardStyle = {
  background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
  boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)',
}

const infoBoxStyle = {
  background: 'linear-gradient(145deg, #fef9f0 0%, #fdf5e6 100%)',
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

  const steps = [
    { title: 'Select Site', icon: MapPin, required: true },
    { title: 'Yatra Title', icon: Compass, required: true },
    { title: 'Discovery Context', icon: Footprints, required: true },
    { title: 'Journey & Effort', icon: Footprints, required: true },
    { title: 'Historical Indicators', icon: Landmark, required: true },
    { title: 'Evidence Summary', icon: FileText, required: true },
    { title: 'Safe Visuals', icon: ImageIcon, required: false },
    { title: 'Personal Reflection', icon: Heart, required: false },
    { title: 'Review & Submit', icon: CheckCircle2, required: true },
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
        return true

      case 7:
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

    if (uploadedImages.length + files.length > 3) {
      toast.error('You can upload a maximum of 3 images')
      return
    }

    const newImages: ImageWithPreview[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        continue
      }

      const reader = new FileReader()
      const preview = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })

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

        toast.success(`${file.name} verified`)
      } catch (error) {
        toast.error(`${file.name}: Failed to extract EXIF data`)
        continue
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages])

    if (newImages.length > 0) {
      toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added`)
    }

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
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Which heritage site is this about?
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Select the site you&apos;d like to share your discovery journey about
              </p>
            </div>

            <div className="space-y-4">
              {paidSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setFormData({ ...formData, heritageSiteId: site.id })}
                  className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all ${
                    formData.heritageSiteId === site.id
                      ? 'border-amber-700 ring-1 ring-amber-700/30'
                      : 'border-amber-200/60 hover:border-amber-400'
                  }`}
                  style={cardStyle}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {(site.images[0]?.r2Url || site.images[0]?.cloudinaryUrl) && (
                      <img
                        src={site.images[0]?.r2Url || site.images[0]?.cloudinaryUrl || ''}
                        alt={site.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 ring-2 ring-amber-200/60"
                      />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-bold text-amber-900 text-base sm:text-lg truncate" style={{ fontFamily: 'Georgia, serif' }}>{site.title}</h3>
                      <p className="text-xs sm:text-sm text-amber-800/70 truncate">{site.type}</p>
                    </div>
                    {formData.heritageSiteId === site.id && (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700 shrink-0" />
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
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                What is the title of your Yatra?
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
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
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-amber-900 placeholder:text-amber-800/40 rounded-xl sm:rounded-2xl border border-amber-200/60 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 focus:outline-none"
                style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}
              />
              <div className="mt-2 text-right text-xs sm:text-sm text-amber-800/70">
                {formData.title.length}/80 characters
              </div>
            </div>

            <div className="rounded-xl border border-amber-200/60 p-4" style={infoBoxStyle}>
              <h4 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Guidelines:</h4>
              <ul className="text-sm text-amber-800/80 space-y-1">
                <li>&#10003; Make it descriptive and informative</li>
                <li>&#10007; Avoid exact location names for safety</li>
                <li>&#10007; Don&apos;t use sensational language</li>
              </ul>
            </div>
          </div>
        )

      case 2:
        const wordCount = formData.discoveryContext.trim().split(/\s+/).filter(w => w).length
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                How did you come across this site?
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Share the story of your discovery (150-300 words recommended)
              </p>
            </div>

            <div>
              <textarea
                value={formData.discoveryContext}
                onChange={(e) => setFormData({ ...formData, discoveryContext: e.target.value })}
                placeholder="Was it through local people, elders, family stories? During travel, farming, trekking? Through old maps or texts?"
                rows={8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-amber-900 placeholder:text-amber-800/40 rounded-xl sm:rounded-2xl border border-amber-200/60 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 focus:outline-none resize-none"
                style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}
              />
              <div className="mt-2 flex flex-col sm:flex-row justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
                <span className={`${wordCount < 50 ? 'text-red-600' : wordCount > 300 ? 'text-amber-800' : 'text-green-700'}`}>
                  {wordCount} words {wordCount < 50 && '(minimum 50)'}
                </span>
                <span className="text-amber-800/70">
                  {wordCount >= 150 && wordCount <= 300 ? '&#10003; Perfect length' : '150-300 recommended'}
                </span>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Describe your journey to reach this place
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                How far did you travel? What terrain? Any difficulties?
              </p>
            </div>

            <div>
              <textarea
                value={formData.journeyNarrative}
                onChange={(e) => setFormData({ ...formData, journeyNarrative: e.target.value })}
                placeholder="Describe your journey: distance traveled, terrain crossed (forest, hill, farmland, ruins), weather conditions, lack of paths, or safety risks..."
                rows={8}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-amber-900 placeholder:text-amber-800/40 rounded-xl sm:rounded-2xl border border-amber-200/60 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 focus:outline-none resize-none"
                style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}
              />
              <div className="mt-2 text-right text-xs sm:text-sm">
                <span className={formData.journeyNarrative.length >= 100 ? 'text-green-700' : 'text-amber-800/70'}>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                What historical indicators did you observe?
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Select all that apply from what you personally witnessed
              </p>
            </div>

            <div className="space-y-3">
              {HISTORICAL_INDICATORS.map((indicator) => (
                <label
                  key={indicator}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.historicalIndicators.includes(indicator)
                      ? 'border-amber-700 ring-1 ring-amber-700/30'
                      : 'border-amber-200/60 hover:border-amber-400'
                  }`}
                  style={cardStyle}
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
                    className="w-5 h-5 text-amber-700 rounded focus:ring-amber-500 border-amber-300"
                  />
                  <span className="text-amber-900 font-medium">{indicator}</span>
                </label>
              ))}
            </div>

            {formData.historicalIndicators.length > 0 && (
              <div className="mt-6">
                <label className="block text-amber-900 font-semibold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Briefly explain what you noticed (Optional)
                </label>
                <textarea
                  value={formData.historicalIndicatorsDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, historicalIndicatorsDetails: e.target.value })
                  }
                  placeholder="Describe the indicators in more detail..."
                  rows={4}
                  className="w-full px-4 py-3 text-amber-900 placeholder:text-amber-800/40 rounded-xl border border-amber-200/60 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 focus:outline-none"
                  style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}
                />
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                What evidence did you submit privately?
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Select the types of evidence you&apos;ve provided for verification
              </p>
            </div>

            <div className="space-y-3">
              {EVIDENCE_TYPES.map((evidence) => (
                <label
                  key={evidence}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.evidenceTypes.includes(evidence)
                      ? 'border-amber-700 ring-1 ring-amber-700/30'
                      : 'border-amber-200/60 hover:border-amber-400'
                  }`}
                  style={cardStyle}
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
                    className="w-5 h-5 text-amber-700 rounded focus:ring-amber-500 border-amber-300"
                  />
                  <span className="text-amber-900 font-medium">{evidence}</span>
                </label>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200/60 p-4" style={infoBoxStyle}>
              <p className="text-sm text-amber-800/80">
                <strong className="text-amber-900">Note:</strong> Detailed evidence has been submitted privately to <span className="notranslate" translate="no">Puranveshana</span> for expert review.
              </p>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Add safe visuals for public viewing (Optional)
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Maximum 3 images - only verified images with camera EXIF data accepted
              </p>
            </div>

            {/* Upload Button */}
            {uploadedImages.length < 3 && (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 border border-dashed border-amber-300 rounded-xl hover:border-amber-500 transition-all flex items-center justify-center gap-3 group"
                  style={infoBoxStyle}
                >
                  <Upload className="h-6 w-6 text-amber-700 group-hover:text-amber-800" />
                  <span className="text-amber-800 group-hover:text-amber-900 font-medium">
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
              <div className="rounded-xl border border-amber-200/60 p-4 space-y-3" style={infoBoxStyle}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-amber-900">
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
                      className="relative aspect-square rounded-lg overflow-hidden border border-amber-200/60 group"
                    >
                      <img
                        src={imageData.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      {imageData.isVerified && (
                        <div className="absolute top-1 left-1 bg-green-600 text-white p-1 rounded flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span className="text-[10px] font-semibold">Verified</span>
                        </div>
                      )}

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

            <div className="rounded-xl border border-amber-200/60 p-4" style={infoBoxStyle}>
              <h4 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Requirements:</h4>
              <ul className="text-sm text-amber-800/80 space-y-1">
                <li>&#10003; Maximum 3 images</li>
                <li>&#10003; Images must have valid camera EXIF data (Make/Model)</li>
                <li>&#10003; Images should not reveal exact location</li>
                <li>&#10003; <span className="notranslate" translate="no">Puranveshana</span> may crop, blur, or watermark images for safety</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="text-amber-800 hover:text-amber-900 font-medium"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Skip this step &rarr;
              </button>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Why does this discovery matter? (Optional)
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Share your personal thoughts on its cultural or historical importance
              </p>
            </div>

            <div>
              <textarea
                value={formData.personalReflection}
                onChange={(e) => setFormData({ ...formData, personalReflection: e.target.value })}
                placeholder="Why is this discovery important? Is there a risk of damage or neglect? What personal emotions or sense of responsibility do you feel?"
                rows={6}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-amber-900 placeholder:text-amber-800/40 rounded-xl sm:rounded-2xl border border-amber-200/60 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 focus:outline-none resize-none"
                style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="text-amber-800 hover:text-amber-900 font-medium"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Skip this step &rarr;
              </button>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2 sm:mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                Review Your Submission
              </h2>
              <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Please review all information before submitting
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/60 p-6 space-y-4" style={cardStyle}>
              <div>
                <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Heritage Site</h3>
                <p className="text-amber-800/80">{selectedSite?.title}</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Yatra Title</h3>
                <p className="text-amber-800/80">{formData.title}</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Discovery Context</h3>
                <p className="text-amber-800/80 line-clamp-3">{formData.discoveryContext}</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Historical Indicators</h3>
                <p className="text-amber-800/80">{formData.historicalIndicators.join(', ')}</p>
              </div>

              <div>
                <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Evidence Types</h3>
                <p className="text-amber-800/80">{formData.evidenceTypes.join(', ')}</p>
              </div>

              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Safe Visuals</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={img.preview}
                          alt={`Visual ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {img.isVerified && (
                          <div className="absolute top-1 left-1 bg-green-600 text-white p-1 rounded">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-amber-600/30 p-6" style={{ background: 'linear-gradient(145deg, #fef9f0 0%, #fdf5e6 100%)' }}>
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.submissionConfirmed}
                  onChange={(e) =>
                    setFormData({ ...formData, submissionConfirmed: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-amber-700 rounded focus:ring-amber-500 border-amber-300"
                />
                <div>
                  <p className="text-amber-900 font-semibold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Declaration</p>
                  <p className="text-amber-800/80 text-sm">
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/dashboard/yatra')}
          className="flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-6 group transition-colors"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>Back to Yatra Gallery</span>
        </button>

        {/* Progress Bar */}
        <div
          className="relative mb-8 sm:mb-12 rounded-2xl p-5 sm:p-6 border border-amber-200/60 overflow-hidden"
          style={cardStyle}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-amber-800/70">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-600 to-amber-700 transition-all duration-500 rounded-full"
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
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-amber-800 text-amber-50 shadow-lg shadow-amber-900/20'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isCompleted ? <Check className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                    </div>
                    <span className={`text-xs text-center ${isCurrent ? 'text-amber-900 font-semibold' : 'text-amber-800/70'}`}>
                      {step.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div
          className="relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border border-amber-200/60 overflow-hidden"
          style={{ ...cardStyle, boxShadow: '0 8px 40px rgba(139, 90, 43, 0.12)' }}
        >
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
            <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
            <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
            <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
            <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
          </div>
          <div className="relative">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-amber-200/60 font-semibold text-sm sm:text-base text-amber-800 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold text-sm sm:text-base shadow-lg shadow-amber-900/20 transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Next
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.submissionConfirmed}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-green-600 to-emerald-700 text-white font-semibold text-sm sm:text-base hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ fontFamily: 'Georgia, serif' }}
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
