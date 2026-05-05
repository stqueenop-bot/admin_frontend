'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Send, Instagram, Hash, Link as LinkIcon, Package, DollarSign, MessageSquare, Loader2 } from 'lucide-react'
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

export default function ManualOrderPage() {
  const queryClient = useQueryClient()

  // Fetch services from API
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['service-ids'],
    queryFn: async () => {
      const res = await api.getServiceIds()
      return res.data as ServiceOption[]
    },
  })

  const [formData, setFormData] = useState({
    serviceId: '',
    link: '',
    quantity: '',
  })

  // Initialize form when services load
  useState(() => {
    if (services && services.length > 0 && !formData.serviceId) {
      const first = services[0]
      setFormData(prev => ({
        ...prev,
        serviceId: first.id.toString(),
        quantity: (first.presets?.[0] || 1000).toString()
      }))
    }
  })

  const selectedService = services?.find(s => s.id.toString() === formData.serviceId) || services?.[0]

  const createOrderMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!selectedService) throw new Error('No service selected')
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
        const newService = services?.find(s => s.id.toString() === value)
        if (newService) {
          newData.quantity = (newService.presets?.[0] || 1000).toString()
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
                    disabled={isLoadingServices}
                    className="w-full h-12 px-4 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-purple-500 bg-white text-gray-900"
                  >
                    {isLoadingServices ? (
                      <option>Loading services...</option>
                    ) : services && services.length > 0 ? (
                      services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.panel}) - #{s.id}
                        </option>
                      ))
                    ) : (
                      <option>No services found</option>
                    )}
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
                    {selectedService?.presets?.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => handlePresetClick(qty)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${formData.quantity === qty.toString()
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
              {isLoadingServices ? (
                <div className="flex items-center gap-2 text-white/50 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading summary...</span>
                </div>
              ) : services && services.length > 0 ? (
                services.map(s => (
                  <div key={s.id} className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 flex justify-between items-center border border-white/10">
                    <div>
                      <p className="font-bold text-xs">{s.name}</p>
                      <p className="text-[10px] text-white/70">{s.panel}</p>
                    </div>
                    <span className="font-mono bg-white/20 px-2 py-1 rounded text-[10px]">#{s.id}</span>
                  </div>
                ))
              ) : (
                <p className="text-white/50 text-xs">No services found</p>
              )}
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
