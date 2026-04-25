/**
 * Backend API helper for the admin frontend.
 * All requests go through Next.js rewrites → http://localhost:4000/api/*
 */

const BASE = '/api';
// Admin API key — must match API_AUTH_KEY in backend .env
const API_KEY = process.env.NEXT_PUBLIC_API_AUTH_KEY || 'admin_secret_8a2f4c9b7e1d3f6a';

interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const res = await fetch(`${BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            ...options?.headers,
        },
        ...options,
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.message || json.error || 'Request failed');
    }
    return json;
}

export const api = {
    // ── Auth ──
    login: (email: string, password?: string) =>
        request<{ token: string; user: { email: string; id: string; role: string; name?: string } }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
    forgotPassword: (email: string) =>
        request('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),
    getAdmins: () =>
        request<any[]>('/auth/admins'),
    createAdmin: (data: any) =>
        request('/auth/admins', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    updateAdmin: (id: string, data: any) =>
        request(`/auth/admins/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    deleteAdmin: (id: string) =>
        request(`/auth/admins/${id}`, {
            method: 'DELETE',
        }),
    resetPassword: (adminId: string, newPassword: string) =>
        request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ adminId, newPassword }),
        }),

    // ── Dashboard ──
    dashboardStats: () => request<{
        totalOrders: number;
        totalRevenue: number;
        activeApis: number;
        telegramBots: number;
        recentOrders: unknown[];
    }>('/dashboard/stats'),

    // ── Orders ──
    getOrders: (page = 1, limit = 20, status?: string) => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.set('status', status);
        return request<{
            orders: unknown[];
            pagination: { total: number; page: number; limit: number; totalPages: number };
        }>(`/orders?${params}`);
    },

    getOrder: (id: string) => request(`/orders/${id}`),

    createOrder: (data: { serviceId: number; link: string; quantity: number; amount: number; remark?: string }) =>
        request('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // ── Spends ──
    getSpends: (date?: string) => {
        const params = date ? `?date=${date}` : '';
        return request<unknown[]>(`/spends${params}`);
    },

    createSpend: (data: { category: string; amount: number; note?: string; date: string }) =>
        request('/spends', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    deleteSpend: (id: string) =>
        request(`/spends/${id}`, {
            method: 'DELETE',
        }),

    // ── Banners ──
    getBanners: () => request<any[]>('/internal/banners'),
    createBanner: (data: { imageUrl: string; active?: boolean }) =>
        request('/internal/banners', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateBanner: (id: string, data: { imageUrl?: string; active?: boolean }) =>
        request(`/internal/banners/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
    deleteBanner: (id: string) =>
        request(`/internal/banners/${id}`, { method: 'DELETE' }),

    // ── Offers ──
    getOffers: () => request<any[]>('/internal/offers'),
    createOffer: (data: { 
        serviceSlug: string; 
        title: string; 
        badge?: string; 
        active?: boolean; 
        description?: string;
        serviceId?: number;
        quantity?: number;
        price?: number;
    }) =>
        request('/internal/offers', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    updateOffer: (id: string, data: any) =>
        request(`/internal/offers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),
    deleteOffer: (id: string) =>
        request(`/internal/offers/${id}`, {
            method: 'DELETE',
        }),

    // SMM Config Management
    getSmmConfigs: () =>
        request('/internal/smm-configs'),
    
    createSmmConfig: (data: any) =>
        request('/internal/smm-configs', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    
    updateSmmConfig: (id: string, data: any) =>
        request(`/internal/smm-configs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
    
    deleteSmmConfig: (id: string) =>
        request(`/internal/smm-configs/${id}`, { method: 'DELETE' }),

    // ── SSM ──
    ssmServices: (panel?: string) => request<unknown[]>(`/ssm/services?panel=${panel || 'SUPPORTIVE_SMM'}`),
    ssmBalance: (panel?: string) => request(`/ssm/balance?panel=${panel || 'SUPPORTIVE_SMM'}`),
};
