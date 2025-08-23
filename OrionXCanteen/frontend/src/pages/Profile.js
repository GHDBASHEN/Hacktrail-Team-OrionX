import React, { useContext } from 'react'
import CustomerOrderPage from '../pages/Customer/CustomerOrderPage'
import { AuthContext } from '../context/Authcontext' // adjust path as needed

const Profile = () => {
  const { user } = useContext(AuthContext);
  const customerId = user?.id; // or user?.customerId if that's your field

  return (
    <div className='w-full h-full '>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <CustomerOrderPage customerId={customerId} />
      
    </div>
  )
}

export default Profile