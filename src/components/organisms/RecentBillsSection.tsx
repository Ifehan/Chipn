'use client'

import React from 'react'

export function RecentBillsSection() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900">Recent Bills</h2>
        <a href="#" className="text-sm text-slate-900 font-medium hover:underline">View All</a>
      </div>
      <div className="card-visual p-10 text-center">
        <div className="text-7xl text-gray-300 mb-4 font-light">$</div>
        <p className="text-slate-700 font-medium mb-5 text-sm">No bills yet</p>
        <button className="bg-emerald-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
          Create Your First Bill
        </button>
      </div>
    </div>
  )
}
export default RecentBillsSection
