import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';
import { createAxiosInstance } from '../../api/axiosInstance';
import Swal from 'sweetalert2';

const OrderStatusManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [stats, setStats] = useState({});

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
  }, [selectedStatus]);

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
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        console.log('Loaded orders:', ordersData.length);
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
        Swal.fire('Success', `Order status updated to ${newStatus}`, 'success');
        fetchOrders();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const message = error.response?.data?.message || 'Failed to update order status';
      Swal.fire('Error', message, 'error');
    }
  };

  const handleStatusChange = (order, newStatus) => {
    Swal.fire({
      title: `Change Status to ${newStatus}?`,
      text: `Order #${order.NewOrderID} will be updated from ${order.Status} to ${newStatus}`,
      input: 'textarea',
      inputPlaceholder: 'Optional reason for status change...',
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(order.NewOrderID, newStatus, result.value);
      }
    });
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

  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Status Management</h1>
        <p className="text-gray-600">Manage and track order statuses throughout the fulfillment process</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(stats).map(([status, count]) => {
          const config = statusConfig[status] || statusConfig['Pending'];
          return (
            <div key={status} className={`p-4 rounded-lg border ${config.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${config.color}`}>{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <StatusIcon status={status} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Orders</option>
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
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Orders {selectedStatus ? `- ${selectedStatus} Status` : ''}
          </h3>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.NewOrderID} className="hover:bg-gray-50">
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
                      <StatusBadge status={order.Status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {validTransitions[order.Status]?.map((newStatus) => (
                          <button
                            key={newStatus}
                            onClick={() => handleStatusChange(order, newStatus)}
                            className={`px-3 py-1 text-xs rounded-full border ${
                              newStatus === 'Cancelled' 
                                ? 'border-red-300 text-red-700 hover:bg-red-50'
                                : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                            }`}
                          >
                            → {newStatus}
                          </button>
                        ))}
                        {validTransitions[order.Status]?.length === 0 && (
                          <span className="text-xs text-gray-500">Final Status</span>
                        )}
                      </div>
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
