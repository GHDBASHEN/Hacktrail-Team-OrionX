import React, { useEffect, useCallback, useState } from "react";
import { Logout } from "../../components/Logout";
import ServicesChargeCalc from "../../pages/superAdmin/ServicesChargeCalc";
import Deductions from "../../pages/superAdmin/Deductions";
import Pay from "../../pages/superAdmin/Pay";
import Help from '../help/Help';
//import PaymentHistory from "./pages/superAdmin/PaymentHistory";
import PaymentHistory from "../../pages/superAdmin/PaymentHistory";
import PayHelpData from '../help/payHelpData.json'

const PayrollManagementSAN = ({ setRenderContent }) => {
  const [clickedItem, setClickedItem] = useState(null);

  const handleRenderContent = useCallback((display) => {
    setClickedItem(display);
    switch (display) {
      case "ServicesChargeCalculation":
        setRenderContent(() => () => <ServicesChargeCalc />);
        break;
      default:
        setRenderContent(() => () => <ServicesChargeCalc />);
        setClickedItem("ServicesChargeCalculation");
    }
  }, [setRenderContent]);

  const handleRenderContentdeduction = useCallback(
    (display) => {
      setClickedItem(display);
      switch (display) {
        case "deductionManagement":
          setRenderContent(() => () => <Deductions />);
          break;
        default:
          setRenderContent(() => () => <p>Page </p>);
      }
    },
    [setRenderContent]
  );

  const handleRenderContentPay = useCallback(
    (display) => {
      setClickedItem(display);
      switch (display) {
        case "PayManagement":
          setRenderContent(() => () => <Pay />);
          break;
        case "help":
          setRenderContent(() => () => <Help tz={PayHelpData} />);
          break;
        default:
          setRenderContent(() => () => <p>Page </p>);
      }
    },
    [setRenderContent]
  );

  const handleRenderContentHistory = useCallback(
    (display) => {
      setClickedItem(display);
      switch (display) {
        case "HistoryManagement":
          setRenderContent(() => () => <PaymentHistory />);
          break;
        default:
          setRenderContent(() => () => <p>Page </p>);
      }
    },
    [setRenderContent]
  );

  useEffect(() => {
    handleRenderContent("null");
  }, [handleRenderContent]);

  return (
    <div className="">
      <ul className="flex flex-col py-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleRenderContent("ServicesChargeCalculation")}
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full ${
                clickedItem === "ServicesChargeCalculation"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                  : ""
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Service Charge Management</span>
            </button>
          </li>

          <li>
            <button
              onClick={() =>
                handleRenderContentdeduction("deductionManagement")
              }
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full ${
                clickedItem === "deductionManagement"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                  : ""
              }`}
            >
              <svg
                className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
              <span className="ml-3">Salary Deduction Records </span>
            </button>
          </li>

          <li>
            <button
              onClick={() => handleRenderContentPay("PayManagement")}
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full ${
                clickedItem === "PayManagement"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                  : ""
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 12v6h8v-6H8Z"
                />
              </svg>
              <span className="ml-3">Employee Payment Processing</span>
            </button>
          </li>

          <li>
            
            <button
              onClick={() => handleRenderContentHistory("HistoryManagement")}
              className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full ${
                clickedItem === "HistoryManagement"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100"
                  : ""
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"
                />
              </svg>
              <span className="ml-3">Employee Payment History</span>
            </button>
          </li>

          <li>
            <button onClick={() => handleRenderContentPay("help")} className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full">
              <svg
                aria-hidden="true"
                className="flex-shrink-0 w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 108 8 8 8 0 00-8-8zm1 12H9v-2h2zm0-4H9V6h2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">Help</span>
            </button>
          </li>
          <li>
            <button className="flex items-center p-2 text-base font-normal text-red-600 rounded-lg hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800 group w-full">
              <svg
                className="flex-shrink-0 w-6 h-6 text-red-500 transition duration-75 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm13.707 5.293a1 1 0 00-1.414-1.414L13 10.172l-1.293-1.293a1 1 0 10-1.414 1.414L11.586 12l-1.293 1.293a1 1 0 101.414 1.414L13 13.828l1.293 1.293a1 1 0 001.414-1.414L14.414 12l1.293-1.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="ml-3">
                <Logout />
              </span>
            </button>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default PayrollManagementSAN;
