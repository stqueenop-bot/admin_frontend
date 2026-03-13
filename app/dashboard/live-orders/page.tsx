'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Zap, RefreshCw, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import type { Order } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  PARTIAL: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
}

const ITEMS_PER_PAGE = 20

export default function LiveOrdersPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['orders', page],
    queryFn: async () => {
      const res = await api.getOrders(page, ITEMS_PER_PAGE)
      return res.data as {
        orders: Order[]
        pagination: { total: number; page: number; limit: number; totalPages: number }
      }
    },
    refetchInterval: 30000,
  })

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
          <p className="text-gray-500 mt-1">Real-time order tracking with auto-refresh</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-refresh: 30s
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
          >
            {isFetching ? (
              <Spinner className="w-4 h-4 mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden">
        <div className="p-6 border-b border-purple-100/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order List</h2>
            <p className="text-sm text-gray-500">
              {data ? `${((page - 1) * ITEMS_PER_PAGE) + 1}-${Math.min(page * ITEMS_PER_PAGE, data.pagination.total)} of ${data.pagination.total} orders` : 'Loading...'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner className="w-10 h-10 text-purple-600 mx-auto" />
              <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
            </div>
          </div>
        ) : data?.orders.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Link</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100/50">
                  {data?.orders.map((order: any) => {
                    const style = statusStyles[order.status] || statusStyles.PENDING
                    return (
                      <tr key={order.id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-purple-600">
                            {order.id.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 text-sm font-medium text-purple-700">
                            #{order.serviceId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-[200px] flex items-center gap-1"
                          >
                            <span className="truncate">{order.link}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {order.quantity.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-emerald-600">
                            ₹{order.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize',
                              style.bg,
                              style.text
                            )}
                          >
                            <span className={cn('w-1.5 h-1.5 rounded-full', style.dot)} />
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-purple-100/50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {page} of {data?.pagination.totalPages || 1}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data?.pagination.totalPages || 1, p + 1))}
                  disabled={page === (data?.pagination.totalPages || 1)}
                  className="rounded-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
