import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/molecules/Header'
import { TabsContainer } from '../components/molecules/TabsContainer'
import { StatsContainer } from '../components/molecules/StatsContainer'
import { QuickActions } from '../components/molecules/QuickActions'
import { RecentBillsSection } from '../components/organisms/RecentBillsSection'
import { GroupsContent } from '../components/organisms/GroupsContent'

export function HomePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'bills' | 'groups'>('bills')

  return (
    <div className="app-shell">
      <div className="px-4 pt-6 flex flex-col min-h-screen bg-gray-50">
        <Header
          userName="test"
          phoneNumber="+254710670537"
          avatar="T"
          onProfileClick={() => navigate('/profile')}
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
