
import React, { useContext } from 'react'
import CustomerOrderPage from './Customer/CustomerOrderPage'
import { AuthContext } from '../context/Authcontext' // adjust path as needed
// import CustomerOrder from './customer/CustomerOr';

const Menus = () => {
  const { user } = useContext(AuthContext);
  const customerId = user?.id; // or user?.customerId if that's your field

  return (
    <div className='w-full h-full '>
      <CustomerOrderPage customerId={customerId} />
      {/* <CustomerOrder customerId={customerId} /> */}
    </div>
  )
}

export default Menus;