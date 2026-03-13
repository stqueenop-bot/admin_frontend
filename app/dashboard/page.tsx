'use client'

import { useQuery } from '@tanstack/react-query'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardPage() {
  const { data: statsResponse, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.dashboardStats(),
  })

  const stats = statsResponse?.data

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here is your overview.</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <div className="xl:col-span-2">
          <RecentOrders orders={stats.recentOrders} />
        </div>
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
