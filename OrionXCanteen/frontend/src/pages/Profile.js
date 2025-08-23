
import React, { useContext } from 'react'
// import CustomerOrderPage from '../pages/Customer/CustomerOrderPage'
import { AuthContext } from '../context/Authcontext' // adjust path as needed
import CustomerOrderPage from './Customer/CustomerOrderPage';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const customerId = user?.id; // or user?.customerId if that's your field

  return (
    <div className='w-full h-full '>
      <CustomerOrderPage customerId={customerId} />
      {/* <CustomerOr customerId={customerId} /> */}
    </div>
  )
}

export default Profile;