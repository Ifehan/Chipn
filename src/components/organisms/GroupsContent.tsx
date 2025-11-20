import React from 'react'

export function GroupsContent() {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 max-w-sm w-full">
        <div className="mb-4 flex justify-center">
          <div className="text-5xl">👑</div>
        </div>

        <div className="text-center mb-4 px-4">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
            Unlock Groups & Recurring Bills
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Create groups for your roommates, work crew, or friends. Set up recurring bills and never
            forget to collect payments again!
          </p>
        </div>

        <ul className="space-y-4 mb-6 px-6">
          <li className="flex items-start gap-3 text-sm text-slate-800">
            <span className="mt-1 text-yellow-400 text-xl">⭐</span>
            <span className="font-medium">Save groups with persistent members</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-800">
            <span className="mt-1 text-yellow-400 text-xl">⭐</span>
            <span className="font-medium">Set up recurring bills (monthly rent, etc.)</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-800">
            <span className="mt-1 text-yellow-400 text-xl">⭐</span>
            <span className="font-medium">Automated payment reminders</span>
          </li>
        </ul>

        <div className="px-6">
          <button
            aria-label="Upgrade to Pro"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <span className="text-lg">👑</span>
            <span>Upgrade to Pro</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GroupsContent
