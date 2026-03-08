"use client"
import { Button } from "../atoms/Button"
import { History, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => navigate("/create-bill")}
          variant="primary"
          fullWidth
          className="flex flex-col items-center justify-center gap-2 py-4 text-sm font-semibold quick-action"
        >
          <Plus size={24} className="text-white" />
          <span className="text-sm">Split Bill</span>
        </Button>
        <Button
          onClick={() => navigate("/transactions")}
          variant="outline"
          fullWidth
          className="flex flex-col items-center justify-center gap-2 py-4 text-sm quick-action bg-white"
        >
          <History size={24} className="text-gray-700" />
          <span className="text-sm">History</span>
        </Button>
      </div>
    </div>
  )
}

export default QuickActions
