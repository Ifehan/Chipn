"use client"

import { Users, Calculator } from "lucide-react"

interface SplitMethodSelectorProps {
  selectedMethod: "equal" | "percentage" | "custom"
  onMethodChange: (method: "equal" | "percentage" | "custom") => void
}

export function SplitMethodSelector({ selectedMethod, onMethodChange }: SplitMethodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <button
        onClick={() => onMethodChange("equal")}
        aria-selected={selectedMethod === "equal"}
        role="button"
        className={`py-4 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 ${
          selectedMethod === "equal"
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <Users size={24} />
        <span>Equal</span>
      </button>
      <button
        onClick={() => onMethodChange("percentage")}
        aria-selected={selectedMethod === "percentage"}
        role="button"
        className={`py-4 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 ${
          selectedMethod === "percentage"
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <Calculator size={24} />
        <span>Percentage</span>
      </button>
      <button
        onClick={() => onMethodChange("custom")}
        aria-selected={selectedMethod === "custom"}
        role="button"
        className={`py-4 px-4 rounded-lg font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 ${
          selectedMethod === "custom"
            ? "bg-black text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        <Calculator size={24} />
        <span>Custom</span>
      </button>
    </div>
  )
}

export default SplitMethodSelector
