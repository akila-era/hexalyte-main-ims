import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Download,
  Users,
  Save,
  BarChart3,
  TrendingUp,
  Eye
} from 'lucide-react';
import { createAxiosInstance } from '../../api/axiosInstance';
import Swal from 'sweetalert2';

const OrderStatusManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [stats, setStats] = useState({});
  
  // Enhanced features state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [showStats, setShowStats] = useState(true);

  const statusConfig = {
    'Pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'Confirmed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    'Processing': { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    'Shipped': { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    'Delivered': { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-200' },
    'Cancelled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  const validTransitions = {
    'Pending': ['Confirmed', 'Cancelled'],
    'Confirmed': ['Processing', 'Cancelled'],
    'Processing': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered'],
    'Delivered': [],
    'Cancelled': []
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [selectedStatus, searchTerm, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const api = createAxiosInstance();
      
      // Load all orders with their current status
      let url;
      if (selectedStatus) {
        url = `/orderstatus?status=${selectedStatus}`;
      } else {
        // Load all orders from the main orders endpoint
        url = '/neworder';
      }
      
      const response = await api.get(url);
      console.log('Orders API Response:', response.data);
      
      if (response.status === 200) {
        // Handle different response structures
        const ordersData = response.data.orders || response.data.data || response.data || [];
        let filteredOrders = Array.isArray(ordersData) ? ordersData : [];
        
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.CustomerName?.toLowerCase().includes(searchLower) ||
            order.PrimaryPhone?.includes(searchTerm) ||
            order.NewOrderID?.toString().includes(searchTerm)
          );
        }
        
        // Apply date filter
        if (dateFilter) {
          const filterDate = new Date(dateFilter).toDateString();
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt).toDateString() === filterDate
          );
        }
        
        setOrders(filteredOrders);
        console.log('Filtered orders:', filteredOrders.length);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Swal.fire('Error', 'Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const api = createAxiosInstance();
      const response = await api.get('/orderstatus/stats');
      
      if (response.status === 200) {
        setStats(response.data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, reason = '') => {
    try {
      const api = createAxiosInstance();
      const response = await api.put(`/orderstatus/${orderId}`, {
        newStatus,
        reason
      });

      if (response.status === 200) {
        // Simple success notification
        Swal.fire({
          title: 'Updated!',
          text: `Status changed to ${newStatus}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        fetchOrders();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const message = error.response?.data?.message || 'Failed to update order status';
      Swal.fire('Error', message, 'error');
    }
  };

  const updateCallStatus = async (orderId, callStatus) => {
    try {
      const api = createAxiosInstance();
      const response = await api.put(`/neworder/${orderId}`, {
        CallStatus: callStatus
      });

      if (response.status === 200) {
        // Update the local state immediately for better UX
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.NewOrderID === orderId 
              ? { ...order, CallStatus: callStatus }
              : order
          )
        );
        
        // Show success message
        Swal.fire({
          title: 'Success',
          text: `Call status updated to ${callStatus}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error updating call status:', error);
      const message = error.response?.data?.message || 'Failed to update call status';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleStatusChange = (order, newStatus) => {
    // Direct status update without confirmation dialog
    updateOrderStatus(order.NewOrderID, newStatus, 'Direct status change');
  };

  // Bulk operations
  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.NewOrderID));
    }
  };

  const handleBulkStatusChange = async () => {
    if (selectedOrders.length === 0) {
      Swal.fire('Warning', 'Please select orders to update', 'warning');
      return;
    }

    if (!bulkStatus) {
      Swal.fire('Warning', 'Please select a status to update to', 'warning');
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm Bulk Status Update',
      text: `Update ${selectedOrders.length} orders to ${bulkStatus} status?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Updating Orders...',
        text: 'Please wait while we update the order statuses',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
      });

      const results = [];
      for (const orderId of selectedOrders) {
        try {
          const api = createAxiosInstance();
          const response = await api.put(`/orderstatus/${orderId}`, {
            newStatus: bulkStatus,
            reason: 'Bulk status update'
          });
          if (response.status === 200) {
            results.push({ orderId, success: true });
          }
        } catch (error) {
          results.push({ orderId, success: false, error: error.response?.data?.message || 'Failed to update' });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      Swal.close();

      if (failCount === 0) {
        Swal.fire('Success', `Successfully updated ${successCount} orders to ${bulkStatus}`, 'success');
      } else {
        Swal.fire('Partial Success', `Updated ${successCount} orders successfully. ${failCount} failed.`, 'warning');
      }

      setSelectedOrders([]);
      setBulkStatus('');
      fetchOrders();
      fetchStats();
    }
  };

  const exportOrders = () => {
    if (orders.length === 0) {
      Swal.fire('Warning', 'No orders to export', 'warning');
      return;
    }

    const csvContent = [
      ['Order ID', 'Customer Name', 'Phone', 'City', 'Status', 'Call Status', 'Created Date', 'Payment Mode', 'Delivery Fee'].join(','),
      ...orders.map(order => [
        order.NewOrderID,
        `"${order.CustomerName}"`,
        order.PrimaryPhone,
        `"${order.CityName}"`,
        order.Status,
        order.CallStatus || 'Not Called',
        new Date(order.createdAt).toLocaleDateString(),
        order.PaymentMode || 'N/A',
        order.DeliveryFee || 0
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${selectedStatus || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatusIcon = ({ status }) => {
    const config = statusConfig[status] || statusConfig['Pending'];
    const IconComponent = config.icon;
    return <IconComponent className={`w-4 h-4 ${config.color}`} />;
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <StatusIcon status={status} />
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  const StatsCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const StatusStatsDashboard = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Order Status Overview
        </h2>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showStats ? 'Hide' : 'Show'} Stats
        </button>
      </div>
      
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.keys(statusConfig).map(status => {
            const count = stats[status] || 0;
            const config = statusConfig[status];
            const colorClass = status === 'Pending' ? 'bg-yellow-500' :
                              status === 'Confirmed' ? 'bg-green-500' :
                              status === 'Processing' ? 'bg-blue-500' :
                              status === 'Shipped' ? 'bg-purple-500' :
                              status === 'Delivered' ? 'bg-green-600' :
                              'bg-red-500';
            
            return (
              <StatsCard
                key={status}
                title={status}
                value={count}
                icon={config.icon}
                color={colorClass}
              />
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Status Management</h1>
        <p className="text-gray-600">Comprehensive order status tracking, bulk operations, and analytics</p>
      </div>

      {/* Statistics Dashboard */}
      <StatusStatsDashboard />

      {/* Enhanced Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by customer, phone, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {Object.keys(statusConfig).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => { fetchOrders(); fetchStats(); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          
          <button
            onClick={exportOrders}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Bulk Operations */}
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{selectedOrders.length} orders selected</span>
            </div>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select bulk status...</option>
              {Object.keys(statusConfig).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              onClick={handleBulkStatusChange}
              disabled={!bulkStatus}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Update Selected
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Orders {selectedStatus ? `- ${selectedStatus} Status` : ''} ({orders.length})
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={orders.length > 0 && selectedOrders.length === orders.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Select All</span>
          </label>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Call Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.NewOrderID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.NewOrderID)}
                        onChange={() => handleOrderSelect(order.NewOrderID)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.NewOrderID}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.CityName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.CustomerName}</div>
                      <div className="text-sm text-gray-500">{order.PrimaryPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.CallStatus || 'Not Called'}
                        onChange={(e) => updateCallStatus(order.NewOrderID, e.target.value)}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Not Called">Not Called</option>
                        <option value="Called">Called</option>
                        <option value="Answered">Answered</option>
                        <option value="No Answer">No Answer</option>
                        <option value="Busy">Busy</option>
                        <option value="Wrong Number">Wrong Number</option>
                        <option value="Callback Requested">Callback Requested</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.Status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.Status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (newStatus !== order.Status) {
                            handleStatusChange(order, newStatus);
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={order.Status}>{order.Status} (Current)</option>
                        {validTransitions[order.Status]?.map((status) => (
                          <option key={status} value={status}>
                            Change to {status}
                          </option>
                        ))}
                        {validTransitions[order.Status]?.length === 0 && (
                          <option disabled>No valid transitions</option>
                        )}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusManager;
