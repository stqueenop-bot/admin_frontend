'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Shield, User, Mail, Calendar, Key, RefreshCcw, Search, Plus, Trash2, Edit2, Lock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function AccessControlPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [isResetting, setIsResetting] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Add Member Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'USER'
  })

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      const response = await api.getAdmins()
      return response.data || []
    },
  })

  const createAdminMutation = useMutation({
    mutationFn: async (data: any) => {
        return await api.createAdmin(data)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admins'] })
        toast.success('Member added successfully')
        setIsAddModalOpen(false)
        setFormData({ email: '', password: '', name: '', role: 'USER' })
    },
    onError: (err: any) => {
        toast.error(err.message || 'Failed to add member.')
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ adminId, password }: any) => {
      return await api.resetPassword(adminId, password)
    },
    onSuccess: () => {
        toast.success('Password updated successfully')
        setIsResetting(null)
        setNewPassword('')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to reset password.')
    },
  })

  const handleResetPassword = (adminId: string) => {
    if (!newPassword) {
        toast.error('Please enter a new password')
        return
    }
    resetPasswordMutation.mutate({ adminId, password: newPassword })
  }

  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
        return await api.deleteAdmin(id)
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admins'] })
        toast.success('Admin removed successfully')
    },
    onError: (err: any) => {
        toast.error(err.message || 'Failed to delete admin.')
    }
  })

  const handleDeleteAdmin = (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email}?`)) {
        deleteAdminMutation.mutate(id)
    }
  }

  const filteredAdmins = (admins || []).filter((admin: any) =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-500 mt-1">Manage team members and security permissions</p>
        </div>
        <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-purple-500/20"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add New Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 rounded-xl border-gray-200"
          />
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-100/50 overflow-hidden">
        <div className="p-6 border-b border-purple-100/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">Authorized personnel and their roles</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Spinner className="w-10 h-10 text-purple-600 mx-auto" />
              <p className="mt-4 text-gray-600 font-medium">Loading members...</p>
            </div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No members found</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-teal-50 to-emerald-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-teal-900 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-teal-900 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-teal-900 uppercase tracking-wider">Joined On</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-teal-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-100/50">
                {filteredAdmins.map((admin: any) => (
                  <tr key={admin.id} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center font-bold text-teal-700">
                          {admin.name ? admin.name[0].toUpperCase() : <User className="w-5 h-5 text-teal-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{admin.email}</p>
                          {admin.name && <p className="text-xs text-gray-500">{admin.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                        admin.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      )}>
                        {admin.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(admin.createdAt), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        {isResetting === admin.id ? (
                            <div className="flex items-center gap-2 justify-end">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        type="password" 
                                        placeholder="New password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-9 w-40 pl-9 rounded-lg text-xs"
                                    />
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleResetPassword(admin.id)}
                                    disabled={resetPasswordMutation.isPending}
                                    className="bg-emerald-600 hover:bg-emerald-700 h-9"
                                >
                                    {resetPasswordMutation.isPending ? <Spinner className="w-3 h-3" /> : 'Set'}
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => { setIsResetting(null); setNewPassword(''); }}
                                    className="h-9"
                                >
                                    Cancel
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsResetting(admin.id)}
                                    className="h-9 rounded-lg text-purple-600 hover:bg-purple-50"
                                >
                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                    Reset Pass
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                                    className="h-9 w-9 p-0 text-gray-400 hover:text-rose-600 hover:bg-rose-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5" />
                <h2 className="text-xl font-bold">Add New Member</h2>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                createAdminMutation.mutate(formData);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Display Name</label>
                <Input 
                  placeholder="e.g. Bhoumik Chopra" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <Input 
                  type="email"
                  placeholder="admin@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Initial Password</label>
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Access Role</label>
                <select 
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="USER">USER (Restricted Access)</option>
                  <option value="ADMIN">ADMIN (Full Access)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                    type="submit"
                    disabled={createAdminMutation.isPending}
                    className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {createAdminMutation.isPending ? <Spinner className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-blue-900">Privileged Operations</h3>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            As an administrator, you can manage team access levels. **ADMIN** role grants full access to banners and access control, while **USER** role is restricted to orders and spends.
          </p>
        </div>
      </div>
    </div>
  )
}
