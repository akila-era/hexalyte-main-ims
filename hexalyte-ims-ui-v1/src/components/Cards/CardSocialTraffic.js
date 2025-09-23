import axios from "axios";
import React, { useEffect, useState } from "react";
import checkToken from "api/checkToken";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { createAxiosInstance } from "api/axiosInstance";

// components

export default function CardSocialTraffic() {

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [salesOrderDetails, setSalesOrderDetails] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const history = useHistory()
  // const TOKEN = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(localStorage.getItem('user')), c => c.charCodeAt(0)))).tokens.access.token

  async function fetchSalesOrderDetails() {

    try {

      // const res = await axios.get(`${BASE_URL}salesorderdetails`, {headers:{ Authorization: `Bearer ${TOKEN}` }})

      const api = createAxiosInstance()
      const res = await api.get('salesorderdetails')

      if (res.status === 200) {
        setSalesOrderDetails(() => res.data.data.data);
      }

    } catch (error) {
      console.log(error)
    }

  }

  async function fetchProducts() {
    try {
      // const res = await axios.get(`${BASE_URL}product`, {headers:{ Authorization: `Bearer ${TOKEN}` }})

      const api = createAxiosInstance()
      const res = await api.get('product')

      if (res.status === 200) {
        setProducts(() => res.data.allProducts)
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "No Products Found") {
        console.log("No Products Found");
      } else {
        console.log(error)
      }
    }
  }

  // useEffect(() => {

  //   if (checkToken()) {
  //     fetchSalesOrderDetails()
  //     fetchProducts()
  //   } else {
  //     history.push('/auth/login')
  //     return
  //   }

  // }, [])

  useEffect(() => {

    const productCount = {}

    salesOrderDetails.forEach(order => {

      const productId = order.ProductId;

      productCount[productId] = (productCount[productId] || 0) + 1;

    })

    const topProductIds = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([productId, count]) => ({ productId: Number(productId), count }));

    setTopProducts(() => [...topProductIds])

  }, [salesOrderDetails])

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Top Selling
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              {/* <button
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                See all
              </button> */}
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Product ID
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Product Name
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Items Sold
                </th>
              </tr>
            </thead>
            <tbody>

              {
                topProducts.map((topProduct, index) => (
                  <tr key={index}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {topProduct.productId}
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {
                        products.find((product) => product.ProductID.toString() === topProduct.productId.toString())?.Name
                      }
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {topProduct.count} items
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {/* <div className="flex items-center">
                    <span className="mr-2">30%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-orange-200">
                        <div
                          style={{ width: "30%" }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                        ></div>
                      </div>
                    </div>
                  </div> */}
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
