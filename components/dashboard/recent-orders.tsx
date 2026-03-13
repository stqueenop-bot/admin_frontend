'use client'

import { formatDistanceToNow } from 'date-fns'
import type { Order } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecentOrdersProps {
  orders: Order[]
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
  failed: { bg: 'bg-red-100', text: 'text-red-700' },
  PENDING: { bg: 'bg-amber-100', text: 'text-amber-700' },
  PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-700' },
  FAILED: { bg: 'bg-red-100', text: 'text-red-700' },
  PARTIAL: { bg: 'bg-orange-100', text: 'text-orange-700' },
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden">
      <div className="p-3 sm:p-4 lg:p-6 border-b border-purple-100/50">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Recent Orders</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Latest Instagram SMM orders</p>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden divide-y divide-purple-100/50">
        {orders.map((order) => {
          const style = statusStyles[order.status] || statusStyles.pending || statusStyles.PENDING
          return (
            <div key={order.id} className="p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium text-purple-600">
                  {typeof order.id === 'string' && order.id.length > 10 ? `${order.id.slice(0, 8)}...` : order.id}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize',
                    style.bg,
                    style.text
                  )}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">#{order.serviceId} · {order.quantity.toLocaleString()} qty</span>
                <span className="font-bold text-emerald-600">₹{order.amount.toFixed(2)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Order ID</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Service</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Quantity</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Amount</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Status</th>
              <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100/50">
            {orders.map((order) => {
              const style = statusStyles[order.status] || statusStyles.pending || statusStyles.PENDING
              return (
                <tr key={order.id} className="hover:bg-purple-50/50 transition-colors">
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span className="font-mono text-xs sm:text-sm font-medium text-purple-600">
                      {typeof order.id === 'string' && order.id.length > 10 ? `${order.id.slice(0, 8)}...` : order.id}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 text-xs sm:text-sm font-medium text-purple-700">
                      #{order.serviceId}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900">{order.quantity.toLocaleString()}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-bold text-emerald-600">₹{order.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
                        style.bg,
                        style.text
                      )}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
