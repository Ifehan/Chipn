import React, { useState } from 'react'
import { Header } from '../components/molecules/Header'
import { TabsContainer } from '../components/molecules/TabsContainer'
import { StatsContainer } from '../components/molecules/StatsContainer'
import { QuickActions } from '../components/molecules/QuickActions'
import { RecentBillsSection } from '../components/organisms/RecentBillsSection'
import { BillsContent } from '../components/organisms/BillsContent'
import { GroupsContent } from '../components/organisms/GroupsContent'
import { ProfileSettingsPage } from './ProfileSettingsPage'

export function HomePage() {
  const [activeTab, setActiveTab] = useState<'bills' | 'groups'>('bills')
  const [showProfile, setShowProfile] = useState(false)

  if (showProfile) {
    return (
      <ProfileSettingsPage
        onBack={() => setShowProfile(false)}
        userName="test"
        userEmail="test@mail.com"
        phoneNumber="+254710670537"
        avatar="T"
      />
    )
  }

  return (
    <div className="app-shell">
      <div className="px-4 pt-6 flex flex-col min-h-screen bg-gray-50">
        <Header
          userName="test"
          phoneNumber="+254710670537"
          avatar="T"
          onProfileClick={() => setShowProfile(true)}
        />

        <TabsContainer activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto pb-8">
          {activeTab === 'bills' ? (
            <div className="transition-opacity duration-300">
              <StatsContainer />
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
