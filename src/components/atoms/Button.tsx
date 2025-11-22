import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-lg font-medium transition-colors'

  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
    outline: 'border border-gray-300 text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed'
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    />
  )
}

export default Button
