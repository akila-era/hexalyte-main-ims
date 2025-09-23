import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import checkToken from "api/checkToken";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";

// components

export default function CardPageVisits() {

  const history = useHistory()
  // const TOKEN = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem('user')), c => c.charCodeAt(0)))).tokens.access.token

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [purchaseOrders, setPurchaseOrders] = useState([])

  async function fetchPurchasOrders() {

    try {
      // const res = await axios.get(`${BASE_URL}purchaseorders`, {headers:{ Authorization: `Bearer ${TOKEN}` }})
      // console.log(res)

      const api = createAxiosInstance()
      const res = await api.get('purchaseorders')

      if (res.status === 200) {
        setPurchaseOrders(() => res.data.purchaseOrders)
      }
    } catch (error) {
      // "No Purchase Orders found"
      if (error.status === 404 && error.response.data.message === "No Purchase Orders found") {
        console.log("No Purchase Orders found");
      } else {
        console.log(error)
      }
    }

  }

  useEffect(() => {

    // if (checkToken()) {
    //   fetchPurchasOrders()
    // } else {
    //   history.push('/auth/login')
    //   return
    // }

  }, [])

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Purchase Orders
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Link
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                to="purchase-orders"
              >
                See all
              </Link>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Order ID
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Order Date
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Total Amount
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>

              {
                purchaseOrders.map((purchaseOrder, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {purchaseOrder.OrderID}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {new Date(purchaseOrder.OrderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {purchaseOrder.TotalAmount.toLocaleString()} LKR
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {purchaseOrder.Status}
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
