import React from 'react'
import { Settings, User, Bell, Lock } from 'lucide-react'
import { SectionCard } from '../molecules/SectionCard'
import { SettingItem } from '../atoms/SettingItem'

interface AccountSettingsSectionProps {
  onEditProfile?: () => void
}

export function AccountSettingsSection({ onEditProfile }: AccountSettingsSectionProps) {
  const comingSoon = (feature: string) => alert(`${feature} — coming soon!`)

  return (
    <SectionCard title="Account Settings" icon={Settings}>
      <div className="space-y-0">
        <SettingItem icon={User} label="Edit Profile" onClick={onEditProfile} />
        <SettingItem icon={Bell} label="Notification Settings" onClick={() => comingSoon('Notification Settings')} />
        <SettingItem icon={Lock} label="Privacy & Security" onClick={() => comingSoon('Privacy & Security')} />
      </div>
    </SectionCard>
  )
}
