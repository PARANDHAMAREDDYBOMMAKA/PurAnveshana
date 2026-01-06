'use client'

import { useRouter, usePathname } from 'next/navigation'
import { MapPin, Home, DollarSign, HeadphonesIcon } from 'lucide-react'

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Yatra',
      path: '/dashboard/yatra',
      icon: MapPin,
      gradient: 'from-orange-500 to-amber-500',
      color: 'text-orange-600'
    },
    {
      name: 'Anveshan',
      path: '/dashboard',
      icon: Home,
      gradient: 'from-blue-500 to-cyan-500',
      color: 'text-blue-600'
    },
    {
      name: 'Payments',
      path: '/dashboard/payment-history',
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-500',
      color: 'text-emerald-600'
    },
    {
      name: 'Support',
      path: '/dashboard/support',
      icon: HeadphonesIcon,
      gradient: 'from-purple-500 to-pink-500',
      color: 'text-purple-600'
    },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-2xl z-50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full group"
            >
              {active && (
                <div className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-linear-to-r ${item.gradient}`}></div>
              )}

              <div className={`relative transition-all duration-300 ${active ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                {active && (
                  <>
                    <div className={`absolute inset-0 bg-linear-to-r ${item.gradient} rounded-xl blur-lg opacity-50`}></div>
                    <div className={`absolute inset-0 bg-linear-to-r ${item.gradient} rounded-xl`}></div>
                  </>
                )}
                <div className={`relative p-2 rounded-xl ${active ? '' : 'group-hover:bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : item.color + ' group-hover:' + item.color}`} />
                </div>
              </div>

              {/* Label */}
              <span className={`text-xs font-semibold transition-colors ${
                active
                  ? `bg-linear-to-r ${item.gradient} bg-clip-text text-transparent`
                  : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                {item.name}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
