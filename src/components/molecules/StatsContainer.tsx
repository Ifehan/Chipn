import React from 'react'
import { StatCard } from '../atoms/StatCard'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsContainerProps {
  pendingTotal?: number
  completedTotal?: number
}

export function StatsContainer({
  pendingTotal = 0,
  completedTotal = 0
}: StatsContainerProps) {
  const formatAmount = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <StatCard
        label="Pending"
        amount={formatAmount(pendingTotal)}
        icon={<ArrowUpRight size={18} className="text-orange-500" />}
      />
      <StatCard
        label="Collected"
        amount={formatAmount(completedTotal)}
        icon={<ArrowDownRight size={18} className="text-emerald-600" />}
      />
    </div>
  )
}

export default StatsContainer
