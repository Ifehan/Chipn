"use client"

import { Percent } from "lucide-react"

interface PercentageSplitInputProps {
  participants: string[]
  currentUserPhone: string
  percentages: Record<string, number>
  onPercentagesChange: (percentages: Record<string, number>) => void
  totalAmount: number
}

export function PercentageSplitInput({
  participants,
  currentUserPhone,
  percentages,
  onPercentagesChange,
  totalAmount,
}: PercentageSplitInputProps) {
  const allParticipants = [currentUserPhone, ...participants]
  const totalPercentage = Object.values(percentages).reduce((sum, p) => sum + p, 0)
  const isValid = Math.abs(totalPercentage - 100) < 0.01

  const handleChange = (phone: string, value: string) => {
    const parsed = value === "" ? 0 : parseFloat(value)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      onPercentagesChange({ ...percentages, [phone]: parsed })
    }
  }

  const handleDistributeEvenly = () => {
    const even = Math.round((100 / allParticipants.length) * 100) / 100
    const updated: Record<string, number> = {}
    allParticipants.forEach((phone, i) => {
      // Give the remainder to the last participant to ensure exactly 100
      updated[phone] = i === allParticipants.length - 1
        ? Math.round((100 - even * (allParticipants.length - 1)) * 100) / 100
        : even
    })
    onPercentagesChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Assign percentages</p>
        <button
          type="button"
          onClick={handleDistributeEvenly}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Split evenly
        </button>
      </div>

      <div className="space-y-2">
        {allParticipants.map((phone) => {
          const pct = percentages[phone] ?? 0
          const amount = totalAmount > 0 ? Math.round((pct / 100) * totalAmount * 100) / 100 : 0

          return (
            <div key={phone} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900 flex-1 truncate">
                {phone === currentUserPhone ? `${phone} (You)` : phone}
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={percentages[phone] ?? ""}
                  onChange={(e) => handleChange(phone, e.target.value)}
                  className="w-20 bg-white border border-gray-200 rounded-md px-2 py-1.5 text-sm text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <Percent size={14} className="text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 w-24 text-right">
                KSH {amount.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Validation indicator */}
      <div className={`text-sm font-medium flex items-center justify-between px-1 ${isValid ? "text-emerald-600" : "text-amber-600"}`}>
        <span>Total: {totalPercentage.toFixed(2)}%</span>
        {!isValid && <span className="text-xs">Must equal 100%</span>}
      </div>
    </div>
  )
}

export default PercentageSplitInput
