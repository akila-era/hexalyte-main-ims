import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle, Store, Boxes, ScrollText,
} from "lucide-react";
import { createAxiosInstance } from "../../api/axiosInstance";
import ProductAddModal from "../../components/Modal/ProductAddModal";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import SubProductSummaryModal from "../../components/Modal/SubProductSummaryModal";
import Reports from "./Reports";

function ViewProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);

  // Sample product data
  const [products, setProducts] = useState([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: "bg-green-100", text: "text-green-800", label: "Active" },
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      inactive: { bg: "bg-red-100", text: "text-red-800", label: "Inactive" },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: "text-red-600", icon: AlertCircle, label: "Out of Stock" };
    if (stock < 20) return { color: "text-orange-600", icon: AlertCircle, label: "Low Stock" };
    return { color: "text-green-600", icon: Package, label: "In Stock" };
  };

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "blue" },
    {
      label: "Active Products",
      value: products.filter(p => p.status === "active").length,
      icon: TrendingUp,
      color: "green",
    },
    { label: "Draft Products", value: products.filter(p => p.status === "draft").length, icon: Edit, color: "orange" },
    { label: "Out of Stock", value: products.filter(p => p.stock === 0).length, icon: AlertCircle, color: "red" },
  ];

  async function fetchSubProducts() {
    try {

      const api = createAxiosInstance();
      const response = await api.get("/subproducts");

      console.log(response);

      if (response.status === 200) {
        setProducts(response.data);
      }

    } catch (e) {
      console.log(e);
    }
  }

  async function addProduct(productData) {
    try {

      if (productData.Name.trim() === "") {
        Swal.fire({
          title: "Warning",
          text: "Name cannot be Empty",
          icon: "warning",
        });
        return;
      }

      if (productData.Description.trim() === "") {
        Swal.fire({
          title: "Warning",
          text: "Description cannot be Empty",
          icon: "warning",
        });
        return;
      }

      if (Number(productData.BuyingPrice) <= 0) {
        Swal.fire({
          title: "Warning",
          text: "Enter a valid Buying Price",
          icon: "warning",
        });
        return;
      }

      if (Number(productData.SellingPrice) <= 0) {
        Swal.fire({
          title: "Warning",
          text: "Enter a valid Selling Price",
          icon: "warning",
        });
        return;
      }

      if (Number(productData.CategoryID) === 0) {
        Swal.fire({
          title: "Warning",
          text: "Select a Category",
          icon: "warning",
        });
        return;
      }

      if (Number(productData.SupplierID) === 0) {
        Swal.fire({
          title: "Warning",
          text: "Select a Supplier",
          icon: "warning",
        });
        return;
      }

      // const res = await axios.post(`${BASE_URL}product`, productData, { withCredentials: true });

      const api = createAxiosInstance();
      const res = await api.post("product", productData);

      if (res.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Product added successfully",
          icon: "success",
        });
        fetchSubProducts();
        setOpenAddProductModal(false);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to add product",
        icon: "error",
      });
    }
  }

  useEffect(() => {
    fetchSubProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 text-lg">Manage your product inventory</p>
            </div>
            <div className="flex gap-4">

              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setOpenSummaryModal(true)}
              >
                <ScrollText className="w-5 h-5 mr-2" />
                View Summary
              </button>

              <Link
                to="/admin/add-to-inventory"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Boxes className="w-5 h-5 mr-2" />
                Add Products to Inventory
              </Link>

              <button
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                onClick={() => setOpenAddProductModal(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {/*<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">*/}
          {/*  {stats.map((stat, index) => {*/}
          {/*    const Icon = stat.icon;*/}
          {/*    const colorClasses = {*/}
          {/*      blue: 'bg-blue-100 text-blue-600',*/}
          {/*      green: 'bg-green-100 text-green-600',*/}
          {/*      orange: 'bg-orange-100 text-orange-600',*/}
          {/*      red: 'bg-red-100 text-red-600'*/}
          {/*    };*/}
          {/*    */}
          {/*    return (*/}
          {/*      <div key={index} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">*/}
          {/*        <div className="flex items-center justify-between">*/}
          {/*          <div>*/}
          {/*            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>*/}
          {/*            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>*/}
          {/*          </div>*/}
          {/*          <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>*/}
          {/*            <Icon className="w-6 h-6" />*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    );*/}
          {/*  })}*/}
          {/*</div>*/}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                />
              </div>
            </div>

            {/*<div className="flex gap-4">*/}
            {/*  <select*/}
            {/*    value={filterStatus}*/}
            {/*    onChange={(e) => setFilterStatus(e.target.value)}*/}
            {/*    className="px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"*/}
            {/*  >*/}
            {/*    <option value="all">All Status</option>*/}
            {/*    <option value="active">Active</option>*/}
            {/*    <option value="draft">Draft</option>*/}
            {/*    <option value="inactive">Inactive</option>*/}
            {/*  </select>*/}
            {/*  */}
            {/*  <button className="flex items-center px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">*/}
            {/*    <Filter className="w-5 h-5 mr-2" />*/}
            {/*    More Filters*/}
            {/*  </button>*/}
            {/*</div>*/}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Products ({filteredProducts.length})
              </h2>
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} selected
                  </span>
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Delete Selected
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                <tr className="border-b border-gray-100">
                  {/*<th className="text-left py-4 px-4">*/}
                  {/*  <input*/}
                  {/*    type="checkbox"*/}
                  {/*    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}*/}
                  {/*    onChange={handleSelectAll}*/}
                  {/*    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"*/}
                  {/*  />*/}
                  {/*</th>*/}
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Product Name</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Serial Number</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Selling Price</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                  {/*<th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>*/}
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  const StockIcon = stockStatus.icon;

                  return (
                    <tr key={product.ID} className="border-b border-gray-50 hover:bg-gray-25 transition-colors">
                      {/*<td className="py-4 px-4">*/}
                      {/*  <input*/}
                      {/*    type="checkbox"*/}
                      {/*    checked={selectedProducts.includes(product.id)}*/}
                      {/*    onChange={() => handleSelectProduct(product.id)}*/}
                      {/*    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"*/}
                      {/*  />*/}
                      {/*</td>*/}
                      <td className="py-4 px-4">
                        <span className="text-gray-600 font-mono text-sm">{product.product.Name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-600 font-mono text-sm">{product.serialNumber}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{product.product.SellingPrice} LKR </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{product.status}</span>
                      </td>
                      {/*<td className="py-4 px-4">*/}
                      {/*  <div className="flex items-center gap-2">*/}
                      {/*    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">*/}
                      {/*      <Eye className="w-4 h-4" />*/}
                      {/*    </button>*/}
                      {/*    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">*/}
                      {/*      <Edit className="w-4 h-4" />*/}
                      {/*    </button>*/}
                      {/*    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">*/}
                      {/*      <Trash2 className="w-4 h-4" />*/}
                      {/*    </button>*/}
                      {/*    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">*/}
                      {/*      <MoreVertical className="w-4 h-4" />*/}
                      {/*    </button>*/}
                      {/*  </div>*/}
                      {/*</td>*/}
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing 1 to {filteredProducts.length} of {filteredProducts.length} results
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {
        openAddProductModal && <ProductAddModal setOpenModal={setOpenAddProductModal} addProduct={addProduct} />
      }

      <SubProductSummaryModal isOpen={openSummaryModal} onClose={() => setOpenSummaryModal(false)} products={products} />

    </div>
  );
}

export default ViewProducts;