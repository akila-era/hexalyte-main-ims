// import React, { useState } from 'react';

// const StockTransferAddModal = ({
//     products,
//     warehouses,
//     createTransfer,
//     setOpenModal
// }) => {
//     const [transferData, setTransferData] = useState({
//         productId: '',
//         sourceWarehouseId: '',
//         targetWarehouseId: '',
//         quantity: '',
//         notes: ''
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTransferData(prev => ({ ...prev, [name]: value }));
        
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: null }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
        
//         if (!transferData.productId) {
//             newErrors.productId = "Please select a product";
//         }
        
//         if (!transferData.sourceWarehouseId) {
//             newErrors.sourceWarehouseId = "Please select a source warehouse";
//         }
        
//         if (!transferData.targetWarehouseId) {
//             newErrors.targetWarehouseId = "Please select a target warehouse";
//         }
        
//         if (transferData.sourceWarehouseId && 
//             transferData.sourceWarehouseId === transferData.targetWarehouseId) {
//             newErrors.targetWarehouseId = "Source and target warehouses must be different";
//         }
        
//         if (!transferData.quantity || parseInt(transferData.quantity) <= 0) {
//             newErrors.quantity = "Please enter a valid quantity (greater than 0)";
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             createTransfer(transferData);
//         }
        
//     };
    

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
//                 <h3 className="text-lg font-semibold mb-4">New Stock Transfer</h3>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Product
//                         </label>
//                         <select
//                             name="productId"
//                             className={`w-full border rounded-md px-3 py-2 ${
//                                 errors.productId ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                             value={transferData.productId}
//                             onChange={handleChange}
//                         >
//                             <option value="">Select product...</option>
//                             {products.map((p) => (
//                                 <option key={p.ProductID} value={p.ProductID}>
//                                     {p.Name} ({p.SKU})
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.productId && (
//                             <p className="text-red-500 text-sm mt-1">{errors.productId}</p>
//                         )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Source Warehouse
//                             </label>
//                             <select
//                                 name="sourceWarehouseId"
//                                 className={`w-full border rounded-md px-3 py-2 ${
//                                     errors.sourceWarehouseId ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                                 value={transferData.sourceWarehouseId}
//                                 onChange={handleChange}
//                             >
//                                 <option value="">Select warehouse...</option>
//                                 {warehouses.map((w) => (
//                                     <option key={w.LocationID} value={w.LocationID}>
//                                         {w.WarehouseName}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.sourceWarehouseId && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.sourceWarehouseId}</p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Target Warehouse
//                             </label>
//                             <select
//                                 name="targetWarehouseId"
//                                 className={`w-full border rounded-md px-3 py-2 ${
//                                     errors.targetWarehouseId ? 'border-red-500' : 'border-gray-300'
//                                 }`}
//                                 value={transferData.targetWarehouseId}
//                                 onChange={handleChange}
//                             >
//                                 <option value="">Select warehouse...</option>
//                                 {warehouses.map((w) => (
//                                     <option key={w.LocationID} value={w.LocationID}>
//                                         {w.WarehouseName}
//                                     </option>
//                                 ))}
//                             </select>
//                             {errors.targetWarehouseId && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.targetWarehouseId}</p>
//                             )}
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Quantity
//                         </label>
//                         <input
//                             type="number"
//                             name="quantity"
//                             className={`w-full border rounded-md px-3 py-2 ${
//                                 errors.quantity ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                             placeholder="Enter quantity"
//                             value={transferData.quantity}
//                             onChange={handleChange}
//                             min="1"
//                         />
//                         {errors.quantity && (
//                             <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
//                         )}
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Notes (Optional)
//                         </label>
//                         <textarea
//                             name="notes"
//                             className="w-full border border-gray-300 rounded-md px-3 py-2"
//                             rows="3"
//                             placeholder="Transfer notes..."
//                             value={transferData.notes}
//                             onChange={handleChange}
//                         ></textarea>
//                     </div>

//                     <div className="flex justify-end space-x-3 mt-6">
//                         <button
//                             type="button"
//                             onClick={() => setOpenModal(false)}
//                             className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                         >
//                             Add Transfer
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default StockTransferAddModal;


import React, { useState } from 'react';
import { motion } from "framer-motion"; // You may need to install this package

const StockTransferAddModal = ({
    products,
    warehouses,
    createTransfer,
    setOpenModal
}) => {
    const [transferData, setTransferData] = useState({
        productId: '',
        sourceWarehouseId: '',
        targetWarehouseId: '',
        quantity: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransferData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!transferData.productId) {
            newErrors.productId = "Please select a product";
        }
        
        if (!transferData.sourceWarehouseId) {
            newErrors.sourceWarehouseId = "Please select a source warehouse";
        }
        
        if (!transferData.targetWarehouseId) {
            newErrors.targetWarehouseId = "Please select a target warehouse";
        }
        
        if (transferData.sourceWarehouseId && 
            transferData.sourceWarehouseId === transferData.targetWarehouseId) {
            newErrors.targetWarehouseId = "Source and target warehouses must be different";
        }
        
        if (!transferData.quantity || parseInt(transferData.quantity) <= 0) {
            newErrors.quantity = "Please enter a valid quantity (greater than 0)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            createTransfer(transferData);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-11/12 md:w-3/5 my-6 mx-auto max-w-2xl"
                >
                    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                New Stock Transfer
                            </h3>
                            <button
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
                                onClick={() => setOpenModal(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="p-6">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Product Selection Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        Product Information
                                    </h4>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="productId"
                                            className={`block w-full px-3 py-2.5 text-base border ${errors.productId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                            value={transferData.productId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select product</option>
                                            {products.map((p) => (
                                                <option key={p.ProductID} value={p.ProductID}>
                                                    {p.Name} 
                                                    {/* ({p.SKU}) */}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.productId && (
                                            <div className="text-red-500 text-sm mt-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                {errors.productId}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Warehouse Transfer Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Warehouse Transfer
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Source Warehouse <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="sourceWarehouseId"
                                                className={`block w-full px-3 py-2.5 text-base border ${errors.sourceWarehouseId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                value={transferData.sourceWarehouseId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select warehouse</option>
                                                {warehouses.map((w) => (
                                                    <option key={w.LocationID} value={w.LocationID}>
                                                        {w.WarehouseName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.sourceWarehouseId && (
                                                <div className="text-red-500 text-sm mt-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    {errors.sourceWarehouseId}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Target Warehouse <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                name="targetWarehouseId"
                                                className={`block w-full px-3 py-2.5 text-base border ${errors.targetWarehouseId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                value={transferData.targetWarehouseId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select warehouse</option>
                                                {warehouses.map((w) => (
                                                    <option key={w.LocationID} value={w.LocationID}>
                                                        {w.WarehouseName}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.targetWarehouseId && (
                                                <div className="text-red-500 text-sm mt-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    {errors.targetWarehouseId}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Transfer Details Section */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Transfer Details
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                className={`block w-full px-3 py-2.5 text-base border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200`}
                                                placeholder="Enter quantity"
                                                value={transferData.quantity}
                                                onChange={handleChange}
                                                min="1"
                                            />
                                            {errors.quantity && (
                                                <div className="text-red-500 text-sm mt-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    {errors.quantity}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Notes (Optional)
                                            </label>
                                            <textarea
                                                name="notes"
                                                className="block w-full px-3 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200"
                                                rows="4"
                                                placeholder="Transfer notes..."
                                                value={transferData.notes}
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Footer */}
                                <div className="bg-gray-50 pt-4 pb-3 -mx-6 -mb-6 px-6 flex items-center justify-end space-x-3 border-t">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                                        onClick={() => setOpenModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                        Add Transfer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default StockTransferAddModal;