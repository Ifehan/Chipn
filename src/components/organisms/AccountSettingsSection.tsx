import React from 'react'
import { Settings, User, Bell, Lock } from 'lucide-react'
import { SectionCard } from '../molecules/SectionCard'
import { SettingItem } from '../atoms/SettingItem'

export function AccountSettingsSection() {
  return (
    <SectionCard title="Account Settings" icon={Settings}>
      <div className="space-y-0">
        <SettingItem icon={User} label="Edit Profile" />
        <SettingItem icon={Bell} label="Notification Settings" />
        <SettingItem icon={Lock} label="Privacy & Security" />
      </div>
    </SectionCard>
  )
}
