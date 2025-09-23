// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion"; // Import for animation effects
// import { createAxiosInstance } from "api/axiosInstance";
//
// // const BASE_URL = process.env.REACT_APP_BASE_URL;
//
// function ProductAddModal({ setOpenModal, addProduct }) {
//   const [categories, setCategories] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     Name: "",
//     Description: "",
//     BuyingPrice: "",
//     SellingPrice: "",
//     QuantityInStock: 0,
//     SupplierID: 0,
//     CategoryID: 0
//   });
//   const [errors, setErrors] = useState({});
//
//   const handleChange = (e) => {
//     setNewProduct((p) => ({ ...p, [e.target.name]: e.target.value }));
//     // Clear error when field is modified
//     if (errors[e.target.name]) {
//       setErrors(prev => ({ ...prev, [e.target.name]: null }));
//     }
//   };
//
//   const validateForm = () => {
//     const newErrors = {};
//
//     if (!newProduct.Name.trim()) {
//       newErrors.Name = "Product name is required";
//     }
//
//     if (!newProduct.Description.trim()) {
//       newErrors.Description = "Description is required";
//     }
//
//     if (!newProduct.BuyingPrice || parseFloat(newProduct.BuyingPrice) <= 0) {
//       newErrors.BuyingPrice = "Valid buying price is required";
//     }
//
//     if (!newProduct.SellingPrice || parseFloat(newProduct.SellingPrice) <= 0) {
//       newErrors.SellingPrice = "Valid selling price is required";
//     }
//
//     if (newProduct.SupplierID === 0) {
//       newErrors.SupplierID = "Please select a supplier";
//     }
//
//     if (newProduct.CategoryID === 0) {
//       newErrors.CategoryID = "Please select a category";
//     }
//
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//
//   const handleSubmit = () => {
//     if (validateForm()) {
//       addProduct(newProduct);
//     }
//   };
//
//   async function fetchCategories() {
//     try {
//       const api = createAxiosInstance();
//       const categoryRes = await api.get(`category`);
//       // const categoryRes = await axios.get(`${BASE_URL}category`, { withCredentials: true });
//       if (categoryRes.status === 200) {
//         setCategories(() => categoryRes.data.allCategory.filter(category => category.isActive !== false));
//       }
//     } catch (error) {
//
//       if (error.status === 404 && error.response.data.message === "No Categories Found") {
//         console.log("No Categories Found");
//       } else {
//         console.log(error)
//       }
//
//     }
//   }
//
//   async function fetchSuppliers() {
//     try {
//       const api = createAxiosInstance();
//       const supplierRs = await api.get(`supplier`)
//       // const supplierRs = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
//       if (supplierRs.status === 200) {
//         setSuppliers(() => supplierRs.data.suppliers.filter(supplier => supplier.isActive !== false));
//       }
//     } catch (error) {
//       if (error.status === 404 && error.response.data.message === "no supplier found") {
//         console.log("no supplier found");
//       } else {
//         console.log(error)
//       }
//     }
//   }
//
//   useEffect(() => {
//     fetchCategories();
//     fetchSuppliers();
//   }, []);
//
//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-6xl"
//         >
//           <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-2xl font-bold text-white flex items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                 </svg>
//                 Add New Product
//               </h3>
//               <button
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
//                 onClick={() => setOpenModal(false)}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//
//             {/* Main Content */}
//             <div className="p-6">
//               {/* Product Info Section */}
//               <div className="mb-8">
//                 <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   Product Information
//                 </h4>
//
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                     <input
//                       type="text"
//                       name="Name"
//                       value={newProduct.Name}
//                       onChange={handleChange}
//                       className={`block w-full px-3 py-2.5 text-base border ${errors.Name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                       placeholder="Enter product name"
//                     />
//                     {errors.Name && (
//                       <div className="text-red-500 text-xs mt-1">{errors.Name}</div>
//                     )}
//                   </div>
//
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
//                     <textarea
//                       name="Description"
//                       value={newProduct.Description}
//                       onChange={handleChange}
//                       rows="3"
//                       className={`block w-full px-3 py-2.5 text-base border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                       placeholder="Enter product description"
//                     ></textarea>
//                     {errors.Description && (
//                       <div className="text-red-500 text-xs mt-1">{errors.Description}</div>
//                     )}
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Buying Price (LKR)</label>
//                       <input
//                         type="number"
//                         name="BuyingPrice"
//                         value={newProduct.BuyingPrice}
//                         onChange={handleChange}
//                         className={`block w-full px-3 py-2.5 text-base border ${errors.BuyingPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                         placeholder="Enter buying price"
//                       />
//                       {errors.BuyingPrice && (
//                         <div className="text-red-500 text-xs mt-1">{errors.BuyingPrice}</div>
//                       )}
//                     </div>
//
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (LKR)</label>
//                       <input
//                         type="number"
//                         name="SellingPrice"
//                         value={newProduct.SellingPrice}
//                         onChange={handleChange}
//                         className={`block w-full px-3 py-2.5 text-base border ${errors.SellingPrice ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                         placeholder="Enter selling price"
//                       />
//                       {errors.SellingPrice && (
//                         <div className="text-red-500 text-xs mt-1">{errors.SellingPrice}</div>
//                       )}
//                     </div>
//                   </div>
//
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
//                       <div className="relative">
//                         <select
//                           name="SupplierID"
//                           value={newProduct.SupplierID}
//                           onChange={handleChange}
//                           className={`block w-full pl-3 pr-10 py-2.5 text-base border ${errors.SupplierID ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                         >
//                           <option value="0">Select Supplier</option>
//                           {suppliers.map((supplier) => (
//                             <option key={supplier.SupplierID} value={supplier.SupplierID}>
//                               {supplier.Name}
//                             </option>
//                           ))}
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                           {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                           </svg> */}
//                         </div>
//                       </div>
//                       {errors.SupplierID && (
//                         <div className="text-red-500 text-xs mt-1">{errors.SupplierID}</div>
//                       )}
//                     </div>
//
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                       <div className="relative">
//                         <select
//                           name="CategoryID"
//                           value={newProduct.CategoryID}
//                           onChange={handleChange}
//                           className={`block w-full pl-3 pr-10 py-2.5 text-base border ${errors.CategoryID ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg transition duration-200 bg-white`}
//                         >
//                           <option value="0">Select Category</option>
//                           {categories.map((category) => (
//                             <option key={category.CategoryID} value={category.CategoryID}>
//                               {category.Name}
//                             </option>
//                           ))}
//                         </select>
//                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                           {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
//                           </svg> */}
//                         </div>
//                       </div>
//                       {errors.CategoryID && (
//                         <div className="text-red-500 text-xs mt-1">{errors.CategoryID}</div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//
//             {/* Footer */}
//             <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
//               <button
//                 type="button"
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
//                 onClick={() => setOpenModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
//                 onClick={handleSubmit}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                 </svg>
//                 Add Product
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </>
//   );
// }
//
// export default ProductAddModal;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import for animation effects
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ProductAddModal({ setOpenModal, addProduct }) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    BuyingPrice: "",
    SellingPrice: "",
    QuantityInStock: 0,
    SupplierID: 0,
    CategoryID: 0
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewProduct((p) => ({ ...p, [e.target.name]: e.target.value }));
    // Clear error when field is modified
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!newProduct.Name.trim()) {
      newErrors.Name = "Product name is required";
    }

    if (!newProduct.Description.trim()) {
      newErrors.Description = "Description is required";
    }

    if (!newProduct.BuyingPrice || parseFloat(newProduct.BuyingPrice) <= 0) {
      newErrors.BuyingPrice = "Valid buying price is required";
    }

    if (!newProduct.SellingPrice || parseFloat(newProduct.SellingPrice) <= 0) {
      newErrors.SellingPrice = "Valid selling price is required";
    }

    if (newProduct.SupplierID === 0) {
      newErrors.SupplierID = "Please select a supplier";
    }

    if (newProduct.CategoryID === 0) {
      newErrors.CategoryID = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addProduct(newProduct);
    }
  };

  async function fetchCategories() {
    try {
      const api = createAxiosInstance();
      const categoryRes = await api.get(`category`);
      // const categoryRes = await axios.get(`${BASE_URL}category`, { withCredentials: true });
      if (categoryRes.status === 200) {
        setCategories(() => categoryRes.data.allCategory.filter(category => category.isActive !== false));
      }
    } catch (error) {

      if (error.status === 404 && error.response.data.message === "No Categories Found") {
        console.log("No Categories Found");
      } else {
        console.log(error)
      }

    }
  }

  async function fetchSuppliers() {
    try {
      const api = createAxiosInstance();
      const supplierRs = await api.get(`supplier`)
      // const supplierRs = await axios.get(`${BASE_URL}supplier`, { withCredentials: true });
      if (supplierRs.status === 200) {
        setSuppliers(() => supplierRs.data.suppliers.filter(supplier => supplier.isActive !== false));
      }
    } catch (error) {
      if (error.status === 404 && error.response.data.message === "no supplier found") {
        console.log("no supplier found");
      } else {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-11/12 lg:w-4/5 my-6 mx-auto max-w-4xl"
        >
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Add New Product</h3>
                  <p className="text-slate-300 text-sm mt-1">Create a new product in your inventory</p>
                </div>
              </div>
              <button
                className="text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg p-2 transition-all duration-200"
                onClick={() => setOpenModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Content */}
            <div className="p-8 bg-slate-50/30">
              {/* Basic Information Card */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-slate-800">Basic Information</h4>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="Name"
                      value={newProduct.Name}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 text-sm border ${errors.Name ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white`}
                      placeholder="Enter product name"
                    />
                    {errors.Name && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.Name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Product Description</label>
                    <textarea
                      name="Description"
                      value={newProduct.Description}
                      onChange={handleChange}
                      rows="3"
                      className={`block w-full px-4 py-3 text-sm border ${errors.Description ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white resize-none`}
                      placeholder="Enter detailed product description"
                    ></textarea>
                    {errors.Description && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.Description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Information Card */}
              <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-slate-800">Pricing Information</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Buying Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">LKR</span>
                      <input
                        type="number"
                        name="BuyingPrice"
                        value={newProduct.BuyingPrice}
                        onChange={handleChange}
                        className={`block w-full pl-12 pr-4 py-3 text-sm border ${errors.BuyingPrice ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.BuyingPrice && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.BuyingPrice}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Selling Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">LKR</span>
                      <input
                        type="number"
                        name="SellingPrice"
                        value={newProduct.SellingPrice}
                        onChange={handleChange}
                        className={`block w-full pl-12 pr-4 py-3 text-sm border ${errors.SellingPrice ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.SellingPrice && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.SellingPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Category & Supplier Card */}
              <div className="bg-white rounded-xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-slate-800">Category & Supplier</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Supplier</label>
                    <div className="relative">
                      <select
                        name="SupplierID"
                        value={newProduct.SupplierID}
                        onChange={handleChange}
                        className={`block w-full pl-4 pr-10 py-3 text-sm border ${errors.SupplierID ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white appearance-none`}
                      >
                        <option value="0" className="text-slate-500">Select Supplier</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.SupplierID} value={supplier.SupplierID} className="text-slate-900">
                            {supplier.Name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.SupplierID && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.SupplierID}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <div className="relative">
                      <select
                        name="CategoryID"
                        value={newProduct.CategoryID}
                        onChange={handleChange}
                        className={`block w-full pl-4 pr-10 py-3 text-sm border ${errors.CategoryID ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition duration-200 bg-white appearance-none`}
                      >
                        <option value="0" className="text-slate-500">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.CategoryID} value={category.CategoryID} className="text-slate-900">
                            {category.Name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.CategoryID && (
                      <div className="text-red-500 text-xs mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.CategoryID}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-6 flex items-center justify-between border-t border-slate-200">
              <div className="text-sm text-slate-600">
                All fields marked with * are required
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
                  onClick={handleSubmit}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ProductAddModal;