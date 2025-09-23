import React, { useEffect, useState } from 'react';
import { Search, Package, MapPin, Plus } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';

function AddToInventory() {
    const [formData, setFormData] = useState({
        selectedProduct: null,
        warehouseID: '',
        quantity: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length > 0);

        // Clear product selection if search is cleared
        if (value === '') {
            setFormData(prev => ({ ...prev, selectedProduct: null }));
        }

        // Clear error when user starts typing
        if (errors.selectedProduct) {
            setErrors(prev => ({ ...prev, selectedProduct: '' }));
        }
    };

    const handleProductSelect = (product) => {
        setFormData(prev => ({ ...prev, selectedProduct: product }));
        setSearchTerm(product.Name);
        setShowSuggestions(false);

        // Clear error when product is selected
        if (errors.selectedProduct) {
            setErrors(prev => ({ ...prev, selectedProduct: '' }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);

        // Validation
        const newErrors = {};

        if (!formData.selectedProduct) {
            newErrors.selectedProduct = 'Please select a product';
        }

        if (!formData.warehouseID) {
            newErrors.warehouseID = 'Please select a warehouse';
        }

        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (parseInt(formData.quantity) <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        } else if (parseInt(formData.quantity) > 10000) {
            newErrors.quantity = 'Quantity cannot exceed 10,000';
        }

        // Check if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // Clear any existing errors
        setErrors({});

        // Prepare data for submission
        const submissionData = {
            ProductID: formData.selectedProduct.ProductID,
            ProductName: formData.selectedProduct.Name,
            WarehouseID: parseInt(formData.warehouseID),
            Quantity: parseInt(formData.quantity),
            Action: 'ADD_TO_INVENTORY'
        };

        console.log('Add to Inventory Data:', submissionData);
        // Handle form submission here - send to your backend API

        addProductsToInventory(submissionData)

        // Reset form after successful submission
        setFormData({ selectedProduct: null, warehouseID: '', quantity: '' });
        setSearchTerm('');
        setIsSubmitting(false);
    };

    async function addProductsToInventory(data){

        try {
            
            const api = createAxiosInstance()
            const addProductsRes = await api.post('subproducts', data)

            console.log(addProductsRes)

        } catch (error) {
            console.log(error)
        }

    }

    async function fetchProducts() {

        try {

            const api = createAxiosInstance()
            const productsRes = await api.get('product');

            if (productsRes.status === 200) {
                setProducts(() => productsRes.data.allProducts)
            }

        } catch (error) {
            console.log(error)
        }

    }

    async function fetchWarehouses() {

        try {
            
            const api = createAxiosInstance()
            const warehousesRes = await api.get('location');

            if (warehousesRes.status === 200) {
                setWarehouses(() => warehousesRes.data.locations)
            }

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {

        fetchProducts()
        fetchWarehouses()

    }, [])

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Add to Inventory</h1>
                        <p className="text-gray-600 text-lg">Increase stock levels for existing products</p>
                    </div>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="space-y-8">
                        {/* Product Search */}
                        <div className="relative">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Search Product *
                            </label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                                    className={`w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.selectedProduct ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="Search for a product..."
                                />

                                {/* Suggestions Dropdown */}
                                {showSuggestions && filteredProducts.length > 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
                                        {filteredProducts.map((product) => (
                                            <div
                                                key={product.ProductID}
                                                onClick={() => handleProductSelect(product)}
                                                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.Name}</p>
                                                        <p className="text-sm text-gray-500">Current Stock: {product.QuantityInStock}</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-green-600">{product.SellingPrice} LKR </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {showSuggestions && searchTerm.length > 0 && filteredProducts.length === 0 && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg p-4">
                                        <p className="text-gray-500 text-center">No products found</p>
                                    </div>
                                )}
                            </div>
                            {errors.selectedProduct && (
                                <p className="mt-2 text-sm text-red-600">{errors.selectedProduct}</p>
                            )}
                        </div>

                        {/* Selected Product Display */}
                        {formData.selectedProduct && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                            <Package className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{formData.selectedProduct.Name}</h3>
                                            <p className="text-sm text-gray-600">Product ID: {formData.selectedProduct.ProductID}</p>
                                            <p className="text-sm text-gray-600">Current Stock: {formData.selectedProduct.QuantityInStock} units</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-green-600">${formData.selectedProduct.SellingPrice}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Warehouse Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Select Warehouse *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        name="warehouseID"
                                        value={formData.warehouseID}
                                        onChange={handleInputChange}
                                        className={`w-full pl-12 pr-6 py-4 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.warehouseID ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                            }`}
                                    >
                                        <option value="">Choose warehouse</option>
                                        {warehouses.map(warehouse => (
                                            <option key={warehouse.LocationID} value={warehouse.LocationID}>
                                                {warehouse.WarehouseName} - {warehouse.Address}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.warehouseID && (
                                    <p className="mt-2 text-sm text-red-600">{errors.warehouseID}</p>
                                )}
                            </div>

                            {/* Quantity Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quantity to Add *
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className={`w-full px-6 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg ${errors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-200'
                                        }`}
                                    placeholder="Enter quantity"
                                    min="1"
                                />
                                {errors.quantity && (
                                    <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`flex items-center px-8 py-4 rounded-2xl transition-colors font-semibold text-lg ${isSubmitting
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <Plus className="w-5 h-5 mr-3" />
                                {isSubmitting ? 'Adding to Inventory...' : 'Add to Inventory'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Inventory Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Selected Product:</p>
                            <p className="font-medium">{formData.selectedProduct?.Name || 'None selected'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Target Warehouse:</p>
                            <p className="font-medium">
                                {formData.warehouseID
                                    ? warehouses.find(w => w.WarehouseID == formData.warehouseID)?.Name || 'Unknown'
                                    : 'None selected'
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Quantity to Add:</p>
                            <p className="font-medium">{formData.quantity || '0'} units</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddToInventory;