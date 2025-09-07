import React from 'react'
import { Logout } from '../components/Logout'

const EmployeeDB = () => {
  return (
    <div>
      <p>Welcome Employee: {sessionStorage.getItem('credential')}</p>
      <Logout />
    </div>
  )
}

export default EmployeeDB