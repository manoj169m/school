import React from 'react'
import { FinanceGraph } from './AllExpenses/FinanceGraph'
import { FinanceBar } from './AllExpenses/FinanceBar'

export default function ExpensesGraph() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
    {/* Left Section */}
    <div className="sm:col-span-2 lg:col-span-5 space-y-5">
      <FinanceGraph />
    </div>
  
    {/* Right Section */}
    <div className="sm:col-span-2 lg:col-span-3 space-y-5">
      <FinanceBar />
    </div>
  </div>
  
  )
}
