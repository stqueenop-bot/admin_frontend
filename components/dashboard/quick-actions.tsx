'use client'

import Link from 'next/link'
import { FileText, Zap, Wallet, Settings } from 'lucide-react'

const actions = [
  {
    label: 'New Order',
    description: 'Place a manual SMM order',
    href: '/dashboard/manual-order',
    icon: FileText,
    gradient: 'from-violet-500 to-purple-600',
    hoverGradient: 'hover:from-violet-600 hover:to-purple-700',
  },
  {
    label: 'View Live Orders',
    description: 'Monitor order progress',
    href: '/dashboard/live-orders',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    hoverGradient: 'hover:from-amber-500 hover:to-orange-600',
  },
  {
    label: 'Track Spending',
    description: 'View expense reports',
    href: '/dashboard/spend-tracker',
    icon: Wallet,
    gradient: 'from-emerald-400 to-teal-500',
    hoverGradient: 'hover:from-emerald-500 hover:to-teal-600',
  },
  {
    label: 'Manage APIs',
    description: 'Configure API settings',
    href: '/dashboard/api-manager',
    icon: Settings,
    gradient: 'from-pink-500 to-rose-500',
    hoverGradient: 'hover:from-pink-600 hover:to-rose-600',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 p-3 sm:p-4 lg:p-6">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Quick Actions</h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 lg:mb-6">Common tasks and shortcuts</p>

      <div className="grid grid-cols-2 xl:grid-cols-1 gap-2 sm:gap-3 lg:gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r ${action.gradient} ${action.hoverGradient} p-3 sm:p-4 lg:p-5 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 rounded-full bg-white/10 blur-xl transition-transform group-hover:scale-150" />

              <div className="relative flex items-start gap-2 sm:gap-3 lg:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm lg:text-base leading-tight">{action.label}</h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-white/80 mt-0.5 hidden sm:block">{action.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
