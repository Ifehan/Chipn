import React from 'react'
import { User } from 'lucide-react'

interface HeaderProps {
  userName: string
  phoneNumber: string
  avatar: string
  onProfileClick?: () => void
}

export function Header({ userName, phoneNumber, avatar, onProfileClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center ring-1 ring-emerald-200">
          <span className="text-emerald-600 font-semibold">{avatar}</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900">Welcome back, {userName}</h1>
          <p className="text-slate-500 text-sm">{phoneNumber}</p>
        </div>
      </div>
      <div>
        <button
          onClick={onProfileClick}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Open profile settings"
        >
          <User size={18} className="text-slate-600" />
        </button>
      </div>
    </div>
  )
}

export default Header
