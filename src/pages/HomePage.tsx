import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Header } from '../components/molecules/Header'
import { TabsContainer } from '../components/molecules/TabsContainer'
import { StatsContainer } from '../components/molecules/StatsContainer'
import { QuickActions } from '../components/molecules/QuickActions'
import { RecentBillsSection } from '../components/organisms/RecentBillsSection'
import { GroupsContent } from '../components/organisms/GroupsContent'

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'bills' | 'groups'>('bills')

  // Get user display name and phone from context
  const userName = user ? `${user.first_name} ${user.last_name}` : 'User'
  const phoneNumber = user?.phone_number || ''
  const avatar = user ? user.first_name.charAt(0).toUpperCase() : 'U'

  // Get transaction totals from user data
  const pendingTotal = user?.pending_transactions_total || 0
  const completedTotal = user?.completed_transactions_total || 0

  return (
    <div className="app-shell">
      <div className="px-4 pt-6 flex flex-col min-h-screen bg-gray-50">
        <Header
          userName={userName}
          phoneNumber={phoneNumber}
          avatar={avatar}
          onProfileClick={() => navigate('/profile')}
        />

        <TabsContainer activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto pb-8">
          {activeTab === 'bills' ? (
            <div className="transition-opacity duration-300">
              <StatsContainer
                pendingTotal={pendingTotal}
                completedTotal={completedTotal}
              />
              <QuickActions />
              <RecentBillsSection />
            </div>
          ) : (
            <div className="transition-opacity duration-300">
              <GroupsContent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
