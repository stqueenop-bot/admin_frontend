'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
  Check,
  Hash,
  Layers,
  Settings2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ServiceIdEntry {
  id: number
  name: string
  provider: string
  category: string
  platform: string
  allowedQuantities: number[]
  description?: string
}

const PROVIDER_COLORS: Record<string, string> = {
  IND: 'bg-violet-100 text-violet-700 border-violet-200',
  SUPPORTIVE: 'bg-sky-100 text-sky-700 border-sky-200',
}

const CATEGORY_COLORS: Record<string, string> = {
  followers: 'bg-pink-50 text-pink-700',
  likes: 'bg-rose-50 text-rose-700',
  views: 'bg-amber-50 text-amber-700',
  comments: 'bg-emerald-50 text-emerald-700',
  members: 'bg-blue-50 text-blue-700',
  subscribers: 'bg-indigo-50 text-indigo-700',
  reactions: 'bg-orange-50 text-orange-700',
}

const EMPTY_FORM: Omit<ServiceIdEntry, 'allowedQuantities'> & { allowedQuantities: string } = {
  id: 0,
  name: '',
  provider: 'IND',
  category: 'followers',
  platform: 'instagram',
  allowedQuantities: '',
  description: '',
}

export default function ServiceIdsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ServiceIdEntry | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // ── Queries ──────────────────────────────────────────────────────────────
  const { data: serviceIds, isLoading, isError } = useQuery({
    queryKey: ['service-ids'],
    queryFn: async () => {
      const res = await api.getServiceIds()
      return res.data as ServiceIdEntry[]
    },
  })

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: ServiceIdEntry) => api.createServiceId(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-ids'] })
      toast.success('Service ID added successfully')
      closeModal()
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add service ID'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ numericId, data }: { numericId: number; data: Partial<ServiceIdEntry> }) =>
      api.updateServiceId(numericId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-ids'] })
      toast.success('Service ID updated')
      closeModal()
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update service ID'),
  })

  const deleteMutation = useMutation({
    mutationFn: (numericId: number) => api.deleteServiceId(numericId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-ids'] })
      toast.success('Service ID deleted')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete service ID'),
  })

  // ── Helpers ───────────────────────────────────────────────────────────────
  const parseQuantities = (raw: string): number[] =>
    raw
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const quantities = parseQuantities(formData.allowedQuantities)
    if (quantities.length === 0) {
      toast.error('Enter at least one valid quantity')
      return
    }
    const payload: ServiceIdEntry = {
      id: Number(formData.id),
      name: formData.name,
      provider: formData.provider,
      category: formData.category,
      platform: formData.platform,
      allowedQuantities: quantities,
      description: formData.description || undefined,
    }
    if (editingEntry) {
      updateMutation.mutate({ numericId: editingEntry.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const openModal = (entry?: ServiceIdEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setFormData({
        id: entry.id,
        name: entry.name,
        provider: entry.provider,
        category: entry.category,
        platform: entry.platform,
        allowedQuantities: entry.allowedQuantities.join(', '),
        description: entry.description || '',
      })
    } else {
      setEditingEntry(null)
      setFormData(EMPTY_FORM)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingEntry(null)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-violet-500" />
            Service IDs
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage SMM service IDs and their allowed order quantities.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 transition-all duration-300 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Service ID
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
          <p className="text-slate-500 font-bold">Loading service IDs...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-rose-50 rounded-[32px] border-2 border-dashed border-rose-200">
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <p className="text-rose-600 font-bold">Failed to load service IDs</p>
        </div>
      ) : serviceIds && serviceIds.length > 0 ? (
        <div className="space-y-4">
          {serviceIds.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border-2 border-slate-100 rounded-[28px] overflow-hidden transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4 min-w-0">
                  {/* ID Badge */}
                  <div className="flex-shrink-0 w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-slate-200">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-white font-black text-sm leading-none">{entry.id}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900 truncate">{entry.name}</h3>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-[10px] font-black rounded-full border uppercase tracking-widest flex-shrink-0',
                          PROVIDER_COLORS[entry.provider] || 'bg-slate-100 text-slate-600 border-slate-200'
                        )}
                      >
                        {entry.provider}
                      </span>
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-[10px] font-bold rounded-full capitalize flex-shrink-0',
                          CATEGORY_COLORS[entry.category] || 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {entry.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium mt-0.5 truncate">
                      {entry.platform} · {entry.description || 'No description'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-violet-50 text-slate-400 hover:text-violet-600 border border-slate-100 hover:border-violet-200 transition-all"
                    title="View quantities"
                  >
                    {expandedId === entry.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(entry)}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 transition-all"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service ID ${entry.id} (${entry.name})?`)) {
                        deleteMutation.mutate(entry.id)
                      }
                    }}
                    className="p-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-200 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded: Quantities */}
              {expandedId === entry.id && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Allowed Quantities
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.allowedQuantities.map((qty) => (
                        <span
                          key={qty}
                          className="px-4 py-1.5 bg-slate-900 text-white text-sm font-black rounded-xl shadow-sm"
                        >
                          {qty.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
            <Hash className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">No Service IDs Yet</h2>
          <p className="text-slate-500 font-medium max-w-xs text-center">
            Add your first SMM service ID to start managing order routing and quantities.
          </p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-slate-100">
            {/* Modal Header */}
            <div className="p-8 pb-0 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Settings2 className="w-6 h-6 text-violet-500" />
                  {editingEntry ? 'Edit Service ID' : 'New Service ID'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                  {editingEntry
                    ? 'Update the routing info and allowed quantities.'
                    : 'Register a new SMM service ID with routing and quantity rules.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all transform hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Row 1: ID + Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    SMM Service ID
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!!editingEntry}
                    placeholder="e.g. 10183"
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Followers"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Row 2: Provider + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Provider
                  </label>
                  <select
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-bold appearance-none"
                  >
                    <option value="IND">IND (TNT SMM)</option>
                    <option value="SUPPORTIVE">SUPPORTIVE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-bold appearance-none"
                  >
                    <option value="followers">Followers</option>
                    <option value="likes">Likes</option>
                    <option value="views">Views</option>
                    <option value="comments">Comments</option>
                    <option value="members">Members</option>
                    <option value="subscribers">Subscribers</option>
                    <option value="reactions">Reactions</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Platform */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all font-bold appearance-none"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="telegram">Telegram</option>
                  <option value="twitter">Twitter / X</option>
                </select>
              </div>

              {/* Row 4: Allowed Quantities */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Allowed Quantities{' '}
                  <span className="normal-case font-medium text-slate-300">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50, 100, 500, 1000"
                  value={formData.allowedQuantities}
                  onChange={(e) => setFormData({ ...formData, allowedQuantities: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                />
                {/* Live Preview */}
                {formData.allowedQuantities && (
                  <div className="flex flex-wrap gap-1.5 mt-1 px-1">
                    {parseQuantities(formData.allowedQuantities).map((q) => (
                      <span
                        key={q}
                        className="px-3 py-1 bg-slate-900 text-white text-xs font-black rounded-lg"
                      >
                        {q.toLocaleString()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Row 5: Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Description{' '}
                  <span className="normal-case font-medium text-slate-300">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TNT SMM - Instagram Followers"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:border-violet-500 focus:bg-white transition-all placeholder:text-slate-300 font-bold"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {editingEntry ? 'Update' : 'Add Service ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
