'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.forgotPassword(email.trim())
      if (response.success) {
        setIsSubmitted(true)
        toast.success(response.message || 'Reset link sent to your email.')
      } else {
        toast.error(response.message || 'Failed to process request.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Welcome Text */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="text-gray-500 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl border-gray-200 pl-12 text-base focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900 mb-2">Check your email</h3>
            <p className="text-sm text-emerald-700">
              We've sent a password reset link to <span className="font-bold">{email}</span>.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 w-full rounded-xl border-emerald-200 hover:bg-emerald-100 text-emerald-700"
            >
              Didn't receive it? Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
