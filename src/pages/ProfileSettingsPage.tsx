import React from 'react'
import { BackButton } from '../components/atoms/BackButton'
import { ProfileCard } from '../components/molecules/ProfileCard'
import { AccountSettingsSection } from '../components/organisms/AccountSettingsSection'
import { PaymentSettingsSection } from '../components/organisms/PaymentSettingsSection'
import { SupportSection } from '../components/organisms/SupportSection'
import { LogoutButton } from '../components/molecules/LogoutButton'

interface ProfileSettingsPageProps {
  onBack: () => void
  userName: string
  userEmail: string
  phoneNumber: string
  avatar: string
}

export function ProfileSettingsPage({
  onBack,
  userName,
  userEmail,
  phoneNumber,
  avatar
}: ProfileSettingsPageProps) {
  return (
    <div className="app-shell overflow-y-auto bg-gray-50">
      <div className="px-4 py-4 pb-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={onBack} />
          <h1 className="text-base font-semibold text-slate-900">Profile & Settings</h1>
        </div>

        {/* Profile Card */}
        <ProfileCard userName={userName} userEmail={userEmail} phoneNumber={phoneNumber} avatar={avatar} />

        {/* Account Settings */}
        <AccountSettingsSection />

        {/* Payment Settings */}
        <PaymentSettingsSection phoneNumber={phoneNumber} />

        {/* Support & Help */}
        <SupportSection />

        {/* App Info */}
        <div className="card-visual mb-4 p-4 text-center">
          <p className="font-semibold text-slate-900 text-sm">TandaPay</p>
          <p className="text-xs text-slate-500 mt-1">Version 1.0.0 MVP</p>
          <p className="text-xs text-slate-500 mt-0.5">Secure bill splitting powered by M-PESA</p>
        </div>

        {/* Logout Button */}
        <LogoutButton onClick={() => console.log('Logout clicked')} />
      </div>
    </div>
  )
}

export default ProfileSettingsPage
