"use client"

import { Users, Calculator } from "lucide-react"

interface SplitMethodSelectorProps {
  selectedMethod: "equal" | "custom"
  onMethodChange: (method: "equal" | "custom") => void
}

export function SplitMethodSelector({ selectedMethod, onMethodChange }: SplitMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => onMethodChange("equal")}
        className={`py-4 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 ${
          selectedMethod === "equal"
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <Users size={24} />
        <span>Equal Split</span>
      </button>
      <button
        onClick={() => onMethodChange("custom")}
        className={`py-4 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 ${
          selectedMethod === "custom"
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <Calculator size={24} />
        <span>Custom Split</span>
      </button>
    </div>
  )
}

export default SplitMethodSelector
