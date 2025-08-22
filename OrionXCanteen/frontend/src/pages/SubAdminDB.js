import React from 'react'
import { Logout } from '../components/Logout'

export const SubAdminDB = () => {
  return (
    <div>
      <p>Welcome Sub Admin: {sessionStorage.getItem('credential')}</p>
      <Logout />
    </div>
  )
}
