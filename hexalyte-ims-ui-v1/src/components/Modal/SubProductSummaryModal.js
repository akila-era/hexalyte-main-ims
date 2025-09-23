import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Boxes,
  CheckCircle,
  Clock,
  X,
  BarChart3
} from "lucide-react";

function SubProductSummaryModal({ isOpen, onClose, products = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [productSummary, setProductSummary] = useState([]);

  // Function to process products and create summary
  const processProductSummary = (productData) => {
    const summary = {};

    productData.forEach(item => {
      const productId = item.ProductID;
      const productInfo = item.product;

      if (!summary[productId]) {
        summary[productId] = {
          productId: productId,
          name: productInfo.Name,
          description: productInfo.Description,
          buyingPrice: parseFloat(productInfo.BuyingPrice),
          sellingPrice: parseFloat(productInfo.SellingPrice),
          quantityInStock: productInfo.QuantityInStock,
          available: 0,
          allocated: 0,
          total: 0
        };
      }

      summary[productId].total += 1;

      if (item.status === 'AVAILABLE') {
        summary[productId].available += 1;
      } else if (item.status === 'ALLOCATED') {
        summary[productId].allocated += 1;
      }
    });

    return Object.values(summary);
  };

  useEffect(() => {
    if (products.length > 0) {
      const summary = processProductSummary(products);
      setProductSummary(summary);
    }
  }, [products]);

  const filteredSummary = productSummary.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (available, total) => {
    if (total === 0) return { color: "text-gray-600", bg: "bg-gray-100", label: "No Items" };
    const availablePercentage = (available / total) * 100;
    if (availablePercentage === 0) return { color: "text-red-600", bg: "bg-red-100", label: "Out of Stock" };
    if (availablePercentage < 30) return { color: "text-orange-600", bg: "bg-orange-100", label: "Low Stock" };
    return { color: "text-green-600", bg: "bg-green-100", label: "In Stock" };
  };

  const totalProducts = productSummary.length;
  const totalItems = productSummary.reduce((sum, p) => sum + p.total, 0);
  const totalAvailable = productSummary.reduce((sum, p) => sum + p.available, 0);
  const totalAllocated = productSummary.reduce((sum, p) => sum + p.allocated, 0);

  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "blue" },
    { label: "Total Items", value: totalItems, icon: Boxes, color: "purple" },
    { label: "Available Items", value: totalAvailable, icon: CheckCircle, color: "green" },
    { label: "Allocated Items", value: totalAllocated, icon: Clock, color: "orange" }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Product Inventory Summary</h2>
                  <p className="text-gray-600">Overview of product allocation and availability</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                      blue: 'bg-blue-100 text-blue-600',
                      purple: 'bg-purple-100 text-purple-600',
                      green: 'bg-green-100 text-green-600',
                      orange: 'bg-orange-100 text-orange-600'
                    };

                    return (
                      <div key={index} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`p-2 rounded-lg ${colorClasses[stat.color]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Product Summary Grid */}
                {filteredSummary.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSummary.map((product) => {
                      const stockStatus = getStockStatus(product.available, product.total);
                      const availablePercentage = product.total > 0 ? (product.available / product.total) * 100 : 0;
                      const allocatedPercentage = product.total > 0 ? (product.allocated / product.total) * 100 : 0;

                      return (
                        <div key={product.productId} className="bg-gray-50 rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                          {/* Product Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{product.name}</h3>
                              <p className="text-sm text-gray-600 truncate">{product.description}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color} ml-2 flex-shrink-0`}>
                              {stockStatus.label}
                            </span>
                          </div>

                          {/* Price Information */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Buying Price</p>
                              <p className="text-sm font-semibold text-gray-900">LKR {product.buyingPrice}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Selling Price</p>
                              <p className="text-sm font-semibold text-gray-900">LKR {product.sellingPrice}</p>
                            </div>
                          </div>

                          {/* Allocation Summary */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Total Items</span>
                              <span className="font-semibold text-gray-900">{product.total}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-600 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Available
                              </span>
                              <span className="font-semibold text-green-600">
                                {product.available} ({availablePercentage.toFixed(0)}%)
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-orange-600 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Allocated
                              </span>
                              <span className="font-semibold text-orange-600">
                                {product.allocated} ({allocatedPercentage.toFixed(0)}%)
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex text-xs text-gray-600 mb-1">
                              <span>Allocation Status</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="flex h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-green-500"
                                  style={{ width: `${availablePercentage}%` }}
                                ></div>
                                <div
                                  className="bg-orange-500"
                                  style={{ width: `${allocatedPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>Available</span>
                              <span>Allocated</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {productSummary.length === 0 ? "No products to display" : "No products found"}
                    </h3>
                    <p className="text-gray-600">
                      {productSummary.length === 0
                        ? "No product data available"
                        : "Try adjusting your search criteria"
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubProductSummaryModal;