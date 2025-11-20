import React from 'react'
import { HelpCircle, Phone, Info } from 'lucide-react'
import { SectionCard } from '../molecules/SectionCard'
import { SettingItem } from '../atoms/SettingItem'

export function SupportSection() {
  return (
    <SectionCard title="Support & Help" icon={HelpCircle}>
      <div className="space-y-0">
        <SettingItem icon={HelpCircle} label="Help Center" />
        <SettingItem icon={Phone} label="Contact Support" />
        <SettingItem icon={Info} label="Terms & Conditions" />
      </div>
    </SectionCard>
  )
}

export default SupportSection
