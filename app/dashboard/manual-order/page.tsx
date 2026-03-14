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

interface ServiceOption {
  id: string
  name: string
  panel: string
  presets: number[]
}

const SERVICES: ServiceOption[] = [
  { id: '602', name: 'Reel Views', panel: 'Supportive SMM', presets: [5000, 10000, 25000] },
  { id: '3924', name: 'Likes', panel: 'IND SMM', presets: [1000] },
  { id: '670', name: 'Comments', panel: 'Supportive SMM', presets: [100] },
  { id: '3822', name: 'Followers', panel: 'IND SMM', presets: [50, 100, 200] },
]

export default function ManualOrderPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    serviceId: SERVICES[0].id,
    link: '',
    quantity: SERVICES[0].presets[0].toString(),
  })

  const selectedService = SERVICES.find(s => s.id === formData.serviceId) || SERVICES[0]

  const createOrderMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return api.createOrder({
        serviceId: parseInt(data.serviceId),
        link: data.link,
        quantity: parseInt(data.quantity),
        amount: 0,
        remark: `[Manual Order][Admin] Service: ${data.serviceId} (${selectedService.name})`,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Order created successfully!')
      setFormData(prev => ({ ...prev, link: '' }))
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create order. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.link) {
      toast.error('Please enter a link')
      return
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }
    createOrderMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      // If service changed, reset quantity to its first preset
      if (name === 'serviceId') {
        const newService = SERVICES.find(s => s.id === value)
        if (newService) {
          newData.quantity = newService.presets[0].toString()
        }
      }
      return newData
    })
  }

  const handlePresetClick = (qty: number) => {
    setFormData(prev => ({ ...prev, quantity: qty.toString() }))
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manual Order</h1>
        <p className="text-gray-500 mt-1">Place a new SMM order from the admin panel</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-500" />
                    Select Service
                  </label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.panel}) - #{s.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-500" />
                    Quantity
                  </label>
                  <Input
                    name="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedService.presets.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => handlePresetClick(qty)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          formData.quantity === qty.toString()
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                            : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100'
                        }`}
                      >
                        {qty >= 1000 ? `${qty / 1000}K` : qty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-purple-500" />
                  Target URL / Link
                </label>
                <Input
                  name="link"
                  type="text"
                  placeholder="Paste profile, post, or video link here..."
                  value={formData.link}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-lg font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.01]"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Place Manual Order
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/25 p-6 text-white text-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Service IDs Summary
            </h3>
            <div className="space-y-3">
              {SERVICES.map(s => (
                <div key={s.id} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center border border-white/10">
                  <div>
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs text-white/70">{s.panel}</p>
                  </div>
                  <span className="font-mono bg-white/20 px-2 py-1 rounded text-xs">#{s.id}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-100 shadow-xl shadow-amber-500/5 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                Important Notes
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Manual orders created here bypass payment verification.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Ensure the link is public and follows platform rules.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>Orders are sent directly to the SMM panel provider.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
