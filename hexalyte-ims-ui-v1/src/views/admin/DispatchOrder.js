import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Plus, Eye, Edit, Printer, Package, Truck, CheckCircle, Clock, 
  AlertCircle, Filter, Download, RefreshCw, MapPin, Phone, Calendar,
  BarChart3, TrendingUp, Users, DollarSign, Navigation, ExternalLink
} from 'lucide-react';
import { createAxiosInstance } from '../../api/axiosInstance';
import Swal from 'sweetalert2';

const DispatchOrderUI = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // UI states
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // table or cards

  // Transform order data for dispatch view
  const transformDispatchData = useCallback((orderData) => {
    return {
      id: orderData.NewOrderID,
      orderNumber: `ORD-${orderData.NewOrderID.toString().padStart(6, '0')}`,
      customerName: orderData.CustomerName || 'Unknown Customer',
      customerAddress: orderData.CustomerAddress || 'No address provided',
      customerPhone: orderData.PrimaryPhone || 'No phone',
      customerSecondaryPhone: orderData.SecondaryPhone || '',
      cityName: orderData.CityName || 'Unknown City',
      
      // Dispatch specific data
      trackingNumber: orderData.TrackingNumber || 'Not assigned',
      deliveryPartner: orderData.DeliveryPartner ? {
        id: orderData.DeliveryPartner.DeliveryPartnerID,
        name: orderData.DeliveryPartner.DeliveryPartnerName,
        contactNumber: orderData.DeliveryPartner.ContactNumber || 'N/A',
        email: orderData.DeliveryPartner.Email || 'N/A'
      } : (orderData.DeliveryPartnerID ? {
        id: orderData.DeliveryPartnerID,
        name: `Partner ${orderData.DeliveryPartnerID}`,
        contactNumber: 'N/A',
        email: 'N/A'
      } : null),
      
      // Order details
      status: orderData.Status || 'Unknown',
      paymentMode: orderData.PaymentMode || 'COD',
      deliveryFee: orderData.DeliveryFee || 0,
      
      // Dates
      orderDate: orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : 'Unknown',
      updatedDate: orderData.updatedAt ? new Date(orderData.updatedAt).toLocaleDateString() : 'Unknown',
      
      // Order items
      items: orderData.NewOrderItems?.map(item => ({
        id: item.NewOrderRowID,
        productName: item.subProduct?.product?.Name || `Product ${item.subProduct?.ProductID || 'Unknown'}`,
        quantity: item.Quantity || 1,
        unitPrice: item.UnitPrice || 0,
        serialNumber: item.subProduct?.serialNumber || 'N/A'
      })) || [],
      
      // Calculated fields
      totalAmount: orderData.NewOrderItems?.reduce((total, item) => 
        total + ((item.UnitPrice || 0) * (item.Quantity || 1)), 0) || 0,
      itemCount: orderData.NewOrderItems?.length || 0,
      
      // Dispatch status mapping
      dispatchStatus: getDispatchStatus(orderData.Status, orderData.TrackingNumber, orderData.DeliveryPartnerID)
    };
  }, []);

  // Map order status to dispatch status
  const getDispatchStatus = (orderStatus, trackingNumber, deliveryPartnerId) => {
    switch (orderStatus) {
      case 'Processing':
        return deliveryPartnerId ? 'ready_for_dispatch' : 'not_dispatched';
      case 'Shipped':
        return 'dispatched';
      case 'Delivered':
        return 'delivered';
      case 'Cancelled':
        return 'cancelled';
      case 'Confirmed':
        return deliveryPartnerId ? 'ready_for_dispatch' : 'not_dispatched';
      case 'Pending':
        return deliveryPartnerId ? 'ready_for_dispatch' : 'not_dispatched';
      default:
        return deliveryPartnerId ? 'ready_for_dispatch' : 'not_dispatched';
    }
  };

  // Fetch dispatched orders from backend
  const fetchDispatchOrders = async () => {
    try {
      console.log('Fetching dispatch orders...');
      const api = createAxiosInstance();
      const response = await api.get('/neworder');
      
      console.log('Dispatch orders response:', response.data);
      
      if (response.status === 200) {
        const ordersData = response.data.data || [];
        
        // Show all orders for dispatch management (including unassigned ones)
        const dispatchableOrders = ordersData.filter(order => 
          // Include orders that are confirmed, processing, shipped, delivered, or have delivery partner assigned
          ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(order.Status) ||
          order.DeliveryPartnerID
        );
        
        console.log('Dispatchable orders:', dispatchableOrders);
        
        const transformedOrders = dispatchableOrders.map(transformDispatchData);
        console.log('Transformed dispatch orders:', transformedOrders);
        
        setOrders(transformedOrders);
      }
    } catch (e) {
      console.error('Error fetching dispatch orders:', e);
      setError(`Failed to load dispatch orders: ${e.message}`);
    }
  };

  // Fetch delivery partners
  const fetchDeliveryPartners = async () => {
    try {
      console.log('Fetching delivery partners...');
      const api = createAxiosInstance();
      const response = await api.get('/deliverypartner');
      
      console.log('Delivery partners response:', response.data);
      
      if (response.status === 200) {
        const partners = response.data.allDeliveryPartners || [];
        console.log('Delivery partners loaded:', partners);
        setDeliveryPartners(partners);
      }
    } catch (e) {
      console.error('Error fetching delivery partners:', e);
      console.error('Error details:', e.response?.data);
      
      // If no delivery partners found, create some sample ones for testing
      if (e.response?.status === 404) {
        console.log('No delivery partners found, using empty array');
        setDeliveryPartners([]);
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchDispatchOrders(), fetchDeliveryPartners()]);
      } catch (error) {
        setError('Failed to load dispatch data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Status configuration
  const statusConfig = {
    not_dispatched: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Not Dispatched' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
    ready_for_dispatch: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Ready for Dispatch' },
    dispatched: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Dispatched' },
    delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' }
  };

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchQuery || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || order.dispatchStatus === statusFilter;
    const matchesPartner = partnerFilter === 'all' || 
      (order.deliveryPartner && order.deliveryPartner.id.toString() === partnerFilter);
    
    return matchesSearch && matchesStatus && matchesPartner;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    notDispatched: orders.filter(o => o.dispatchStatus === 'not_dispatched').length,
    readyForDispatch: orders.filter(o => o.dispatchStatus === 'ready_for_dispatch').length,
    dispatched: orders.filter(o => o.dispatchStatus === 'dispatched').length,
    delivered: orders.filter(o => o.dispatchStatus === 'delivered').length,
    totalValue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all orders
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const api = createAxiosInstance();
      await api.put(`/orderstatus/${orderId}`, {
        newStatus: newStatus,
        reason: 'Status updated from dispatch orders'
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order status updated to ${newStatus}`,
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchDispatchOrders(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update order status'
      });
    }
  };

  // Export dispatch data
  const exportDispatchData = () => {
    const csvData = filteredOrders.map(order => ({
      'Order Number': order.orderNumber,
      'Customer Name': order.customerName,
      'Phone': order.customerPhone,
      'Address': order.customerAddress,
      'City': order.cityName,
      'Delivery Partner': order.deliveryPartner?.name || 'Not assigned',
      'Tracking Number': order.trackingNumber,
      'Status': order.dispatchStatus.replace('_', ' '),
      'Payment Mode': order.paymentMode,
      'Delivery Fee': `Rs. ${order.deliveryFee}`,
      'Total Amount': `Rs. ${order.totalAmount}`,
      'Items': order.itemCount,
      'Order Date': order.orderDate
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispatch-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dispatch orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Dispatch Orders</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3 space-y-2">
                <button
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      await Promise.all([fetchDispatchOrders(), fetchDeliveryPartners()]);
                    } catch (error) {
                      setError('Failed to load data after retry');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 mr-2"
                >
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Retry Loading
                </button>
                <button
                  onClick={() => {
                    // Load with sample data for testing
                    const sampleOrders = [
                      {
                        id: 1,
                        orderNumber: 'ORD-000001',
                        customerName: 'Sample Customer',
                        customerAddress: 'Sample Address',
                        customerPhone: '1234567890',
                        deliveryPartner: { id: 1, name: 'Sample Delivery', contactNumber: '9876543210' },
                        trackingNumber: 'TRK123456',
                        dispatchStatus: 'ready_for_dispatch',
                        paymentMode: 'COD',
                        totalAmount: 1000,
                        itemCount: 2,
                        orderDate: new Date().toLocaleDateString()
                      }
                    ];
                    setOrders(sampleOrders);
                    setDeliveryPartners([{ DeliveryPartnerID: 1, DeliveryPartnerName: 'Sample Delivery' }]);
                    setError(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Load Sample Data
                </button>
              </div>
              <div className="mt-3 text-xs text-red-600">
                <details>
                  <summary className="cursor-pointer">Debug Information</summary>
                  <div className="mt-2 space-y-1">
                    <p>• Check if backend API is running on port 3001</p>
                    <p>• Verify authentication token is valid</p>
                    <p>• Ensure delivery partners exist in database</p>
                    <p>• Check browser console for detailed errors</p>
                    <p>• Delivery Partners in DB: {deliveryPartners.length}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="w-full mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" />
                Dispatch Orders
              </h1>
              <p className="text-gray-600 mt-1">Manage delivery orders and tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  showStats ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Stats
              </button>
              <button
                onClick={() => fetchDispatchOrders()}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Not Dispatched</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.notDispatched}</p>
                </div>
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Ready to Dispatch</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.readyForDispatch}</p>
                </div>
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Dispatched</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.dispatched}</p>
                </div>
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Total Value</p>
                  <p className="text-lg font-bold text-green-600">Rs. {stats.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                  <option value="not_dispatched">Not Dispatched</option>
                  <option value="ready_for_dispatch">Ready for Dispatch</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
              >
                <option value="all">All Partners</option>
                {deliveryPartners.map(partner => (
                  <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
                    {partner.DeliveryPartnerName}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedOrders.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedOrders.length} selected
                </span>
              )}
              <button 
                onClick={exportDispatchData}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Delivery Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tracking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Dispatch Orders Found</h3>
                      <p className="text-gray-500">
                        {searchQuery || statusFilter !== 'all' || partnerFilter !== 'all'
                          ? 'No orders match your current filters.'
                          : 'No orders have been assigned to delivery partners yet.'}
                      </p>
                      {(searchQuery || statusFilter !== 'all' || partnerFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                            setPartnerFilter('all');
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = statusConfig[order.dispatchStatus] || statusConfig.pending;
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleOrderSelect(order.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.itemCount} items • {order.orderDate}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {order.customerPhone}
                            </div>
                            <div className="text-sm text-gray-500 flex items-start gap-1">
                              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{order.customerAddress}</span>
                            </div>
                            <div className="text-xs text-gray-400">{order.cityName}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {order.deliveryPartner ? (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.deliveryPartner.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.deliveryPartner.contactNumber}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not assigned</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4">
                          {order.trackingNumber !== 'Not assigned' ? (
                            <div>
                              <div className="text-sm font-mono text-gray-900">{order.trackingNumber}</div>
                              {order.deliveryPartner && (
                                <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" />
                                  Track
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not assigned</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Rs. {order.totalAmount.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.paymentMode} • Delivery: Rs. {order.deliveryFee}
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 p-1" 
                              title="View Details"
                              onClick={() => {
                                Swal.fire({
                                  title: `Order ${order.orderNumber}`,
                                  html: `
                                    <div class="text-left space-y-3">
                                      <div><strong>Customer:</strong> ${order.customerName}</div>
                                      <div><strong>Phone:</strong> ${order.customerPhone}</div>
                                      <div><strong>Address:</strong> ${order.customerAddress}</div>
                                      <div><strong>Items:</strong> ${order.itemCount} items</div>
                                      <div><strong>Total:</strong> Rs. ${order.totalAmount.toLocaleString()}</div>
                                      <div><strong>Payment:</strong> ${order.paymentMode}</div>
                                      <div><strong>Delivery Partner:</strong> ${order.deliveryPartner?.name || 'Not assigned'}</div>
                                      <div><strong>Tracking:</strong> ${order.trackingNumber}</div>
                                      <div><strong>Status:</strong> ${statusInfo.label}</div>
                                    </div>
                                  `,
                                  width: 500,
                                  confirmButtonColor: '#3b82f6'
                                });
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            {order.dispatchStatus === 'ready_for_dispatch' && (
                              <button 
                                className="text-purple-600 hover:text-purple-900 p-1" 
                                title="Mark as Dispatched"
                                onClick={() => updateOrderStatus(order.id, 'Shipped')}
                              >
                                <Truck className="w-4 h-4" />
                              </button>
                            )}
                            
                            {order.dispatchStatus === 'dispatched' && (
                              <button 
                                className="text-green-600 hover:text-green-900 p-1" 
                                title="Mark as Delivered"
                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button 
                              className="text-gray-600 hover:text-gray-900 p-1" 
                              title="Print Dispatch Label"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {filteredOrders.length} of {orders.length} dispatch orders
              </div>
              <div className="text-sm text-gray-500">
                Total Value: Rs. {filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispatchOrderUI;