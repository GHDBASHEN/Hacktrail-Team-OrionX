import React from 'react'

export const Footer = () => {
  return (


    <footer className="bg-slate-800 dark:bg-gray-900">
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ruhuna FOT Canteen</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Serving delicious meals and refreshments to students, staff, and visitors at Ruhuna FOT Canteen.
            </p>
            
          </div>
        </div>
      </footer>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="sm:flex sm:items-center  sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} Ruhuna FOT Canteen. All rights reserved.
          </span>
          
        </div>
      </div>
    </footer>
  )
}
