import React from 'react'

export const Footer = () => {
  return (


    <footer className="bg-slate-800 dark:bg-gray-900">
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ruhuna FOT Canteen</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Premium event venue for weddings, corporate events, and special celebrations.
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              {['D', 'E', 'A', 'N', 'D', 'R', 'A'].map((social, index) => (
                <li key={social + index} className="text-gray-400 hover:text-white transition duration-300 list-none">
                  <span className="sr-only">{social}</span>
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-sm">{social.charAt(0).toUpperCase()}</span>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="sm:flex sm:items-center  sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} Ruhuna FOT Canteen. All rights reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a href="https://www.facebook.com/Deandrabolgoda" className="text-white hover:text-gray-900 dark:hover:text-white">
              <svg className="w-[22px] h-[22px] text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 </svg>24">
                <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://www.instagram.com/deandra_bologoda/?hl=en" className="text-white hover:text-gray-900 dark:hover:text-white ms-5">
              <svg className="w-[22px] h-[22px] text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 </svg>24">
                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
              </svg>
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://wa.me/94743074463"
              className="text-white hover:text-gray-900 dark:hover:text-white ms-5"
              target="_blank"
              rel="noopener noreferrer">
              <svg className="w-[22px] h-[22px] text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 </svg>24">
                <path fill="currentColor" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clipRule="evenodd" />
                <path fill="currentColor" d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z" />
              </svg>
              <span className="sr-only">Whats App</span>
            </a>
          </div>
        </div>
      </div>
    </footer>


  )
}
