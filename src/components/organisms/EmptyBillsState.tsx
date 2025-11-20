import React from 'react'
import { Button } from '../atoms/Button'
import { DollarSign } from 'lucide-react'

export function EmptyBillsState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <DollarSign size={56} className="text-gray-300 mb-4" />
      <p className="text-gray-600 text-center mb-6">No bills yet</p>
      <Button variant="primary" fullWidth className="empty-primary-btn">
        Create Your First Bill
      </Button>
    </div>
  )
}

export default EmptyBillsState
