import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  XCircle, 
  RefreshCw,
  Filter,
  Save,
  Eye
} from 'lucide-react';
import { createAxiosInstance } from '../../api/axiosInstance';
import Swal from 'sweetalert2';

const BulkOrderStatusManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');

  const statusConfig = {
    'Pending': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    'Confirmed': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    'Processing': { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    'Shipped': { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
    'Delivered': { icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-200' },
    'Cancelled': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const api = createAxiosInstance();
      
      let url = '/neworder';
      const response = await api.get(url);
      console.log('Orders loaded:', response.data);
      
      if (response.status === 200) {
        const ordersData = response.data.data || [];
        let filteredOrders = ordersData;
        
        if (selectedStatus) {
          filteredOrders = ordersData.filter(order => order.Status === selectedStatus);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const api = createAxiosInstance();
      const response = await api.put(`/orderstatus/${orderId}`, {
        newStatus,
        reason: 'Bulk status update'
      });

      if (response.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating status:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to update' };
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
        const updateResult = await updateOrderStatus(orderId, bulkStatus);
        results.push({ orderId, ...updateResult });
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
    }
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig['Pending'];
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const columns = [
    {
      name: 'Select',
      width: '60px',
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(row.NewOrderID)}
          onChange={() => handleOrderSelect(row.NewOrderID)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      ),
      ignoreRowClick: true,
    },
    {
      name: 'Order ID',
      selector: row => row.NewOrderID,
      sortable: true,
      width: '100px',
      cell: row => <span className="font-medium">#{row.NewOrderID}</span>
    },
    {
      name: 'Customer',
      selector: row => row.CustomerName,
      sortable: true,
      width: '200px',
      cell: row => (
        <div>
          <div className="font-medium text-gray-900">{row.CustomerName}</div>
          <div className="text-sm text-gray-500">{row.PrimaryPhone}</div>
        </div>
      )
    },
    {
      name: 'City',
      selector: row => row.CityName,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Current Status',
      selector: row => row.Status,
      sortable: true,
      width: '130px',
      cell: row => <StatusBadge status={row.Status} />
    },
    {
      name: 'Change Status',
      width: '180px',
      cell: row => (
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
          value=""
          onChange={async (e) => {
            const newStatus = e.target.value;
            if (newStatus) {
              const result = await Swal.fire({
                title: 'Confirm Status Change',
                text: `Change order #${row.NewOrderID} from ${row.Status} to ${newStatus}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, Change',
              });

              if (result.isConfirmed) {
                const updateResult = await updateOrderStatus(row.NewOrderID, newStatus);
                if (updateResult.success) {
                  Swal.fire('Success', `Order status updated to ${newStatus}`, 'success');
                  fetchOrders();
                } else {
                  Swal.fire('Error', updateResult.error, 'error');
                }
              }
              e.target.value = ""; // Reset dropdown
            }
          }}
        >
          <option value="">Change to...</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
      ignoreRowClick: true,
    },
    {
      name: 'Created',
      selector: row => row.createdAt,
      sortable: true,
      width: '120px',
      cell: row => new Date(row.createdAt).toLocaleDateString()
    },
    {
      name: 'Actions',
      width: '80px',
      cell: row => (
        <button
          onClick={() => {
            Swal.fire({
              title: `Order #${row.NewOrderID}`,
              html: `
                <div class="text-left">
                  <p><strong>Customer:</strong> ${row.CustomerName}</p>
                  <p><strong>Phone:</strong> ${row.PrimaryPhone}</p>
                  <p><strong>Address:</strong> ${row.CustomerAddress}</p>
                  <p><strong>City:</strong> ${row.CityName}</p>
                  <p><strong>Status:</strong> ${row.Status}</p>
                  <p><strong>Created:</strong> ${new Date(row.createdAt).toLocaleString()}</p>
                  ${row.Remark ? `<p><strong>Remark:</strong> ${row.Remark}</p>` : ''}
                </div>
              `,
              icon: 'info'
            });
          }}
          className="text-blue-600 hover:text-blue-900 transition-colors p-1"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      ),
      ignoreRowClick: true,
    }
  ];

  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bulk Order Status Manager</h1>
        <p className="text-gray-600">Load orders and change their status individually or in bulk</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
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
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>

        {selectedOrders.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
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
            </div>
          </>
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

        <DataTable
          columns={columns}
          data={orders}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          highlightOnHover
          striped
          responsive
          progressPending={loading}
          progressComponent={
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          }
          noDataComponent={
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default BulkOrderStatusManager;

