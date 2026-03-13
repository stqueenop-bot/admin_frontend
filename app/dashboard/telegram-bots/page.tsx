'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Bot, Plus, Edit2, Trash2, X, Check, Key, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { mockTelegramBots } from '@/lib/mock-data'
import type { TelegramBot } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BotFormData {
  name: string
  token: string
  isActive: boolean
}

export default function TelegramBotsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBot, setEditingBot] = useState<TelegramBot | null>(null)
  const [formData, setFormData] = useState<BotFormData>({
    name: '',
    token: '',
    isActive: true,
  })

  const { data: bots, isLoading } = useQuery({
    queryKey: ['telegram-bots'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockTelegramBots
    },
  })

  const saveBotMutation = useMutation({
    mutationFn: async (data: BotFormData & { id?: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-bots'] })
      closeModal()
      toast.success(editingBot ? 'Bot updated successfully!' : 'Bot added successfully!')
    },
  })

  const deleteBotMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-bots'] })
      toast.success('Bot deleted successfully!')
    },
  })

  const toggleBotMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, isActive }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['telegram-bots'] })
      toast.success(`Bot ${data.isActive ? 'activated' : 'deactivated'} successfully!`)
    },
  })

  const openModal = (bot?: TelegramBot) => {
    if (bot) {
      setEditingBot(bot)
      setFormData({
        name: bot.name,
        token: bot.token,
        isActive: bot.isActive,
      })
    } else {
      setEditingBot(null)
      setFormData({
        name: '',
        token: '',
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBot(null)
    setFormData({
      name: '',
      token: '',
      isActive: true,
    })
  }

  const activeBots = bots?.filter((bot) => bot.isActive) || []
  const inactiveBots = bots?.filter((bot) => !bot.isActive) || []

  const BotCard = ({ bot }: { bot: TelegramBot }) => (
    <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${bot.isActive ? 'from-emerald-400 to-teal-500' : 'from-gray-300 to-gray-400'}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                bot.isActive
                  ? 'bg-gradient-to-r from-indigo-400 to-violet-500'
                  : 'bg-gray-200'
              )}
            >
              <Bot className={cn('w-6 h-6', bot.isActive ? 'text-white' : 'text-gray-500')} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{bot.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Created {format(new Date(bot.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
              bot.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                bot.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
              )}
            />
            {bot.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm mb-6 p-3 rounded-xl bg-gray-50">
          <Key className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-gray-600 font-mono text-xs truncate">
            {bot.token.slice(0, 15)}...{bot.token.slice(-8)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBotMutation.mutate({ id: bot.id, isActive: !bot.isActive })}
            className={cn(
              'flex-1 rounded-lg',
              bot.isActive
                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
            )}
          >
            {bot.isActive ? (
              <>
                <PowerOff className="w-4 h-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="w-4 h-4 mr-2" />
                Activate
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openModal(bot)}
            className="rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteBotMutation.mutate(bot.id)}
            className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Telegram Bots</h1>
          <p className="text-gray-500 mt-1">Manage your Telegram bot integrations</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="rounded-xl bg-gradient-to-r from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner className="w-10 h-10 text-purple-600 mx-auto" />
            <p className="mt-4 text-gray-600 font-medium">Loading bots...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Bots */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                <Power className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Active Bots ({activeBots.length})
              </h2>
            </div>
            {activeBots.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeBots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-purple-100/50">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No active bots</p>
              </div>
            )}
          </div>

          {/* Inactive Bots */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                <PowerOff className="w-4 h-4 text-gray-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Inactive Bots ({inactiveBots.length})
              </h2>
            </div>
            {inactiveBots.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inactiveBots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-purple-100/50">
                <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No inactive bots</p>
              </div>
            )}
          </div>
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-400 to-violet-500 flex items-center justify-center">
                {editingBot ? <Edit2 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBot ? 'Edit Bot' : 'Add Bot'}
                </h2>
                <p className="text-sm text-gray-500">
                  {editingBot ? 'Update bot configuration' : 'Add a new Telegram bot'}
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveBotMutation.mutate({ ...formData, id: editingBot?.id })
              }}
              className="space-y-4"
            >
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Bot Name</label>
                <Input
                  placeholder="My Telegram Bot"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="rounded-xl"
                />
              </div>

              {/* Token */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Bot Token</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="123456:ABC-DEF..."
                    value={formData.token}
                    onChange={(e) => setFormData((prev) => ({ ...prev, token: e.target.value }))}
                    required
                    className="rounded-xl pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">Get this from @BotFather on Telegram</p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Active Status</p>
                  <p className="text-sm text-gray-500">Enable or disable this bot</p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>

              <Button
                type="submit"
                disabled={saveBotMutation.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-400 to-violet-500 hover:from-indigo-500 hover:to-violet-600 text-white py-5"
              >
                {saveBotMutation.isPending ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {editingBot ? 'Update Bot' : 'Add Bot'}
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
