'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Send, Instagram, Hash, Link as LinkIcon, Package, DollarSign, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface OrderFormData {
  serviceId: string
  link: string
}

export default function ManualOrderPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<OrderFormData>({
    serviceId: '602', // Default to Reel Views
    link: '',
  })

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      return api.createOrder({
        serviceId: parseInt(data.serviceId),
        link: data.link,
        quantity: 1000, // Default for manual order panel
        amount: 0,
        remark: `[Manual Order][Admin] Service: ${data.serviceId}`,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Order created successfully!')
      setFormData({ serviceId: '602', link: '' })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create order. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createOrderMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manual Order</h1>
        <p className="text-gray-500 mt-1">Place a new Instagram SMM order manually</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">Fill in the order information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-500" />
                    Service Details
                  </label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  >
                    <option value="602">602 - Reel Views (Supportive)</option>
                    <option value="670">670 - Comments (Supportive)</option>
                    <option value="3924">3924 - Likes (IND SMM)</option>
                    <option value="3822">3822 - Followers (IND SMM)</option>
                    <option value="554">554 - Likes (Supportive - Old)</option>
                    <option value="12560">12560 - Followers (TNT - Old)</option>
                  </select>
                </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-purple-500" />
                  Instagram Link
                </label>
                <Input
                  name="link"
                  type="text"
                  placeholder="Paste the link or username here..."
                  value={formData.link}
                  onChange={handleChange}
                  className="rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>



              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Create Order
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-xl shadow-pink-500/25 p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Order Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                <span>Make sure the Instagram link is public and accessible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                <span>Service IDs: 602 (Reel Views), 554 (Likes), 12560 (Followers)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                <span>Orders typically start processing within minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
                <span>Use remarks for special delivery instructions</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl shadow-orange-500/25 p-6 text-white">
            <h3 className="text-lg font-bold mb-3">Service IDs</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/20 rounded-xl px-4 py-3">
                <span className="font-medium">#602 - Reel Views</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">Supportive</span>
              </div>
              <div className="flex items-center justify-between bg-white/20 rounded-xl px-4 py-3">
                <span className="font-medium">#554 - Likes</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">Supportive</span>
              </div>
              <div className="flex items-center justify-between bg-white/20 rounded-xl px-4 py-3">
                <span className="font-medium">#12560 - Followers</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-lg">TNT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
