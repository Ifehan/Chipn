import React, { useEffect, useState } from 'react'
import { BackButton } from '../components/atoms/BackButton'
import { ProfileCard } from '../components/molecules/ProfileCard'
import { AccountSettingsSection } from '../components/organisms/AccountSettingsSection'
import { PaymentSettingsSection } from '../components/organisms/PaymentSettingsSection'
import { SupportSection } from '../components/organisms/SupportSection'
import { LogoutButton } from '../components/molecules/LogoutButton'
import { useCurrentUser } from '../hooks/useUsers'

interface ProfileSettingsPageProps {
  onBack: () => void
}

/**
 * Profile Settings Page
 * Uses GET /users/me to fetch current user information
 * Uses PUT /users/{user_id} to update user information
 * Route: /profile-settings
 */
export function ProfileSettingsPage({ onBack }: ProfileSettingsPageProps) {
  const { getCurrentUser, loading, error } = useCurrentUser()
  const [userData, setUserData] = useState({
    userName: '',
    userEmail: '',
    phoneNumber: '',
    avatar: '',
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser()
        setUserData({
          userName: `${user.first_name} ${user.last_name}`,
          userEmail: user.email,
          phoneNumber: user.phone_number,
          avatar: '', // Avatar can be added later if needed
        })
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      }
    }

    fetchUserData()
  }, [getCurrentUser])

  if (loading) {
    return (
      <div className="app-shell overflow-y-auto bg-gray-50">
        <div className="px-4 py-4 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <BackButton onClick={onBack} />
            <h1 className="text-base font-semibold text-slate-900">Profile & Settings</h1>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-shell overflow-y-auto bg-gray-50">
        <div className="px-4 py-4 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <BackButton onClick={onBack} />
            <h1 className="text-base font-semibold text-slate-900">Profile & Settings</h1>
          </div>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load profile. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell overflow-y-auto bg-gray-50">
      <div className="px-4 py-4 pb-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={onBack} />
          <h1 className="text-base font-semibold text-slate-900">Profile & Settings</h1>
        </div>

        {/* Profile Card */}
        <ProfileCard
          userName={userData.userName}
          userEmail={userData.userEmail}
          phoneNumber={userData.phoneNumber}
          avatar={userData.avatar}
        />

        {/* Account Settings */}
        <AccountSettingsSection />

        {/* Payment Settings */}
        <PaymentSettingsSection phoneNumber={userData.phoneNumber} />

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
