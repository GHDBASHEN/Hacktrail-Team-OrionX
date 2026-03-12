import React from 'react'
import { Logout } from '../components/Logout'
import FoodManagement from './Admin/FoodManagement'

const EmployeeDB = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Employee Dashboard</h1>
          <Logout />
        </div>
        <p className="mb-4">Welcome Employee: {sessionStorage.getItem('credential')}</p>
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 mb-6">
          <p className="text-sm text-gray-600">From here, as an employee you can add or manage food items.</p>
        </div>
        <FoodManagement />
      </div>
    </div>
  )
}

export default EmployeeDB