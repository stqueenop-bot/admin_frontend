'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Zap,
  Wallet,
  Settings,
  Bot,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    label: 'Manual Order',
    href: '/dashboard/manual-order',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    label: 'Live Orders',
    href: '/dashboard/live-orders',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    label: 'Spend Tracker',
    href: '/dashboard/spend-tracker',
    icon: Wallet,
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    label: 'API Manager',
    href: '/dashboard/api-manager',
    icon: Settings,
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    label: 'Telegram Bots',
    href: '/dashboard/telegram-bots',
    icon: Bot,
    gradient: 'from-indigo-400 to-violet-500',
  },
  {
    label: 'Banners',
    href: '/dashboard/banners',
    icon: FileText, // I'll use FileText or similar, let's check lucide-react icons in the file
    gradient: 'from-orange-400 to-rose-500',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-violet-900 via-purple-900 to-indigo-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
              Fastxera
            </h1>
            <p className="text-xs text-purple-300">Admin Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-white/15 shadow-lg'
                    : 'hover:bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                      : 'bg-white/10 group-hover:bg-white/20'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    'font-medium transition-colors',
                    isActive ? 'text-white' : 'text-purple-200 group-hover:text-white'
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-8 rounded-full bg-gradient-to-b from-pink-400 to-violet-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-200 hover:text-white hover:bg-white/10 transition-all duration-200 w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

