import { Sidebar } from '@/components/dashboard/sidebar'
import { QueryProvider } from '@/components/providers/query-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen flex bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <Sidebar />
        <main className="flex-1 lg:ml-0 overflow-auto">
          <div className="p-3 sm:p-4 lg:p-8 pt-14 sm:pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </QueryProvider>
  )
}
