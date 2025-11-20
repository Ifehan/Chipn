import React from 'react'
import { StatCard } from '../atoms/StatCard'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function StatsContainer() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatCard
        label="Pending"
        amount="KSh 0"
        icon={<ArrowUpRight size={18} className="text-orange-500" />}
      />
      <StatCard
        label="Collected"
        amount="KSh 0"
        icon={<ArrowDownRight size={18} className="text-emerald-600" />}
      />
    </div>
  )
}

export default StatsContainer
