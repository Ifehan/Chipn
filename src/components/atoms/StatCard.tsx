import React from 'react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  amount: string
  icon: React.ReactNode
  trend?: 'up' | 'down'
}

export function StatCard({ label, amount, icon, trend }: StatCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {icon}
          <p className="text-gray-600 text-xs font-medium">{label}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900">{amount}</p>
      </div>
    </Card>
  )
}

export default StatCard
