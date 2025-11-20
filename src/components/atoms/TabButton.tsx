import React from 'react'
import { Button } from './Button'

interface TabButtonProps {
  label: string
  icon?: React.ReactNode
  active: boolean
  onClick: () => void
}

export function TabButton({ label, icon, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      role="button"
      aria-selected={active}
      className={`flex-1 text-center py-2 rounded-full font-medium transition-all duration-200 ease-in-out transform flex items-center justify-center gap-2 ${
        active ? 'text-black z-10' : 'text-black z-0'
      }`}
    >
      <span className="text-sm">{label}</span>
      {icon && <span className="text-sm">{icon}</span>}
    </button>
  )
}

export default TabButton
