import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';

function AddProduct() {
    const [formData, setFormData] = useState({
        Name: '',
        CategoryID: '',
        BuyingPrice: '',
        SellingPrice: '',
        Description: '',
        QuantityInStock: 0,
        SupplierID: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categories, setCategories] = useState([])
    const [suppliers, setSuppliers] = useState([])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const handleSubmit = async () => {

        if (formData.Name.trim() === "") {
            setErrors((e) => ({ ...e, Name: "Name cannot be empty" }))
        } else if (formData.CategoryID === "0") {
            setErrors((e) => ({ ...e, CategoryID: "Select a category" }))
        } else if (formData.SupplierID === "0") {
            setErrors((e) => ({ ...e, SupplierID: "Select a supplier" }))
        } else if (formData.Description.trim() === "") {
            setErrors((e) => ({ ...e, Description: "Description cannot be empty" }))
        } else if (formData.BuyingPrice === "" || Number(formData.BuyingPrice) <= 0) {
            setErrors((e) => ({ ...e, BuyingPrice: "Enter a Buying Price" }))
        } else if (formData.SellingPrice === "" || Number(formData.SellingPrice) <= 0) {
            setErrors((e) => ({ ...e, SellingPrice: "Enter a Selling Price" }))
        } else {
            // console.log('Product Data:', formData);

            try {

                const api = createAxiosInstance()
                const addProductRes = await api.post('product', formData)

                console.log(addProductRes)

            } catch (error) {
                console.log(error)
            }

        }

        // Handle form submission here - send to your backend API
    };

    async function loadCategories() {

        try {

            const api = createAxiosInstance();
            const categoriesRes = await api.get('category')

            if (categoriesRes.status === 200) {
                setCategories(() => categoriesRes.data.allCategory)
            }

        } catch (error) {
            console.log(error)
        }

    }

    async function loadSuppliers() {

        try {

            const api = createAxiosInstance()
            const suppliersRes = await api.get('supplier')

            if (suppliersRes.status === 200) {
                setSuppliers(() => suppliersRes.data.suppliers)
            }

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        loadCategories()
        loadSuppliers()
    }, [])

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-gray-600 text-lg">Create and configure your product details</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Product Information */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-8">Product Information</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="Name"
                                            value={formData.Name}
                                            onChange={handleInputChange}
                                            className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.Name ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                }`}
                                            placeholder="Enter product name"
                                            required
                                        />
                                        {errors.Name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.Name}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Category *
                                            </label>
                                            <select
                                                name="CategoryID"
                                                value={formData.CategoryID}
                                                onChange={handleInputChange}
                                                className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.CategoryID ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                    }`}
                                                required
                                            >
                                                <option value="">Select category</option>
                                                {categories.map(category => (
                                                    <option key={category.CategoryID} value={category.CategoryID}>
                                                        {category.Name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.CategoryID && (
                                                <p className="mt-2 text-sm text-red-600">{errors.CategoryID}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Supplier *
                                            </label>
                                            <select
                                                name="SupplierID"
                                                value={formData.SupplierID}
                                                onChange={handleInputChange}
                                                className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.SupplierID ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                    }`}
                                                required
                                            >
                                                <option value="">Select supplier</option>
                                                {suppliers.map(supplier => (
                                                    <option key={supplier.SupplierID} value={supplier.SupplierID}>
                                                        {supplier.Name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.SupplierID && (
                                                <p className="mt-2 text-sm text-red-600">{errors.SupplierID}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Description
                                        </label>
                                        <textarea
                                            name="Description"
                                            value={formData.Description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-lg ${errors.Description ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                }`}
                                            placeholder="Enter product description"
                                        />
                                        {errors.Description && (
                                            <p className="mt-2 text-sm text-red-600">{errors.Description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Buying Price *
                                            </label>
                                            <div className="relative">
                                                {/* <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span> */}
                                                <input
                                                    type="number"
                                                    name="BuyingPrice"
                                                    value={formData.BuyingPrice}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.BuyingPrice ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                        }`}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            {errors.BuyingPrice && (
                                                <p className="mt-2 text-sm text-red-600">{errors.BuyingPrice}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Selling Price *
                                            </label>
                                            <div className="relative">
                                                {/* <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span> */}
                                                <input
                                                    type="number"
                                                    name="SellingPrice"
                                                    value={formData.SellingPrice}
                                                    onChange={handleInputChange}
                                                    className={`w-full pl-10 pr-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.SellingPrice ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                        }`}
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            {errors.SellingPrice && (
                                                <p className="mt-2 text-sm text-red-600">{errors.SellingPrice}</p>
                                            )}
                                        </div>

                                        {/* <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Quantity in Stock *
                                            </label>
                                            <input
                                                type="number"
                                                name="QuantityInStock"
                                                value={formData.QuantityInStock}
                                                onChange={handleInputChange}
                                                className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.QuantityInStock ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                                    }`}
                                                placeholder="0"
                                                min="0"
                                                required
                                            />
                                            {errors.QuantityInStock && (
                                                <p className="mt-2 text-sm text-red-600">{errors.QuantityInStock}</p>
                                            )}
                                        </div> */}
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">


                            {/* Actions */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`w-full flex items-center justify-center px-6 py-4 rounded-xl transition-colors font-semibold text-lg ${isSubmitting
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        <Save className="w-5 h-5 mr-3" />
                                        {isSubmitting ? 'Saving...' : 'Save Product'}
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full px-6 py-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Product Summary */}
                            <div className="bg-green-50 rounded-2xl border border-green-100 p-8">
                                <h3 className="text-lg font-semibold text-green-900 mb-4">💰 Pricing Summary</h3>
                                {formData.BuyingPrice && formData.SellingPrice && (
                                    <div className="text-sm text-green-800 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Buying Price:</span>
                                            <span>${formData.BuyingPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Selling Price:</span>
                                            <span>${formData.SellingPrice}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold border-t pt-2">
                                            <span>Profit Margin:</span>
                                            <span>${(parseFloat(formData.SellingPrice || 0) - parseFloat(formData.BuyingPrice || 0)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-8">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Product Tips</h3>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li>• Use high-quality images for better visibility</li>
                                    <li>• Write detailed descriptions to increase sales</li>
                                    <li>• Set competitive pricing based on market research</li>
                                    <li>• Keep accurate stock quantities for inventory tracking</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;