import React, { useState } from 'react';
import { Search, Plus, Eye, Edit, Printer, Package, Truck, CheckCircle, Clock, AlertCircle, Filter, Download } from 'lucide-react';

const DispatchOrderUI = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const orders = [
    {
      id: 'ORD001',
      deliveryId: 'DEL001',
      customerName: 'John Smith',
      address: '123 Main St, Colombo',
      carrier: 'FastTrack Express',
      status: 'pending',
      deliveryDate: '2025-08-15',
      trackingNumber: 'FT123456789',
      amount: '$234.50'
    },
    {
      id: 'ORD002',
      deliveryId: 'DEL002',
      customerName: 'Sarah Johnson',
      address: '456 Oak Ave, Kandy',
      carrier: 'QuickShip',
      status: 'out_for_delivery',
      deliveryDate: '2025-08-14',
      trackingNumber: 'QS987654321',
      amount: '$189.99'
    },
    {
      id: 'ORD003',
      deliveryId: 'DEL003',
      customerName: 'Michael Brown',
      address: '789 Pine St, Galle',
      carrier: 'SpeedPost',
      status: 'delivered',
      deliveryDate: '2025-08-13',
      trackingNumber: 'SP555666777',
      amount: '$156.75'
    },
    {
      id: 'ORD004',
      deliveryId: 'DEL004',
      customerName: 'Emma Wilson',
      address: '321 Cedar Rd, Negombo',
      carrier: 'FastTrack Express',
      status: 'submitted',
      deliveryDate: '2025-08-16',
      trackingNumber: 'FT234567890',
      amount: '$298.25'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      out_for_delivery: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      returned: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      submitted: <Package className="w-4 h-4" />,
      out_for_delivery: <Truck className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      returned: <AlertCircle className="w-4 h-4" />
    };
    return icons[status];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dispatch Orders</h1>
              <p className="text-gray-600 mt-1">Manage delivery orders and tracking</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              New Delivery
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {/*<div className="grid grid-cols-4 gap-6 mb-6">*/}
        {/*  <div className="bg-white rounded-lg shadow-sm p-6">*/}
        {/*    <div className="flex items-center justify-between">*/}
        {/*      <div>*/}
        {/*        <p className="text-sm text-gray-600">Total Orders</p>*/}
        {/*        <p className="text-2xl font-bold text-gray-900">1,247</p>*/}
        {/*      </div>*/}
        {/*      <Package className="w-8 h-8 text-blue-600" />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="bg-white rounded-lg shadow-sm p-6">*/}
        {/*    <div className="flex items-center justify-between">*/}
        {/*      <div>*/}
        {/*        <p className="text-sm text-gray-600">Out for Delivery</p>*/}
        {/*        <p className="text-2xl font-bold text-purple-600">89</p>*/}
        {/*      </div>*/}
        {/*      <Truck className="w-8 h-8 text-purple-600" />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="bg-white rounded-lg shadow-sm p-6">*/}
        {/*    <div className="flex items-center justify-between">*/}
        {/*      <div>*/}
        {/*        <p className="text-sm text-gray-600">Delivered Today</p>*/}
        {/*        <p className="text-2xl font-bold text-green-600">156</p>*/}
        {/*      </div>*/}
        {/*      <CheckCircle className="w-8 h-8 text-green-600" />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <div className="bg-white rounded-lg shadow-sm p-6">*/}
        {/*    <div className="flex items-center justify-between">*/}
        {/*      <div>*/}
        {/*        <p className="text-sm text-gray-600">Pending</p>*/}
        {/*        <p className="text-2xl font-bold text-yellow-600">34</p>*/}
        {/*      </div>*/}
        {/*      <Clock className="w-8 h-8 text-yellow-600" />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">

          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders, customers, tracking..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.deliveryId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.address}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.carrier}
                  </td>
                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                      </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {order.trackingNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button className="text-blue-600 hover:text-blue-900" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" title="Print Label">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="text-sm text-gray-700">
              Showing 1 to {filteredOrders.length} of {orders.length} results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchOrderUI;