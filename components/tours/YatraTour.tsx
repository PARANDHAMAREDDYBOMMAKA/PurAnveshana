'use client'

import { useEffect, useState, useCallback } from 'react'
import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import { MapPin } from 'lucide-react'

const tourSteps: DriveStep[] = [
  {
    popover: {
      title: 'Welcome to Yatra',
      description: `
        <div class="space-y-4">
          <p class="font-semibold text-amber-900 text-base">
            Your heritage journey storytelling begins here!
          </p>
          <p class="text-amber-800">
            <span class="font-bold text-amber-700">Yatra</span> means <span class="font-semibold">journey</span>. Here you can share your experiences visiting heritage sites and read stories from other explorers.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm text-amber-900 font-semibold">
              Write about your visits and inspire others to explore!
            </p>
          </div>
        </div>
      `,
    },
  },
  {
    element: '[data-tour="yatra-header"]',
    popover: {
      title: 'Yatra Gallery',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            This is your <span class="font-bold text-amber-700">Yatra Gallery</span> - a collection of journey stories from heritage explorers like you.
          </p>
          <p class="text-amber-800">
            Each story shares the experience of discovering ancient temples, forts, wells, and other historical places.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Swipe through stories to read amazing heritage discoveries!
            </p>
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-create-button"]',
    popover: {
      title: 'Create Your Story',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Tap this button to <span class="font-bold text-amber-700">create your own Yatra story</span>.
          </p>
          <p class="text-amber-800">
            Share your experience of visiting a heritage site - describe what you saw, what you learned, and what made it special.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Your story could inspire thousands!
            </p>
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-search"]',
    popover: {
      title: 'Search Stories',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Looking for stories about a specific place? Use the <span class="font-bold text-amber-700">search bar</span> to find them.
          </p>
          <p class="text-amber-800">
            Search by location name, temple name, or any keyword related to the heritage site.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Find stories from your region or favorite places!
            </p>
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-like-button"]',
    popover: {
      title: 'Like Stories',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Enjoyed a story? Tap the <span class="font-bold text-amber-700">heart icon</span> to show your appreciation.
          </p>
          <p class="text-amber-800">
            Your likes help other readers discover the best stories about heritage sites.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Support fellow explorers with a like!
            </p>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-comment-button"]',
    popover: {
      title: 'Comment on Stories',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Want to share your thoughts? Tap the <span class="font-bold text-amber-700">comment icon</span> to leave a message.
          </p>
          <p class="text-amber-800">
            Ask questions, share related experiences, or simply express appreciation for the story.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Connect with other heritage enthusiasts!
            </p>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-share-button"]',
    popover: {
      title: 'Share Stories',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Found an amazing story? Tap the <span class="font-bold text-amber-700">share icon</span> to share it with friends and family.
          </p>
          <p class="text-amber-800">
            Share via WhatsApp, Facebook, Twitter, or copy the link to share anywhere.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Help spread awareness about heritage sites!
            </p>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="yatra-save-button"]',
    popover: {
      title: 'Save Stories',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Want to read a story later? Tap the <span class="font-bold text-amber-700">bookmark icon</span> to save it.
          </p>
          <p class="text-amber-800">
            All your saved stories will be easy to find whenever you want to revisit them.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              Build your collection of favorite stories!
            </p>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    popover: {
      title: 'Start Your Journey!',
      description: `
        <div class="space-y-4">
          <p class="font-semibold text-amber-900 text-base">
            You are ready to explore Yatra!
          </p>
          <p class="text-amber-800">
            Read stories from other explorers or tap <span class="font-bold text-amber-700">Create Story</span> to share your own heritage journey.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-bold text-amber-900">
              Tip: Visit the Anveshan page to upload photos and get rewarded. Then come back here to share your story!
            </p>
          </div>
        </div>
      `,
    },
  },
]

interface YatraTourProps {
  isNewUser?: boolean
}

export default function YatraTour({ isNewUser = false }: YatraTourProps) {
  const [showWelcome, setShowWelcome] = useState(false)
  const storageKey = 'puranveshana_yatra_tour'

  const startTour = useCallback(() => {
    setShowWelcome(false)

    const driverInstance = driver({
      showProgress: true,
      steps: tourSteps,
      animate: true,
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.8)',
      stagePadding: 6,
      stageRadius: 10,
      popoverOffset: 8,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Next',
      prevBtnText: 'Back',
      doneBtnText: 'Start Exploring',
      progressText: '{{current}} / {{total}}',
      popoverClass: 'puranveshana-driver-popover',
      smoothScroll: true,
      disableActiveInteraction: false,
      onDestroyStarted: () => {
        localStorage.setItem(storageKey, 'true')
        driverInstance.destroy()
      },
      onCloseClick: () => {
        localStorage.setItem(storageKey, 'true')
        driverInstance.destroy()
      },
    })

    setTimeout(() => driverInstance.drive(), 300)
  }, [])

  const skipTour = useCallback(() => {
    setShowWelcome(false)
    localStorage.setItem(storageKey, 'true')
  }, [])

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(storageKey)
    if (hasSeenTour) return

    const timer = setTimeout(() => {
      setShowWelcome(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!showWelcome) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-90 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{
          background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
          border: '2px solid rgba(120, 53, 15, 0.2)',
          boxShadow: '0 8px 40px rgba(120, 53, 15, 0.15)',
        }}
      >
        <div className="h-1" style={{ background: '#78350f' }} />

        <div className="p-7 text-center relative">
          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: 'rgba(120, 53, 15, 0.3)' }}></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: 'rgba(120, 53, 15, 0.3)' }}></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: 'rgba(120, 53, 15, 0.3)' }}></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: 'rgba(120, 53, 15, 0.3)' }}></div>

          <div
            className="w-20 h-20 mx-auto mb-5 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: '#78350f', boxShadow: '0 4px 14px rgba(120, 53, 15, 0.3)' }}
          >
            <MapPin className="w-10 h-10 text-amber-50" />
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'Georgia, serif', color: '#78350f' }}
          >
            Welcome to Yatra!
          </h2>

          <p className="mb-5 leading-relaxed text-base" style={{ color: '#92400e' }}>
            This is where heritage journeys come alive! Would you like a quick tour?
          </p>

          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'rgba(254, 243, 199, 0.6)', border: '1px solid rgba(217, 119, 6, 0.3)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#78350f' }}>
              Learn how to read and share heritage stories in just 2 minutes!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={startTour}
              className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all active:scale-[0.98]"
              style={{ background: '#78350f', boxShadow: '0 4px 14px rgba(120, 53, 15, 0.25)' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#451a03'}
              onMouseOut={(e) => e.currentTarget.style.background = '#78350f'}
            >
              Yes, Show Me Around
            </button>

            <button
              onClick={skipTour}
              className="w-full py-3.5 px-6 rounded-xl font-semibold transition-all"
              style={{ border: '2px solid rgba(217, 119, 6, 0.3)', color: '#92400e' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(254, 243, 199, 0.5)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              No, I Will Explore Myself
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useYatraTourReset() {
  const resetTour = useCallback(() => {
    localStorage.removeItem('puranveshana_yatra_tour')
    window.location.reload()
  }, [])

  return { resetTour }
}
