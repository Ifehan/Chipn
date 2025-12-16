import React, { useState } from 'react'
import { Sidebar } from '../components/organisms/Sidebar'
import { StatCard } from '../components/atoms/StatCard'
import { Users, MapPin, Phone } from 'lucide-react'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: 'Active' | 'Inactive'
  joinDate: string
}

export function VendorsPage() {
  const [vendors] = useState<Vendor[]>([
    {
      id: 'V001',
      name: 'Java House',
      email: 'contact@javahouse.co.ke',
      phone: '+254 722 123 456',
      location: 'Nairobi',
      status: 'Active',
      joinDate: '2024-01-15'
    },
    {
      id: 'V002',
      name: 'Kenyan Bites',
      email: 'info@kenyanbites.com',
      phone: '+254 733 234 567',
      location: 'Nairobi',
      status: 'Active',
      joinDate: '2024-02-20'
    },
    {
      id: 'V003',
      name: 'Mama Deli',
      email: 'sales@mamadeli.co.ke',
      phone: '+254 711 345 678',
      location: 'Kampala',
      status: 'Active',
      joinDate: '2024-03-10'
    },
    {
      id: 'V004',
      name: 'Tech Café',
      email: 'hello@techcafe.com',
      phone: '+254 722 456 789',
      location: 'Nairobi',
      status: 'Inactive',
      joinDate: '2023-12-05'
    }
  ])

  const stats = [
    { label: 'Total Vendors', amount: vendors.length.toString(), icon: <Users size={18} className="text-slate-500" /> },
    { label: 'Active Vendors', amount: vendors.filter(v => v.status === 'Active').length.toString(), icon: <Users size={18} className="text-green-500" /> },
    { label: 'Inactive Vendors', amount: vendors.filter(v => v.status === 'Inactive').length.toString(), icon: <Users size={18} className="text-red-500" /> }
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-full">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-900">Vendors Management</h1>
            <p className="text-sm text-slate-500">Manage all vendors in the system</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} amount={s.amount} icon={s.icon} />
            ))}
          </section>

          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-slate-800 mb-4">Vendor List</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-xs text-slate-500 text-left border-b">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Phone</th>
                      <th className="py-2 pr-4">Location</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} className="text-sm text-slate-700 border-b last:border-b-0 hover:bg-slate-50">
                        <td className="py-3 pr-4 font-medium">{vendor.id}</td>
                        <td className="py-3 pr-4 font-medium">{vendor.name}</td>
                        <td className="py-3 pr-4">{vendor.email}</td>
                        <td className="py-3 pr-4">{vendor.phone}</td>
                        <td className="py-3 pr-4 flex items-center gap-1">
                          <MapPin size={14} className="text-slate-400" />
                          {vendor.location}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {vendor.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500">{new Date(vendor.joinDate).toLocaleDateString()}</td>
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

export default VendorsPage
