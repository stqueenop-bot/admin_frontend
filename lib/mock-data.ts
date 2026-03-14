import type { Order, Spend, ApiConfig, TelegramBot, DashboardStats } from './types'

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    serviceId: 101,
    link: 'https://instagram.com/p/abc123',
    quantity: 1000,
    amount: 25.00,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ord-002',
    serviceId: 102,
    link: 'https://instagram.com/p/def456',
    quantity: 500,
    amount: 12.50,
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'ord-003',
    serviceId: 103,
    link: 'https://instagram.com/p/ghi789',
    quantity: 2000,
    amount: 45.00,
    status: 'pending',
    remark: 'Priority order',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'ord-004',
    serviceId: 101,
    link: 'https://instagram.com/p/jkl012',
    quantity: 750,
    amount: 18.75,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'ord-005',
    serviceId: 104,
    link: 'https://instagram.com/p/mno345',
    quantity: 1500,
    amount: 35.00,
    status: 'failed',
    remark: 'Invalid link',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
  },
]

// Mock Spends
export const mockSpends: Spend[] = [
  {
    id: 'spd-001',
    category: 'supportive_smm',
    amount: 150.00,
    note: 'Monthly subscription',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'spd-002',
    category: 'ind_smm',
    amount: 200.00,
    note: 'Bulk credits',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'spd-003',
    category: 'ads',
    amount: 500.00,
    note: 'Instagram promotion',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
]

// Mock APIs
export const mockApis: ApiConfig[] = [
  {
    id: 'api-001',
    name: 'Supportive SMM API',
    type: 'supportive_smm',
    url: 'https://api.supportivesmm.com/v1',
    apiKey: 'sk_live_xxxxx',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'api-002',
    name: 'Indian Supportive SMM API',
    type: 'ind_smm',
    url: 'https://indianprovider.com/api/v2',
    apiKey: 'tk_live_yyyyy',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
]

// Mock Telegram Bots
export const mockTelegramBots: TelegramBot[] = [
  {
    id: 'bot-001',
    name: 'Order Notifier Bot',
    token: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'bot-002',
    name: 'Support Bot',
    token: '654321:XYZ-ABC4321ghIkl-abc57W2v1u321ew22',
    isActive: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'bot-003',
    name: 'Analytics Bot',
    token: '789012:DEF-GHI7890klMno-pqr57W2v1u789ew33',
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalOrders: 1248,
  totalRevenue: 24580.50,
  activeApis: 2,
  telegramBots: 3,
  recentOrders: mockOrders.slice(0, 5),
}
