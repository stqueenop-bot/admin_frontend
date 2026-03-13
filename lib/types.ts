// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'

export interface Order {
  id: string
  serviceId: number
  link: string
  quantity: number
  amount: number
  status: OrderStatus
  remark?: string
  userId?: string
  createdAt: string
  updatedAt: string
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  zapupiOrderId: string
  orderId: string
  amount: number
  status: PaymentStatus
  paymentUrl?: string
  utr?: string
  createdAt: string
  updatedAt: string
}

// Spend Tracker Types
export type SpendCategory = 'supportive_smm' | 'tnt' | 'ads'

export interface Spend {
  id: string
  category: SpendCategory
  amount: number
  note?: string
  date: string
  createdAt: string
}

// API Manager Types
export type ApiType = 'supportive_smm' | 'tnt'

export interface ApiConfig {
  id: string
  name: string
  type: ApiType
  url: string
  apiKey: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Telegram Bot Types
export interface TelegramBot {
  id: string
  name: string
  token: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  activeApis: number
  telegramBots: number
  recentOrders: Order[]
}
