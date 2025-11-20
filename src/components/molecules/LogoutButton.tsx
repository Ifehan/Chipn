import React from 'react'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  onClick?: () => void
}

export function LogoutButton({ onClick }: LogoutButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full card-visual hover:bg-red-50 transition-colors py-3.5 flex items-center justify-center gap-2"
    >
      <LogOut size={18} className="text-red-600" />
      <span className="font-medium text-red-600 text-sm">Logout</span>
    </button>
  )
}

export default LogoutButton
