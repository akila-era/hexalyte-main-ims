import React, { useState, useEffect } from "react";
import { X, Search, Package, ChevronDown } from "lucide-react";
import { createAxiosInstance } from "../../api/axiosInstance";

const AddNewOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [orderData, setOrderData] = useState({
    customerName: "",
    address: "",
    primaryMobile: "",
    secondaryMobile: "",
    city: "",
    productId: "",
    remark: "",
    deliveryFee: "",        // NEW
    paymentMode: "",        // NEW
  });
  

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");


  // Simulate API fetch
  // useEffect(() => {
  //   if (isOpen) {
  // In real implementation, this would be an API call
  //     setProducts(products.filter(product => product.isActive));
  //     setFilteredProducts(products.filter(product => product.isActive));
  //   }
  // }, [isOpen]);

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductSearch = (searchValue) => {
    setProductSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.Name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.Description.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
    setShowProductDropdown(true);
  };

  const selectProduct = (product) => {
    setOrderData(prev => ({ ...prev, productId: product.ProductID }));
    setProductSearchTerm(product.Name);
    setShowProductDropdown(false);
  };

  const getSelectedProduct = () => {
    return products.find(p => p.ProductID === orderData.productId);
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!orderData.customerName || !orderData.address || !orderData.primaryMobile || 
      !orderData.city || !orderData.productId || !orderData.paymentMode || !orderData.deliveryFee) {
    alert("Please fill in all required fields including Payment Mode and Delivery Fee");
    return;
  }
  

    const selectedProduct = getSelectedProduct();
    const orderPayload = {
      ...orderData,
      product: selectedProduct,
      createdAt: new Date().toISOString(),
    };

    onSubmit(orderPayload);
    // console.log(orderPayload);

    // Reset form
    setOrderData({
      customerName: "",
      address: "",
      primaryMobile: "",
      secondaryMobile: "",
      city: "",
      productId: "",
      remark: "",
    });
    setProductSearchTerm("");

    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setOrderData({
      customerName: "",
      address: "",
      primaryMobile: "",
      secondaryMobile: "",
      city: "",
      productId: "",
      remark: "",
    });
    setProductSearchTerm("");
    setShowProductDropdown(false);
    onClose();
  };

  async function fetchProducts() {
    try {

      const api = createAxiosInstance();
      const response = await api.get("product");

      console.log(response);

      if (response.status === 200) {
        // setProducts(response.data.allProducts);
        setProducts(response.data.allProducts.filter(product => product.isActive));
        setFilteredProducts(response.data.allProducts.filter(product => product.isActive));
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Add New Order
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Customer Name and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={orderData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={orderData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter city"
                  required
                />
              </div>
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Mobile *
                </label>
                <input
                  type="tel"
                  value={orderData.primaryMobile}
                  onChange={(e) => handleInputChange("primaryMobile", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0771234567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Mobile
                </label>
                <input
                  type="tel"
                  value={orderData.secondaryMobile}
                  onChange={(e) => handleInputChange("secondaryMobile", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0771234567"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                value={orderData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={2}
                placeholder="Enter complete address"
                required
              />
            </div>

            {/* Product Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Search for a product..."
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Product Dropdown */}
              {showProductDropdown && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <div
                        key={product.ProductID}
                        onClick={() => selectProduct(product)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 text-sm">{product.Name}</div>
                            <div className="text-xs text-gray-500 mt-1">{product.Description}</div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs font-medium text-green-600">
                                Rs. {parseFloat(product.SellingPrice).toFixed(2)}
                              </span>
                              <span
                                className={`text-xs ${product.QuantityInStock > 0 ? "text-blue-600" : "text-red-600"}`}>
                                Stock: {product.QuantityInStock}
                              </span>
                            </div>
                          </div>
                          {product.QuantityInStock === 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Payment Mode & Delivery Fee */}


              {/* Payment Mode & Delivery Fee */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Payment Mode *
    </label>
    <select
      value={orderData.paymentMode}
      onChange={(e) => handleInputChange("paymentMode", e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      required
    >
      <option value="">Select Payment Mode</option>
      <option value="COD">Cash on Delivery</option>
      <option value="Card">Card</option>
      <option value="Bank Transfer">Bank Transfer</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Delivery Fee *
    </label>
    <input
      type="number"
      value={orderData.deliveryFee}
      onChange={(e) => handleInputChange("deliveryFee", e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      placeholder="Enter delivery fee"
      required
    />
  </div>
</div>


            {/* Selected Product Display */}
            {/*{orderData.productId && (*/}
            {/*  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">*/}
            {/*    <h4 className="font-medium text-blue-800 mb-1 text-sm">Selected Product:</h4>*/}
            {/*    <div className="text-blue-700">*/}
            {/*      <div className="font-medium text-sm">{getSelectedProduct()?.Name}</div>*/}
            {/*      <div className="text-xs mt-1">Price: Rs. {parseFloat(getSelectedProduct()?.SellingPrice || 0).toFixed(2)} • Stock: {getSelectedProduct()?.QuantityInStock}</div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*)}*/}

            {/* Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <textarea
                value={orderData.remark}
                onChange={(e) => handleInputChange("remark", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={2}
                placeholder="Any additional notes or remarks..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewOrderModal;