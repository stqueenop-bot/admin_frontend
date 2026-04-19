'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Instagram, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.login(email.trim(), password)
      
      if (response.success) {
        toast.success(response.message || 'Login successful! Welcome back.')
        const { token, user } = response.data!
        
        // Store session data
        localStorage.setItem('admin_email', user.email)
        localStorage.setItem('admin_role', user.role)
        
        // Set cookies (readable by middleware) - 7 days
        const maxAge = 7 * 24 * 60 * 60
        document.cookie = `admin_token=${token}; path=/; max-age=${maxAge}`
        document.cookie = `admin_role=${user.role}; path=/; max-age=${maxAge}`
        document.cookie = `admin_session=${user.email}; path=/; max-age=${maxAge}`

        router.push('/dashboard')
      } else {
        toast.error(response.message || 'Access denied.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SMM Panel
              </h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access the admin portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl border-gray-200 pl-12 text-base focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-xl border-gray-200 pl-12 text-base focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <p className="text-sm font-medium text-purple-900 mb-2">Admin Security</p>
            <p className="text-xs text-purple-600">
              Please enter your registered admin email address or authorized Admin ID to access the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-400/20 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl">
            <Instagram className="w-14 h-14" />
          </div>
          
          <h2 className="text-4xl font-bold text-center mb-4">
            Manage Your SMM Orders
          </h2>
          <p className="text-lg text-white/80 text-center max-w-md mb-12">
            A powerful dashboard to track orders, manage APIs, and monitor your Instagram SMM business
          </p>

          {/* Feature list */}
          <div className="space-y-4 w-full max-w-sm">
            {[
              'Real-time order tracking',
              'Multi-API management',
              'Telegram bot integrations',
              'Expense tracking & analytics',
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
