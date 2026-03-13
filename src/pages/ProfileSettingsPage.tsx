import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButton } from '../components/atoms/BackButton'
import { ProfileCard } from '../components/molecules/ProfileCard'
import { AccountSettingsSection } from '../components/organisms/AccountSettingsSection'
import { PaymentSettingsSection } from '../components/organisms/PaymentSettingsSection'
import { SupportSection } from '../components/organisms/SupportSection'
import { LogoutButton } from '../components/molecules/LogoutButton'
import { useAuth } from '../contexts/AuthContext'
import { useUpdateUser } from '../hooks/useUsers'

export function ProfileSettingsPage() {
  const navigate = useNavigate()
  const onBack = () => navigate(-1)
  const { user, logout, loading, refreshUser } = useAuth()
  const { updateUser, loading: saving } = useUpdateUser()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ first_name: '', last_name: '', phone_number: '' })
  const [saveError, setSaveError] = useState('')

  const startEditing = () => {
    if (!user) return
    setForm({ first_name: user.first_name, last_name: user.last_name, phone_number: user.phone_number })
    setSaveError('')
    setEditing(true)
  }

  const handleSave = async () => {
    if (!user) return
    try {
      setSaveError('')
      await updateUser(user.id, form)
      await refreshUser()
      setEditing(false)
    } catch {
      setSaveError('Failed to save changes. Please try again.')
    }
  }

  const userData = user ? {
    userName: `${user.first_name} ${user.last_name}`,
    userEmail: user.email,
    phoneNumber: user.phone_number,
    avatar: user.first_name.charAt(0).toUpperCase(),
  } : { userName: '', userEmail: '', phoneNumber: '', avatar: '' }

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

  return (
    <div className="app-shell overflow-y-auto bg-gray-50">
      <div className="px-4 py-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <BackButton onClick={onBack} />
          <h1 className="text-base font-semibold text-slate-900">
            {editing ? 'Edit Profile' : 'Profile & Settings'}
          </h1>
        </div>

        {editing ? (
          <div className="card-visual mb-4 p-4 space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-medium">First Name</label>
              <input
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium">Last Name</label>
              <input
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium">M-PESA Phone Number</label>
              <input
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={form.phone_number}
                onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))}
              />
            </div>
            {saveError && <p className="text-red-500 text-xs">{saveError}</p>}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <ProfileCard
              userName={userData.userName}
              userEmail={userData.userEmail}
              phoneNumber={userData.phoneNumber}
              avatar={userData.avatar}
            />
            <AccountSettingsSection onEditProfile={startEditing} />
            <PaymentSettingsSection phoneNumber={userData.phoneNumber} />
            <SupportSection />
            <div className="card-visual mb-4 p-4 text-center">
              <p className="font-semibold text-slate-900 text-sm">TandaPay</p>
              <p className="text-xs text-slate-500 mt-1">Version 1.0.0 MVP</p>
              <p className="text-xs text-slate-500 mt-0.5">Secure bill splitting powered by M-PESA</p>
            </div>
            <LogoutButton onClick={logout} />
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileSettingsPage
