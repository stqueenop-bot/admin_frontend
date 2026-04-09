'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Image as ImageIcon, Plus, Trash2, ToggleLeft, ToggleRight, X, ExternalLink, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Banner {
  id: string
  imageUrl: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function BannersPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    imageUrl: '',
    active: true,
  })

  // ── Queries ──
  const { data: bannersResponse, isLoading, refetch } = useQuery({
    queryKey: ['banners'],
    queryFn: () => api.getBanners(),
  })
  const banners = (bannersResponse?.data || []) as Banner[]

  // ── Mutations ──
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => api.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      setIsModalOpen(false)
      setFormData({ imageUrl: '', active: true })
      toast.success('Banner added successfully!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add banner'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Banner> }) => api.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner updated!')
    },
    onError: (err: any) => toast.error(err.message || 'Update failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      toast.success('Banner removed')
    },
    onError: (err: any) => toast.error(err.message || 'Delete failed'),
  })

  const handleToggle = (banner: Banner) => {
    updateMutation.mutate({ id: banner.id, data: { active: !banner.active } })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-500 mt-1">Manage promotional banners for your shop</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Stats/Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-purple-500/5 border border-purple-100/50">
          <p className="text-sm font-medium text-gray-500">Total Banners</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{banners.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-purple-500/5 border border-purple-100/50">
          <p className="text-sm font-medium text-gray-500">Active Banners</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">
            {banners.filter(b => b.active).length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-purple-500/5 border border-purple-100/50">
          <p className="text-sm font-medium text-gray-500">Last Updated</p>
          <p className="text-lg font-medium text-gray-900 mt-2">
            {banners.length > 0 ? new Date(banners[0].updatedAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Banner Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-purple-200">
          <Spinner className="w-10 h-10 text-purple-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-purple-200">
          <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10 text-purple-200" />
          </div>
          <p className="text-gray-500 text-lg">No banners found</p>
          <Button
             variant="link"
             onClick={() => setIsModalOpen(true)}
             className="text-purple-600 mt-2"
          >
            Create your first banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group relative bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="aspect-[2/1] relative overflow-hidden bg-gray-100">
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a
                    href={banner.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-3 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-200 hover:bg-rose-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {!banner.active && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                      Inactive
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-mono">ID: {banner.id.slice(0, 8)}...</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added: {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(banner)}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-300",
                    banner.active
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  )}
                >
                  {banner.active ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Add New Banner</h2>
                    <p className="text-gray-500">Upload or link a promotional graphic</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  createMutation.mutate(formData)
                }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Image URL</label>
                  <Input
                    placeholder="https://example.com/banner.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="rounded-2xl py-6 border-gray-200 focus:border-violet-500 transition-all"
                    required
                  />
                </div>

                {formData.imageUrl && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Preview</label>
                    <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/1200x600?text=Invalid+Image+URL'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">Set as Active</p>
                    <p className="text-xs text-gray-500">Show this banner on the shop immediately</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, active: !p.active }))}
                    className={cn(
                      "p-1 rounded-xl transition-all duration-300",
                      formData.active ? "text-emerald-500" : "text-gray-300"
                    )}
                  >
                    {formData.active ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-2xl py-6 border-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-[2] rounded-2xl py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/20"
                  >
                    {createMutation.isPending ? (
                      <Spinner className="w-5 h-5 mr-2" />
                    ) : (
                      'Save Banner'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
