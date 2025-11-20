interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ initials, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  return (
    <div className={`${sizeClasses[size]} bg-emerald-100 rounded-full flex items-center justify-center ring-1 ring-emerald-200 flex-shrink-0`}>
      <span className="text-emerald-600 font-semibold text-lg">{initials}</span>
    </div>
  )
}

export default Avatar
