```
<form className="space-y-4 " >
                                <div className="w-full flex flex-col md:flex-row gap-2">

                                    {/* <p>
                                        {
                                            JSON.stringify(orderInfo)
                                        }
                                    </p> */}

                                    <div className="w-full">
                                        <label htmlFor="Name" className=" block my-2">
                                            Order ID :
                                            {orderInfo.OrderID}
                                        </label>

                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="ContactName" className=" block my-2">
                                            Order Date :
                                            {orderInfo.OrderDate.slice(0, 10)}
                                        </label>

                                    </div>
                                </div>

                                <div className="w-full flex flex-col md:flex-row gap-2">
                                    <div className="w-full">
                                        <label htmlFor="Name" className=" block my-2">
                                            Total Amount :
                                            {Number(orderInfo.TotalAmount).toLocaleString()} LKR
                                        </label>

                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="ContactName" className=" block my-2">
                                            Status : &nbsp;
                                            {orderInfo.Status}
                                        </label>

                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold mb-5">Sales Items</h2>

                                {/* Order items table */}
                                <div className="mt-6">
                                    <table className="table-auto w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2">Product ID</th>
                                                <th className="p-2">Product Name</th>
                                                <th className="p-2 text-right">Quantity</th>
                                                <th className="p-2 text-right">Unit Price</th>
                                                <th className="p-2 text-right">Total Price</th>
                                                <th className="p-2 text-right"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {salesOrderItems.map((detail, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b">
                                                    <td className="p-2">
                                                        {detail.ProductId}
                                                    </td>
                                                    <td className="p-2">
                                                        {products.find((p) => p.ProductID === detail.ProductId)?.Name}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {detail.Quantity}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {Number(detail.UnitPrice).toLocaleString()}
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {Number(detail.Quantity * detail.UnitPrice).toLocaleString()}
                                                    </td>
                                                    <td className="p-2 text-right">

                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* product infoprmation
                                <div className="mt-5">

                                    <h2 className="text-xl font-semibold mb-5">Product Information</h2>

                                    <div className="w-full flex flex-col md:flex-row gap-2">
                                        <div className="w-full">
                                            <label htmlFor="Name" className=" block my-2">
                                                Product Name : {productData.Name}
                                            </label>

                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="ContactName" className=" block my-2">
                                                Description : {productData.Description}
                                            </label>

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col md:flex-row gap-2">
                                        <div className="w-full">
                                            <label htmlFor="Name" className=" block my-2">
                                                Unit Price : {productData.UnitPrice}
                                            </label>

                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="ContactName" className=" block my-2">
                                                Quentity : {productData.QuantityInStock}
                                            </label>

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col md:flex-row gap-2">
                                        <div className="w-full">
                                            <label htmlFor="Name" className="block my-2">
                                                Supplier ID : {productData.SupplierID}
                                            </label>

                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="ContactName" className=" block my-2">
                                                Category ID : {productData.CategoryID}
                                            </label>

                                        </div>
                                    </div>

                                </div>


                                {/* location info  */}
                                {/* <div className="mt-5">

                                    <h2 className="text-xl font-semibold mb-5">Location Information</h2>

                                    <div className="w-full flex flex-col md:flex-row gap-2">
                                        <div className="w-full">
                                            <label htmlFor="Name" className=" block my-2">
                                                Location Name : {loactionData.WarehouseName}
                                            </label>

                                        </div>
                                        <div className="w-full">
                                            <label htmlFor="ContactName" className=" block my-2">
                                                Address : {loactionData.Address}
                                            </label>

                                        </div>
                                    </div>


                                </div> */}

                                <SalesInvoiceIframe orderInfo={orderInfo} salesItems={salesOrderItems} />

                                {/* <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setOpenSalesInvoiceModal(null)}

                                    >
                                        Close
                                    </button>

                                </div> */}

                                <div className="flex items-center justify-end p-2 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setOpenSalesInvoiceModal(null)}

                                    >
                                        Close
                                    </button>

                                </div>
                            </form>
```