import React from 'react'
import { type LucideIcon } from 'lucide-react'

interface SettingItemProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
}

export function SettingItem({ icon: Icon, label, onClick }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
    >
      <Icon size={20} className="text-slate-700 flex-shrink-0" />
      <span className="text-sm text-slate-900 font-normal">{label}</span>
    </button>
  )
}

export default SettingItem
