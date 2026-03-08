import React from 'react'
import { TabButton } from '../atoms/TabButton'
import { Crown } from "lucide-react"

interface TabsContainerProps {
  activeTab: 'bills' | 'groups'
  onTabChange: (tab: 'bills' | 'groups') => void
}

export function TabsContainer({ activeTab, onTabChange }: TabsContainerProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="flex w-full bg-gray-200 p-1 rounded-full gap-1 relative">
          {/* sliding pill indicator */}
          <div
            aria-hidden
            className={`absolute top-1 left-1 w-1/2 h-[calc(100%-0.5rem)] bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
              activeTab === 'groups' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          <TabButton
            label="Bills"
            active={activeTab === 'bills'}
            onClick={() => onTabChange('bills')}
          />
          <TabButton
            label="Groups"
            icon={<Crown size={24} className="text-yellow-400" />}
            active={activeTab === 'groups'}
            onClick={() => onTabChange('groups')}
          />
        </div>
      </div>
    </div>
  )
}

export default TabsContainer
