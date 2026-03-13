"use client"

import { DollarSign } from "lucide-react"

interface CustomSplitInputProps {
  participants: string[]
  currentUserPhone: string
  customAmounts: Record<string, number>
  onCustomAmountsChange: (amounts: Record<string, number>) => void
  totalAmount: number
}

export function CustomSplitInput({
  participants,
  currentUserPhone,
  customAmounts,
  onCustomAmountsChange,
  totalAmount,
}: CustomSplitInputProps) {
  const allParticipants = [currentUserPhone, ...participants]
  const assignedTotal = Object.values(customAmounts).reduce((sum, a) => sum + a, 0)
  const remaining = Math.round((totalAmount - assignedTotal) * 100) / 100
  const isValid = Math.abs(remaining) < 0.01

  const handleChange = (phone: string, value: string) => {
    const parsed = value === "" ? 0 : parseFloat(value)
    if (!isNaN(parsed) && parsed >= 0) {
      onCustomAmountsChange({ ...customAmounts, [phone]: parsed })
    }
  }

  const handleDistributeEvenly = () => {
    const even = Math.round((totalAmount / allParticipants.length) * 100) / 100
    const updated: Record<string, number> = {}
    allParticipants.forEach((phone, i) => {
      // Give the remainder to the last participant to match total exactly
      updated[phone] = i === allParticipants.length - 1
        ? Math.round((totalAmount - even * (allParticipants.length - 1)) * 100) / 100
        : even
    })
    onCustomAmountsChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Assign amounts</p>
        <button
          type="button"
          onClick={handleDistributeEvenly}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Split evenly
        </button>
      </div>

      <div className="space-y-2">
        {allParticipants.map((phone) => (
          <div key={phone} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <span className="text-sm text-gray-900 flex-1 truncate">
              {phone === currentUserPhone ? `${phone} (You)` : phone}
            </span>
            <div className="flex items-center gap-1.5">
              <DollarSign size={14} className="text-gray-400" />
              <input
                type="number"
                min={0}
                step={0.01}
                value={customAmounts[phone] ?? ""}
                onChange={(e) => handleChange(phone, e.target.value)}
                className="w-28 bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <span className="text-xs text-gray-500">KSH</span>
            </div>
          </div>
        ))}
      </div>

      {/* Validation indicator */}
      <div className={`text-sm font-medium flex items-center justify-between px-1 ${isValid ? "text-emerald-600" : "text-amber-600"}`}>
        <span>Assigned: KSH {assignedTotal.toLocaleString()} / {totalAmount.toLocaleString()}</span>
        {!isValid && (
          <span className="text-xs">
            {remaining > 0
              ? `KSH ${remaining.toLocaleString()} remaining`
              : `KSH ${Math.abs(remaining).toLocaleString()} over`}
          </span>
        )}
      </div>
    </div>
  )
}

export default CustomSplitInput
