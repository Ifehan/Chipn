import React from 'react'
import { CreditCard, Settings } from 'lucide-react'
import { SectionCard } from '../molecules/SectionCard'
import { PaymentMethodCard } from '../molecules/PaymentMethodCard'
import { SettingItem } from '../atoms/SettingItem'

interface PaymentSettingsSectionProps {
  phoneNumber: string
}

export function PaymentSettingsSection({ phoneNumber }: PaymentSettingsSectionProps) {
  return (
    <SectionCard title="Payment Settings" icon={CreditCard}>
      <div className="space-y-1">
        <PaymentMethodCard name="M-PESA Account" phoneNumber={phoneNumber} status="Active" />
        <SettingItem icon={Settings} label="Transaction Limits" onClick={() => alert('Transaction Limits — coming soon!')} />
      </div>
    </SectionCard>
  )
}
