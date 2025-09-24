import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { 
  Eye, Edit, Trash2, Plus, Search, Filter, Download, Upload, 
  X, Phone, MapPin, Calendar, Package, User, CreditCard,
  Clock, CheckCircle, AlertCircle, XCircle, Truck, Star
} from "lucide-react";
import UploadBulkOrdersModal from "components/Modal/UploadBulkOrdersModal";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { createAxiosInstance } from "../../api/axiosInstance";
import AddNewOrderModal from "../../components/Modal/AddNewOrderModal";
import Swal from "sweetalert2";

const NewOrderComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [openAddOrderModal, setOpenAddOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sample data - replace with your actual data
  const [orders, setOrders] = useState([
    // {
    //     OrderID: "NO-001",
    //     OrderDate: "2025-01-15",
    //     CustomerName: "John Doe",
    //     ProductName: "Wireless Headphones",
    //     OrderNote: "CONFIRM",
    //     CallStatus: "SUCCESS",
    //     CallAgent: "Agent Smith"
    // },
    // {
    //     OrderID: "NO-002",
    //     OrderDate: "2025-01-16",
    //     CustomerName: "Jane Smith",
    //     ProductName: "Smartphone Case",
    //     OrderNote: "DENIED",
    //     CallStatus: "REJECTED",
    //     CallAgent: "Agent Johnson"
    // },
    // {
    //     OrderID: "NO-003",
    //     OrderDate: "2025-01-17",
    //     CustomerName: "Mike Wilson",
    //     ProductName: "Bluetooth Speaker",
    //     OrderNote: "CONFIRM",
    //     CallStatus: "NO RESPONSE",
    //     CallAgent: "Agent Davis"
    // },
    // {
    //     OrderID: "NO-004",
    //     OrderDate: "2025-01-18",
    //     CustomerName: "Sarah Brown",
    //     ProductName: "Tablet Stand",
    //     OrderNote: "CONFIRM",
    //     CallStatus: "SUCCESS",
    //     CallAgent: "Agent Wilson"
    // },
    // {
    //     OrderID: "NO-005",
    //     OrderDate: "2025-01-19",
    //     CustomerName: "David Lee",
    //     ProductName: "Power Bank",
    //     OrderNote: "DENIED",
    //     CallStatus: "REJECTED",
    //     CallAgent: "Agent Smith"
    // },
    // {
    //     OrderID: "NO-006",
    //     OrderDate: "2025-01-20",
    //     CustomerName: "Emily Davis",
    //     ProductName: "Gaming Mouse",
    //     OrderNote: "CONFIRM",
    //     CallStatus: "SUCCESS",
    //     CallAgent: "Agent Wilson"
    // },
    // {
    //     OrderID: "NO-007",
    //     OrderDate: "2025-01-21",
    //     CustomerName: "Robert Johnson",
    //     ProductName: "USB Cable",
    //     OrderNote: "DENIED",
    //     CallStatus: "NO RESPONSE",
    //     CallAgent: "Agent Davis"
    // }
  ]);

  // Action handlers
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (order) => {
    alert(`Editing order: ${order.OrderID}`);
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(order => order.OrderID !== orderId));
    }
  };

  const handleAddNew = () => {
    alert("Opening new order form");
  };

  const handleExport = () => {
    alert("Exporting orders to CSV");
  };

  const handleUpload = () => {
    alert(`Uploading Files`);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "SUCCESS": "bg-green-100 text-green-800",
      "REJECTED": "bg-red-100 text-red-800",
      "NO RESPONSE": "bg-yellow-100 text-yellow-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getOrderNoteBadge = (note) => {
    const noteColors = {
      "CONFIRM": "bg-blue-100 text-blue-800",
      "DENIED": "bg-red-100 text-red-800",
    };
    return noteColors[note] || "bg-gray-100 text-gray-800";
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      'Confirmed': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Package },
      'Shipped': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck },
      'Delivered': { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle };
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent size={12} />
        {status}
      </span>
    );
  };

  const getCallStatusBadge = (callStatus) => {
    const statusConfig = {
      'Not Called': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'Called': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Answered': { bg: 'bg-green-100', text: 'text-green-800' },
      'No Answer': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Busy': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'Wrong Number': { bg: 'bg-red-100', text: 'text-red-800' },
      'Callback Requested': { bg: 'bg-purple-100', text: 'text-purple-800' },
    };
    
    const config = statusConfig[callStatus] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Phone size={12} />
        {callStatus}
      </span>
    );
  };

  // Data table columns configuration
  const columns = useMemo(() => [
    {
      name: "Order ID",
      selector: row => row.NewOrderID,
      sortable: true,
      width: '120px',
      cell: row => (
        <div className="font-medium text-blue-600">
          #{row.NewOrderID}
        </div>
      )
    },
    {
      name: 'Order Date',
      selector: row => row.createdAt,
      sortable: true,
      width: '120px',
      cell: row => (
        <div className="text-sm">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </div>
      )
    },
    {
      name: "Customer Info",
      selector: row => row.CustomerName,
      sortable: true,
      width: '200px',
      cell: row => (
        <div>
          <div className="font-medium text-gray-900">{row.CustomerName}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <Phone size={12} />
            {row.PrimaryPhone}
          </div>
        </div>
      )
    },
    {
      name: "Location",
      selector: row => row.CityName,
      sortable: true,
      width: '180px',
      cell: row => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-900">
            <MapPin size={12} />
            {row.CityName || 'N/A'}
          </div>
          <div className="text-gray-500 truncate" title={row.CustomerAddress}>
            {row.CustomerAddress ? 
              (row.CustomerAddress.length > 30 ? 
                row.CustomerAddress.substring(0, 30) + '...' : 
                row.CustomerAddress
              ) : 'N/A'
            }
          </div>
        </div>
      )
    },
    {
      name: "Order Status",
      selector: row => row.Status,
      sortable: true,
      width: '140px',
      cell: row => getStatusBadge(row.Status || 'Pending')
    },
    {
      name: "Call Status",
      selector: row => row.CallStatus,
      sortable: true,
      width: '150px',
      cell: row => getCallStatusBadge(row.CallStatus || 'Not Called')
    },
    {
      name: "Priority",
      selector: row => row.Priority,
      sortable: true,
      width: '100px',
      cell: row => (
        <div className="flex items-center gap-1">
          <Star 
            size={14} 
            className={`${row.Priority === 'High' ? 'text-red-500 fill-red-500' : 
                          row.Priority === 'Medium' ? 'text-yellow-500 fill-yellow-500' : 
                          'text-gray-400'}`} 
          />
          <span className="text-sm">{row.Priority || 'Normal'}</span>
        </div>
      )
    },
    {
      name: "Actions",
      width: '100px',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
            title="Edit Order"
          >
            <Edit size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: "true",
    },
  ], []);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = Object.values(order).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const matchesFilter = filterStatus === "all" || order.Status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  // Custom styles for the data table
  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
        backgroundColor: "#ffffff",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#e5e7eb",
        minHeight: "52px",
      },
    },
    headCells: {
      style: {
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        color: "#6b7280",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#111827",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    rows: {
      style: {
        "&:hover": {
          backgroundColor: "#f3f4f6",
          cursor: "pointer",
        },
      },
      stripedStyle: {
        backgroundColor: "#f9fafb",
      },
    },
    pagination: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "#e5e7eb",
        minHeight: "56px",
      },
    },
  };

  async function addOrder(orderData) {
    // console.log(orderData);

    try {
      const api = createAxiosInstance();
      const response = await api.post("neworder", orderData);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Created Order successfully",
        })
      }

    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.message,
      })
    }

  }

  async function fetchNewOrders() {
    try {
      setLoading(true);
      const api = createAxiosInstance();
      const response = await api.get("neworder");

      console.log(response);

      if (response.status === 200) {
        setOrders(response.data.data);
      }

    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch orders. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewOrders();
  }, []);

  return (
    <>
      <div className="p-4 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">New Orders</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download size={16} />
                  Export
                </button>
                <Link
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  to="/admin/orders/new-orders/bulk-upload"
                >
                  <Upload size={16} />
                  Upload Bulk
                </Link>
                <button
                  onClick={() => setOpenAddOrderModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Add New Order
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                </div>
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {orders.filter(order => order.Status === 'Confirmed').length}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {orders.filter(order => order.Status === 'Pending' || !order.Status).length}
                  </p>
                </div>
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {orders.filter(order => ['Processing', 'Shipped'].includes(order.Status)).length}
                  </p>
                </div>
                <Truck className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          {/* React Data Table Component */}
          <div className="overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredOrders}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20, 25]}
              highlightOnHover
              striped
              responsive
              customStyles={customStyles}
              noDataComponent={
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <div className="text-lg font-medium mb-2">No orders found</div>
                  <div className="text-sm">Try adjusting your search criteria or add a new order</div>
                </div>
              }
              progressPending={loading}
              progressComponent={
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <div className="text-lg font-medium text-gray-600">Loading orders...</div>
                  <div className="text-sm text-gray-500">Please wait while we fetch your data</div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {openAddOrderModal && <AddNewOrderModal isOpen={openAddOrderModal} onClose={() => setOpenAddOrderModal(false)}
                                              onSubmit={addOrder} />}

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500 mt-1">Order #{selectedOrder.NewOrderID}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="text-blue-600" size={20} />
                    <span className="font-medium text-blue-900">Order Status</span>
                  </div>
                  {getStatusBadge(selectedOrder.Status || 'Pending')}
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="text-green-600" size={20} />
                    <span className="font-medium text-green-900">Call Status</span>
                  </div>
                  {getCallStatusBadge(selectedOrder.CallStatus || 'Not Called')}
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-purple-600" size={20} />
                    <span className="font-medium text-purple-900">Priority</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star 
                      size={16} 
                      className={`${selectedOrder.Priority === 'High' ? 'text-red-500 fill-red-500' : 
                                    selectedOrder.Priority === 'Medium' ? 'text-yellow-500 fill-yellow-500' : 
                                    'text-gray-400'}`} 
                    />
                    <span className="text-sm font-medium">{selectedOrder.Priority || 'Normal'}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Customer Name</label>
                    <p className="text-gray-900 font-medium">{selectedOrder.CustomerName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Primary Phone</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Phone size={14} />
                      {selectedOrder.PrimaryPhone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Secondary Phone</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Phone size={14} />
                      {selectedOrder.SecondaryPhone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{selectedOrder.CustomerEmail || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Address</label>
                    <p className="text-gray-900">{selectedOrder.CustomerAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                    <p className="text-gray-900">{selectedOrder.CityName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                    <p className="text-gray-900">{selectedOrder.Pincode || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} />
                  Order Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Order Date</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <Calendar size={14} />
                      {selectedOrder.createdAt ? 
                        new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Order Source</label>
                    <p className="text-gray-900">{selectedOrder.OrderSource?.Name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Page Name</label>
                    <p className="text-gray-900">{selectedOrder.Page?.PageName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
                    <p className="text-gray-900 font-semibold flex items-center gap-1">
                      <CreditCard size={14} />
                      ₹{selectedOrder.TotalAmount || '0'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Remarks</label>
                    <p className="text-gray-900">{selectedOrder.Remark || 'No remarks'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.NewOrderItems && selectedOrder.NewOrderItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.NewOrderItems.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Product</label>
                            <p className="text-gray-900 font-medium">
                              {item.subProduct?.product?.Name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Serial Number</label>
                            <p className="text-gray-900">{item.subProduct?.serialNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                            <p className="text-gray-900">{item.Quantity || 1}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Unit Price</label>
                            <p className="text-gray-900">₹{item.UnitPrice || '0'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Information */}
              {selectedOrder.DeliveryPartner && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck size={20} />
                    Delivery Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Partner</label>
                      <p className="text-gray-900 font-medium">{selectedOrder.DeliveryPartner.CompanyName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Tracking Number</label>
                      <p className="text-gray-900">{selectedOrder.TrackingNumber || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Payment Mode</label>
                      <p className="text-gray-900">{selectedOrder.PaymentMode || 'COD'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Delivery Fee</label>
                      <p className="text-gray-900">₹{selectedOrder.DeliveryFee || '0'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleEdit(selectedOrder);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default NewOrderComponent;