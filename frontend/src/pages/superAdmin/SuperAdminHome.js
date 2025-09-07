import React from 'react'

const superAdminHome = () => {
    return (
        <div className=' mt-5 ' >
            <p>Welcome Super Admin: {sessionStorage.getItem('credential')}</p>
        </div>
    )
}

export default superAdminHome