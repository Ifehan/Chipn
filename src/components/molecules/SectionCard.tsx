import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

export function SectionCard({ title, icon: Icon, children }: SectionCardProps) {
  return (
    <div className="card-visual mb-4 overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
          <Icon size={18} />
          {title}
        </h3>
      </div>
      <div className="px-5 pb-2">
        {children}
      </div>
    </div>
  )
}

export default SectionCard
