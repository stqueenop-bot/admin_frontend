'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Wallet, Plus, TrendingUp, Package, Megaphone, X, CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import type { Spend, SpendCategory } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const categoryConfig: Record<SpendCategory, { label: string; icon: typeof Wallet; gradient: string; bgLight: string }> = {
  supportive_smm: {
    label: 'Supportive SMM',
    icon: TrendingUp,
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-100 text-violet-700',
  },
  tnt: {
    label: 'TNT',
    icon: Package,
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-100 text-amber-700',
  },
  ads: {
    label: 'Ads',
    icon: Megaphone,
    gradient: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-100 text-pink-700',
  },
}

export default function SpendTrackerPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    category: 'supportive_smm' as SpendCategory,
    amount: '',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  const { data: spendsResponse, isLoading } = useQuery({
    queryKey: ['spends'],
    queryFn: () => api.getSpends(),
  })

  const spends = (spendsResponse?.data || []) as Spend[]

  const addSpendMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return api.createSpend({
        category: data.category,
        amount: parseFloat(data.amount),
        note: data.note || undefined,
        date: data.date,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spends'] })
      setIsModalOpen(false)
      setFormData({
        category: 'supportive_smm',
        amount: '',
        note: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      })
      toast.success('Spend added successfully!')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add spend.')
    },
  })

  const calculateTotals = (spends: Spend[]) => {
    const totals: Record<SpendCategory, number> = {
      supportive_smm: 0,
      tnt: 0,
      ads: 0,
    }
    spends.forEach((spend) => {
      if (totals[spend.category as SpendCategory] !== undefined) {
        totals[spend.category as SpendCategory] += spend.amount
      }
    })
    return totals
  }

  const totals = calculateTotals(spends)
  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0)

  const filteredSpends = spends.filter((spend) => {
    if (!selectedDate) return true
    const spendDate = format(new Date(spend.date), 'yyyy-MM-dd')
    const filterDate = format(selectedDate, 'yyyy-MM-dd')
    return spendDate === filterDate
  })

  const dailyTotal = filteredSpends.reduce((sum, spend) => sum + spend.amount, 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Spend Tracker</h1>
          <p className="text-gray-500 mt-1">Track expenses across different categories</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Spend
        </Button>
      </div>

      {/* Category Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">₹{grandTotal.toFixed(2)}</p>
            <p className="text-sm text-gray-400 mt-1">Total Spending</p>
          </div>
        </div>

        {(Object.entries(categoryConfig) as [SpendCategory, typeof categoryConfig.supportive_smm][]).map(
          ([key, config]) => {
            const Icon = config.icon
            return (
              <div
                key={key}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.gradient} p-6 text-white shadow-xl`}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold">₹{totals[key].toFixed(2)}</p>
                  <p className="text-sm text-white/80 mt-1">{config.label}</p>
                </div>
              </div>
            )
          }
        )}
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-400 to-blue-500 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Daily Expense Summary</h2>
              <p className="text-sm text-gray-500">Select a date to filter expenses</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:ml-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full sm:w-[240px] justify-start text-left font-normal rounded-xl border-2',
                    !selectedDate && 'text-gray-500',
                    selectedDate && 'border-indigo-200 bg-indigo-50'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <Button
                variant="outline"
                onClick={() => setSelectedDate(undefined)}
                className="rounded-xl border-gray-200 text-gray-600 hover:text-gray-900"
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Total Spend for {format(selectedDate, 'MMMM d, yyyy')}
                </p>
                {filteredSpends.length > 0 ? (
                  <p className="text-3xl font-bold text-indigo-900 mt-1">₹{dailyTotal.toFixed(2)}</p>
                ) : (
                  <p className="text-lg font-medium text-indigo-600/70 mt-1">No expenses recorded.</p>
                )}
              </div>
              {filteredSpends.length > 0 && (
                <div className="text-right">
                  <p className="text-sm text-indigo-600">{filteredSpends.length} transaction(s)</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Spends Table */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden">
        <div className="p-6 border-b border-purple-100/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Spending History</h2>
            <p className="text-sm text-gray-500">
              {selectedDate ? `Expenses for ${format(selectedDate, 'MMM d, yyyy')}` : 'All recorded expenses'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner className="w-10 h-10 text-purple-600 mx-auto" />
              <p className="mt-4 text-gray-600 font-medium">Loading spends...</p>
            </div>
          </div>
        ) : filteredSpends.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No expenses recorded</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/50">
                {filteredSpends.map((spend) => {
                  const config = categoryConfig[spend.category as SpendCategory]
                  if (!config) return null
                  const Icon = config.icon
                  return (
                    <tr key={spend.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium', config.bgLight)}>
                          <Icon className="w-4 h-4" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-900">₹{spend.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{spend.note || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(spend.date), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Spend Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Add Spend</h2>
                <p className="text-sm text-gray-500">Record a new expense</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                addSpendMutation.mutate(formData)
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(categoryConfig) as [SpendCategory, typeof categoryConfig.supportive_smm][]).map(
                    ([key, config]) => {
                      const Icon = config.icon
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, category: key }))}
                          className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                            formData.category === key
                              ? `border-transparent bg-gradient-to-r ${config.gradient} text-white`
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{config.label}</span>
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Amount (₹)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Note (Optional)</label>
                <Textarea
                  placeholder="Add a note..."
                  value={formData.note}
                  onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
                  rows={2}
                  className="rounded-xl"
                />
              </div>

              <Button
                type="submit"
                disabled={addSpendMutation.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white py-5"
              >
                {addSpendMutation.isPending ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Spend
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
