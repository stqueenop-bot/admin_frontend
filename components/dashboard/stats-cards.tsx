'use client'

import { ShoppingCart, DollarSign, Zap, Bot } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

const cardConfigs = [
  {
    key: 'totalOrders',
    label: 'Total Orders',
    icon: ShoppingCart,
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/25',
    format: (value: number) => value.toLocaleString(),
  },
  {
    key: 'totalRevenue',
    label: 'Total Revenue',
    icon: DollarSign,
    gradient: 'from-emerald-400 to-teal-500',
    shadowColor: 'shadow-emerald-500/25',
    format: (value: number) => `$${value.toLocaleString()}`,
  },
  {
    key: 'activeApis',
    label: 'Active APIs',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-500/25',
    format: (value: number) => value.toString(),
  },
  {
    key: 'telegramBots',
    label: 'Telegram Bots',
    icon: Bot,
    gradient: 'from-pink-500 to-rose-500',
    shadowColor: 'shadow-pink-500/25',
    format: (value: number) => value.toString(),
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cardConfigs.map((config) => {
        const Icon = config.icon
        const value = stats[config.key as keyof DashboardStats] as number

        return (
          <div
            key={config.key}
            className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${config.gradient} p-3 sm:p-4 lg:p-6 text-white shadow-xl ${config.shadowColor}`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 rounded-full bg-black/10 blur-xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium bg-white/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Live
                </div>
              </div>

              <p className="text-lg sm:text-2xl lg:text-3xl font-bold">{config.format(value)}</p>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5 sm:mt-1">{config.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
