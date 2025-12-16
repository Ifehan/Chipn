import React, { useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { Users, UserCheck, AlertCircle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'User' | 'Support'
  status: 'Active' | 'Inactive' | 'Suspended'
  joinDate: string
  lastLogin: string
}

export function UserManagementPage() {
  const [users] = useState<User[]>([
    {
      id: 'U001',
      name: 'Admin User',
      email: 'admin@tandapay.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2024-01-01',
      lastLogin: '2025-12-14T10:30:00'
    },
    {
      id: 'U002',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-03-15',
      lastLogin: '2025-12-13T14:20:00'
    },
    {
      id: 'U003',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-04-20',
      lastLogin: '2025-12-12T09:15:00'
    },
    {
      id: 'U004',
      name: 'Support Staff',
      email: 'support@tandapay.com',
      role: 'Support',
      status: 'Active',
      joinDate: '2024-02-10',
      lastLogin: '2025-12-14T08:00:00'
    },
    {
      id: 'U005',
      name: 'Inactive User',
      email: 'inactive@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-05-01',
      lastLogin: '2025-10-30T15:45:00'
    }
  ])

  const stats = [
    { label: 'Total Users', amount: users.length.toString(), icon: <Users size={18} className="text-slate-500" /> },
    { label: 'Active Users', amount: users.filter(u => u.status === 'Active').length.toString(), icon: <UserCheck size={18} className="text-green-500" /> },
    { label: 'Suspended/Inactive', amount: users.filter(u => u.status !== 'Active').length.toString(), icon: <AlertCircle size={18} className="text-red-500" /> }
  ]

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700'
      case 'Support': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700'
      case 'Suspended': return 'bg-red-100 text-red-700'
      case 'Inactive': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-full">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
            <p className="text-sm text-slate-500">Manage system users and their roles</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} amount={s.amount} icon={s.icon} />
            ))}
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-4">User List</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-xs text-slate-500 text-left border-b">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Join Date</th>
                      <th className="py-2 pr-4">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="text-sm text-slate-700 border-b last:border-b-0 hover:bg-slate-50">
                        <td className="py-3 pr-4 font-medium">{user.id}</td>
                        <td className="py-3 pr-4 font-medium">{user.name}</td>
                        <td className="py-3 pr-4">{user.email}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                        <td className="py-3 pr-4 text-slate-500">{new Date(user.lastLogin).toLocaleDateString()} {new Date(user.lastLogin).toLocaleTimeString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default UserManagementPage
