import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = 'Go back' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
      aria-label={label}
    >
      <ArrowLeft size={20} className="text-slate-900" />
    </button>
  )
}

export default BackButton
