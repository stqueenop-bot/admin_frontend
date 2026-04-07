'use client'  

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Plus, Edit2, Trash2, X, Check, Link, Key, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { mockApis } from '@/lib/mock-data'
import type { ApiConfig, ApiType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const apiTypeConfig: Record<ApiType, { label: string; gradient: string; bgLight: string }> = {
  supportive_smm: {
    label: 'Supportive SMM',
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-100 text-violet-700',
  },
  ind_smm: {
    label: 'Indian Supportive SMM',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-100 text-amber-700',
  },
}

interface ApiFormData {
  name: string
  type: ApiType
  url: string
  apiKey: string
  isActive: boolean
}

export default function ApiManagerPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApi, setEditingApi] = useState<ApiConfig | null>(null)
  const [formData, setFormData] = useState<ApiFormData>({
    name: '',
    type: 'supportive_smm',
    url: '',
    apiKey: '',
    isActive: true,
  })

  const { data: apis, isLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockApis
    },
  })

  const saveApiMutation = useMutation({
    mutationFn: async (data: ApiFormData & { id?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] })
      closeModal()
      toast.success(editingApi ? 'API updated successfully!' : 'API added successfully!')
    },
  })

  const deleteApiMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] })
      toast.success('API deleted successfully!')
    },
  })

  const openModal = (api?: ApiConfig) => {
    if (api) {
      setEditingApi(api)
      setFormData({
        name: api.name,
        type: api.type,
        url: api.url,
        apiKey: api.apiKey,
        isActive: api.isActive,
      })
    } else {
      setEditingApi(null)
      setFormData({
        name: '',
        type: 'supportive_smm',
        url: '',
        apiKey: '',
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingApi(null)
    setFormData({
      name: '',
      type: 'supportive_smm',
      url: '',
      apiKey: '',
      isActive: true,
    })
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Manager</h1>
          <p className="text-gray-500 mt-1">Manage your SMM API configurations</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add API
        </Button>
      </div>

      {/* API Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner className="w-10 h-10 text-purple-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading APIs...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {apis?.map((api) => {
            const config = apiTypeConfig[api.type]
            return (
              <div
                key={api.id}
                className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center`}>
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{api.name}</h3>
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1', config.bgLight)}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                          api.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            api.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                          )}
                        />
                        {api.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 truncate">{api.url}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Key className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 font-mono">
                        {api.apiKey.slice(0, 10)}...{api.apiKey.slice(-4)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(api)}
                      className="flex-1 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteApiMutation.mutate(api.id)}
                      className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                {editingApi ? <Edit2 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingApi ? 'Edit API' : 'Add API'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingApi ? 'Update API configuration' : 'Add a new API configuration'}
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveApiMutation.mutate({ ...formData, id: editingApi?.id })
              }}
              className="space-y-4"
            >
              {/* API Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">API Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(apiTypeConfig) as [ApiType, typeof apiTypeConfig.supportive_smm][]).map(
                    ([key, config]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, type: key }))}
                        className={cn(
                          'flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium',
                          formData.type === key
                            ? `border-transparent bg-gradient-to-r ${config.gradient} text-white`
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        )}
                      >
                        {config.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">API Name</label>
                <Input
                  placeholder="My API"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="rounded-xl"
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">API URL</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="https://api.example.com/v1"
                    value={formData.url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                    required
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="sk_live_xxxxx"
                    value={formData.apiKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, apiKey: e.target.value }))}
                    required
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Active Status</p>
                  <p className="text-sm text-gray-500">Enable or disable this API</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>

              <Button
                type="submit"
                disabled={saveApiMutation.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white py-5"
              >
                {saveApiMutation.isPending ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {editingApi ? 'Update API' : 'Add API'}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
