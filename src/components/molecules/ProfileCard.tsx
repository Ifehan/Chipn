import React from 'react'
import { Mail, Phone, Shield } from 'lucide-react'
import { Avatar } from '../atoms/Avatar'

interface ProfileCardProps {
  userName: string
  userEmail: string
  phoneNumber: string
  avatar: string
}

export function ProfileCard({ userName, userEmail, phoneNumber, avatar }: ProfileCardProps) {
  return (
    <div className="card-visual mb-4 p-5">
      <div className="flex items-start gap-3">
        <Avatar initials={avatar} size="md" />
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-slate-900 mb-2">{userName}</h2>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400 flex-shrink-0" />
              <p className="text-sm text-slate-600 truncate">{userEmail}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400 flex-shrink-0" />
              <p className="text-sm text-slate-600">{phoneNumber}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield size={14} className="text-emerald-600 flex-shrink-0" />
              <p className="text-xs font-medium text-emerald-600">Verified Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
