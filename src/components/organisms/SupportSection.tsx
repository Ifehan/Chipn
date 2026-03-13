import React from 'react'
import { HelpCircle, Phone, Info } from 'lucide-react'
import { SectionCard } from '../molecules/SectionCard'
import { SettingItem } from '../atoms/SettingItem'

export function SupportSection() {
  const comingSoon = (feature: string) => alert(`${feature} — coming soon!`)

  return (
    <SectionCard title="Support & Help" icon={HelpCircle}>
      <div className="space-y-0">
        <SettingItem icon={HelpCircle} label="Help Center" onClick={() => comingSoon('Help Center')} />
        <SettingItem icon={Phone} label="Contact Support" onClick={() => window.location.href = 'mailto:support@tandapay.com'} />
        <SettingItem icon={Info} label="Terms & Conditions" onClick={() => comingSoon('Terms & Conditions')} />
      </div>
    </SectionCard>
  )
}

export default SupportSection
