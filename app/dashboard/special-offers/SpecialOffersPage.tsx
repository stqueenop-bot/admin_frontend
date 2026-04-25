'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Zap, 
  X, 
  Loader2, 
  Check, 
  Sparkles,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface SpecialOffer {
  id: string
  serviceSlug: string
  title: string
  badge: string
  description?: string
  serviceId?: number
  quantity?: number
  price?: number
  active: boolean
  createdAt: string
}

export default function SpecialOffersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    serviceSlug: '',
    title: '',
    badge: 'LIVE',
    description: '',
    serviceId: '',
    quantity: '',
    price: '',
    active: true
  })

  // Queries
  const { data: offers, isLoading } = useQuery({
    queryKey: ['special-offers'],
    queryFn: async () => {
      const res = await api.getOffers()
      return res.data as SpecialOffer[]
    }
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createOffer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-offers'] })
      toast.success('Offer created successfully')
      closeModal()
    },
    onError: (error: any) => toast.error(error.message || 'Failed to create offer')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-offers'] })
      toast.success('Offer updated successfully')
      closeModal()
    },
    onError: (error: any) => toast.error(error.message || 'Failed to update offer')
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-offers'] })
      toast.success('Offer deleted')
    },
    onError: (error: any) => toast.error(error.message || 'Failed to delete offer')
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string, active: boolean }) => api.updateOffer(id, { active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-offers'] })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      serviceId: formData.serviceId ? parseInt(formData.serviceId) : undefined,
      quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined
    }

    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const openModal = (offer?: SpecialOffer) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({
        serviceSlug: offer.serviceSlug,
        title: offer.title,
        badge: offer.badge,
        description: offer.description || '',
        serviceId: offer.serviceId?.toString() || '',
        quantity: offer.quantity?.toString() || '',
        price: offer.price?.toString() || '',
        active: offer.active
      })
    } else {
      setEditingOffer(null)
      setFormData({
        serviceSlug: '',
        title: '',
        badge: 'LIVE',
        description: '',
        serviceId: '',
        quantity: '',
        price: '',
        active: true
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingOffer(null)
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-orange-500" />
            Special Offers
          </h1>
          <p className="text-slate-600 font-medium mt-1">Manage promotional deals and highlighted services.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add New Offer
        </button>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
          <p className="text-slate-500 font-bold">Fetching deals...</p>
        </div>
      ) : offers && offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={cn(
                "group relative bg-white border-2 border-slate-100 rounded-[32px] overflow-hidden transition-all duration-300 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/10",
                !offer.active && "bg-slate-50 opacity-80"
              )}
            >
              {/* Card Badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-orange-500/20 uppercase tracking-widest">
                  {offer.badge}
                </span>
              </div>

              {/* Service Slug Label */}
              <div className="absolute top-5 right-5 z-10">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md border border-slate-200 uppercase">
                  {offer.serviceSlug}
                </span>
              </div>

              <div className="p-7 pt-16 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 min-h-[2.5rem] leading-relaxed">
                    {offer.description || 'No description provided.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Quantity</span>
                    <p className="text-slate-900 font-black text-lg">{offer.quantity || 'N/A'}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Price</span>
                    <p className="text-emerald-600 font-black text-lg">₹{offer.price || '0.00'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <button
                    onClick={() => toggleMutation.mutate({ id: offer.id, active: !offer.active })}
                    className="flex items-center gap-2 group/toggle"
                  >
                    {offer.active ? (
                      <ToggleRight className="w-9 h-9 text-orange-500 transition-all group-hover/toggle:scale-110" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-300 transition-all group-hover/toggle:scale-110" />
                    )}
                    <span className={cn("text-xs font-black", offer.active ? "text-orange-600" : "text-slate-400")}>
                      {offer.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(offer)}
                      className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 transition-all shadow-sm"
                      title="Edit Offer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this offer?')) {
                          deleteMutation.mutate(offer.id)
                        }
                      }}
                      className="p-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-200 transition-all shadow-sm"
                      title="Delete Offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
            <Tag className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No Offers Found</h2>
          <p className="text-slate-500 font-medium max-w-xs text-center">
            You haven't created any special offers yet. Highlighting services boosts conversions!
          </p>
        </div>
      )}

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Modal Header */}
            <div className="p-8 pb-0 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Tag className="w-6 h-6 text-orange-500" />
                  {editingOffer ? 'Edit Offer' : 'New Offer'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Fill in the details for your promotion.</p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all transform hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Slug</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. instagram"
                      value={formData.serviceSlug}
                      onChange={(e) => setFormData({ ...formData, serviceSlug: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Badge Text</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LIVE"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5000 Followers Package"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe the offer highlights..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service ID</label>
                    <input
                      type="number"
                      placeholder="123"
                      value={formData.serviceId}
                      onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="49"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {editingOffer ? 'Update Offer' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
