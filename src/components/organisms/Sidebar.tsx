import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../atoms/Avatar'
import { LogoutButton } from '../molecules/LogoutButton'

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          <div className="text-2xl font-bold text-slate-900">Chipn Admin</div>
          <div className="text-xs text-slate-400">Bill Splitting Dashboard</div>
        </div>

        <nav className="space-y-2">
          <Link to="/admin" className="block px-3 py-2 rounded-lg bg-slate-900 text-white">Dashboard</Link>
          <Link to="/admin/vendors" className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Vendors</Link>
          <Link to="/admin/transactions" className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Transactions</Link>
          <Link to="/admin/users" className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">User Management</Link>
        </nav>
      </div>

      <div>
        <div className="card-visual p-3 rounded-lg flex items-center">
          <Avatar initials="AU" size="sm" />
          <div className="ml-3">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-slate-500">admin@chipn.com</div>
          </div>
        </div>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
