import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Printer,
  Eye,
  Calendar,
  Filter,
  Download,
  FileText,
} from "lucide-react";
import DataTable from "react-data-table-component";

import StatusBadge from "components/Badges/StatusBadge";
import PaymentBadge from "components/Badges/PaymentBadge";
import NoDataComponent from "components/Placeholders/NoData";

// Mock data for demonstration
const mockSalesOrders = [
  {
    OrderID: 1001,
    OrderDate: "2024-01-15T00:00:00Z",
    TotalAmount: 25000,
    Status: "completed",
    PaymentStatus: "paid",
    CustomerID: 101
  },
  {
    OrderID: 1002,
    OrderDate: "2024-01-16T00:00:00Z",
    TotalAmount: 18500,
    Status: "pending",
    PaymentStatus: "unpaid",
    CustomerID: 102
  },
  {
    OrderID: 1003,
    OrderDate: "2024-01-17T00:00:00Z",
    TotalAmount: 32000,
    Status: "completed",
    PaymentStatus: "paid",
    CustomerID: 103
  },
  {
    OrderID: 1004,
    OrderDate: "2024-01-18T00:00:00Z",
    TotalAmount: 15750,
    Status: "cancelled",
    PaymentStatus: "unpaid",
    CustomerID: 104
  }
];

function SalesOrders() {
  const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  // Filter orders
  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = !searchQuery ||
      order.OrderID.toString().includes(searchQuery) ||
      order.Status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !date ||
      new Date(order.OrderDate).toDateString() === new Date(date).toDateString();

    const matchesStatus = statusFilter === "all" || order.Status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Statistics
  const totalOrders = salesOrders.length;
  const completedOrders = salesOrders.filter(order => order.Status === "completed").length;
  const pendingOrders = salesOrders.filter(order => order.Status === "pending").length;
  const totalRevenue = salesOrders
    .filter(order => order.Status === "completed")
    .reduce((sum, order) => sum + order.TotalAmount, 0);

  // const StatusBadge = ({ status }) => {
  //   const styles = {
  //     completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  //     pending: "bg-amber-50 text-amber-700 border-amber-200", 
  //     cancelled: "bg-red-50 text-red-700 border-red-200"
  //   };

  //   return (
  //     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
  //       {status.charAt(0).toUpperCase() + status.slice(1)}
  //     </span>
  //   );
  // };

  // const PaymentBadge = ({ status }) => {
  //   const isPaid = status === "paid";
  //   return (
  //     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
  //       isPaid 
  //         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
  //         : "bg-red-50 text-red-700 border-red-200"
  //     }`}>
  //       {isPaid ? "Paid" : "Unpaid"}
  //     </span>
  //   );
  // };

  const customStyles = {
    table: {
      style: {
        backgroundColor: 'white',
        borderRadius: '16px',
      },
    },
    header: {
      style: {
        backgroundColor: '#f8fafc',
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        borderBottom: '1px solid #e2e8f0',
        minHeight: '56px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
    },
    headRow: {
      style: {
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        minHeight: '56px',
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        color: '#64748b',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
      },
    },
    rows: {
      style: {
        borderBottom: '1px solid #f1f5f9',
        '&:hover': {
          backgroundColor: '#f8fafc',
          transition: 'background-color 0.2s',
        },
        minHeight: '64px',
      },
    },
    pagination: {
      style: {
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px',
        minHeight: '56px',
        paddingLeft: '24px',
        paddingRight: '24px',
      },
      pageButtonsStyle: {
        borderRadius: '8px',
        height: '32px',
        width: '32px',
        padding: '0',
        margin: '0 2px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        backgroundColor: 'transparent',
        border: 'none',
        '&:hover': {
          backgroundColor: '#e2e8f0',
        },
        '&:focus': {
          outline: 'none',
        },
      },
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '500',
        padding: '48px 24px',
      },
    },
    progressPending: {
      style: {
        backgroundColor: 'white',
      },
    },
  };

  const columns = [
    {
      name: 'Order ID',
      selector: row => row.OrderID,
      sortable: true,
      cell: row => (
        <span className="font-semibold text-slate-900">#{row.OrderID}</span>
      ),
    },
    {
      name: 'Customer ID',
      selector: row => row.CustomerID,
      sortable: true,
      cell: row => (
        <span className="font-semibold text-slate-900">#{row.CustomerID}</span>
      ),
    },
    {
      name: 'Date',
      selector: row => row.OrderDate,
      sortable: true,
      cell: row => (
        <span className="text-slate-600">
          {new Date(row.OrderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      name: 'Amount',
      selector: row => row.TotalAmount,
      sortable: true,
      cell: row => (
        <span className="font-semibold text-slate-900">
          {row.TotalAmount.toLocaleString()} LKR
        </span>
      ),
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      cell: row => <StatusBadge status={row.Status} />,
    },
    {
      name: 'Payment',
      selector: row => row.PaymentStatus,
      sortable: true,
      cell: row => <PaymentBadge status={row.PaymentStatus} />,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    return mockSalesOrders.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.OrderID.toString().includes(searchQuery) ||
        item.CustomerID.toString().includes(searchQuery);

      const matchesStatus = statusFilter === "all" || item.Status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Sales Orders</h1>
              <p className="text-slate-600">Manage and track all your sales orders efficiently</p>
            </div>
            <button
              onClick={() => setOpenAddModal(true)}
              className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Sales Order
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsLoading(true)}
                className="flex items-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-600" />
              </button>
              <button className="flex items-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Printer className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            sortIcon={<div className="text-slate-400">↕</div>}
            customStyles={customStyles}
            noDataComponent={<NoDataComponent />}
            responsive
            highlightOnHover
            pointerOnHover={false}
            paginationComponentOptions={{
              rowsPerPageText: 'Rows per page:',
              rangeSeparatorText: 'of',
              selectAllRowsItem: true,
              selectAllRowsItemText: 'All',
            }}
          />
        </div>

      </div>

      {/* Modal placeholder - would be replaced with actual modal component */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Sales Order</h2>
            <p className="text-slate-600 mb-6">This would open the sales order creation modal.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenAddModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesOrders;