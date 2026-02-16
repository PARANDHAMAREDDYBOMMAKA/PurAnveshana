'use client'

import { useEffect, useState, useCallback } from 'react'
import { driver, DriveStep } from 'driver.js'
import 'driver.js/dist/driver.css'
import { Sparkles } from 'lucide-react'

const STORAGE_KEY = 'puranveshana_dashboard_tour'

const tourSteps: DriveStep[] = [
  {
    popover: {
      title: 'Welcome to Puranveshana',
      description: `
        <div class="space-y-4">
          <p class="font-semibold text-amber-900 text-base">
            Your journey to discover heritage begins here!
          </p>
          <p class="text-amber-800">
            Upload photos of ancient temples, wells, forts or any historical places near you and <span class="font-bold text-amber-700">earn money</span> for every verified submission.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm text-amber-900 font-semibold">
              Take photos, upload them, and get rewarded!
            </p>
          </div>
        </div>
      `,
    },
  },
  {
    element: '[data-tour="anveshan-header"]',
    popover: {
      title: 'What is Anveshan?',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            <span class="font-bold text-amber-700">Anveshan</span> means <span class="font-semibold text-amber-900">discovery</span> or <span class="font-semibold text-amber-900">exploration</span>.
          </p>
          <p class="text-amber-800">
            This is your main dashboard where you can discover and document heritage sites around you.
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-semibold text-amber-900">
              You will receive payment for every new site you upload!
            </p>
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="upload-button"]',
    popover: {
      title: 'Upload Heritage Photos',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Tap this button to <span class="font-bold text-amber-700">upload your photos</span> of heritage sites.
          </p>
          <div class="bg-amber-50 rounded-xl p-4 space-y-3 border border-amber-200">
            <p class="text-sm font-bold text-amber-900">What you can upload:</p>
            <ul class="text-sm text-amber-800 space-y-2">
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span>Ancient Temples and Mosques</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span>Historical Wells and Step-wells</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span>Old Forts and Palaces</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span>Archaeological Sites</span>
              </li>
            </ul>
          </div>
        </div>
      `,
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '[data-tour="stats-section"]',
    popover: {
      title: 'Track Your Progress',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Here you can see how many <span class="font-bold text-amber-700">sites you uploaded</span>, how many <span class="font-bold text-amber-700">photos</span> you shared, and how much <span class="font-bold text-amber-700">reward</span> you earned.
          </p>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-amber-100 rounded-xl p-3 text-center border border-amber-200">
              <p class="text-xs font-bold text-amber-900">Sites</p>
            </div>
            <div class="bg-amber-100 rounded-xl p-3 text-center border border-amber-200">
              <p class="text-xs font-bold text-amber-900">Photos</p>
            </div>
            <div class="bg-amber-100 rounded-xl p-3 text-center border border-amber-200">
              <p class="text-xs font-bold text-amber-900">Rewards</p>
            </div>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '[data-tour="mobile-bottom-nav"]',
    popover: {
      title: 'Navigation Bar',
      description: `
        <div class="space-y-4">
          <p class="text-amber-800">
            Use this bottom navigation to move between sections:
          </p>
          <div class="bg-amber-50 rounded-xl p-4 space-y-3 border border-amber-200">
            <ul class="text-sm text-amber-800 space-y-2">
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span><strong>Yatra</strong> - Write and read heritage stories</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span><strong>Anveshan</strong> - Upload heritage photos</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span><strong>Payments</strong> - Track your earnings</span>
              </li>
              <li class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" style="background: #78350f;"></div>
                <span><strong>Support</strong> - Get help anytime</span>
              </li>
            </ul>
          </div>
        </div>
      `,
      side: 'top',
      align: 'center',
    },
  },
  {
    popover: {
      title: 'You Are Ready!',
      description: `
        <div class="space-y-4">
          <p class="font-semibold text-amber-900 text-base">
            Now you know how to use Puranveshana!
          </p>
          <p class="text-amber-800">
            Start by taking photos of heritage sites near you and upload them. Every verified upload earns you <span class="font-bold text-amber-700">real money</span>!
          </p>
          <div class="bg-amber-100 rounded-xl p-4 border border-amber-200">
            <p class="text-sm font-bold text-amber-900">
              Tip: Take clear photos where the heritage site is clearly visible for faster verification!
            </p>
          </div>
        </div>
      `,
    },
  },
]

export default function DashboardTour() {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(STORAGE_KEY)
    if (hasSeenTour) return

    const timer = setTimeout(() => {
      setShowWelcome(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
      doneBtnText: 'Get Started',
      progressText: '{{current}} / {{total}}',
      popoverClass: 'puranveshana-driver-popover',
      smoothScroll: true,
      disableActiveInteraction: false,
      onDestroyStarted: () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        driverInstance.destroy()
      },
      onCloseClick: () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        driverInstance.destroy()
      },
    })

    setTimeout(() => driverInstance.drive(), 300)
  }, [])

  const skipTour = useCallback(() => {
    setShowWelcome(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }, [])

  if (!showWelcome || (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY))) return null

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
            <Sparkles className="w-10 h-10 text-amber-50" />
          </div>

          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: 'Georgia, serif', color: '#78350f' }}
          >
            Welcome!
          </h2>

          <p className="mb-5 leading-relaxed text-base" style={{ color: '#92400e' }}>
            Welcome to Puranveshana! Would you like a quick tour to learn how to use the app?
          </p>

          <div
            className="rounded-xl p-4 mb-6"
            style={{ background: 'rgba(254, 243, 199, 0.6)', border: '1px solid rgba(120, 53, 15, 0.2)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#78350f' }}>
              Takes only 2-3 minutes to learn everything!
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
              style={{ border: '2px solid rgba(120, 53, 15, 0.2)', color: '#92400e' }}
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

export function useTourReset() {
  const resetTour = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }, [])

  return { resetTour }
}
