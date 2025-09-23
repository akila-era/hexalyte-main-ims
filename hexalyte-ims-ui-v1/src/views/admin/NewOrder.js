import React, { useState, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Eye, Edit, Trash2, Plus, Search, Filter, Download, ArrowUpFromLine, Upload } from "lucide-react";
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
    alert(`Viewing order: ${order.OrderID}`);
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

  // Data table columns configuration
  const columns = useMemo(() => [
    {
      name: "Order ID",
      selector: row => row.NewOrderID,
      sortable: true,
    },
    // {
    //     name: 'Order Date',
    //     selector: row => row.OrderDate,
    //     sortable: true,
    //     format: row => new Date(row.OrderDate).toLocaleDateString(),
    // },
    {
      name: "Customer Name",
      selector: row => row.CustomerName,
      sortable: true,
    },
    {
      name: "Mobile Number",
      selector: row => row.PrimaryPhone,
      sortable: true,
    },
    // {
    //     name: 'Product Name',
    //     selector: row => row.ProductName,
    //     sortable: true,
    // },
    {
      name: "Remark",
      selector: row => row.Remark,
      sortable: true,
    },
    {
      name: "Address",
      selector: row => row.CustomerAddress,
      sortable: true,
    },
    {
      name: "City",
      selector: row => row.CityName,
      sortable: true,
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
            title="View"
          >
            <Eye size={16} />
          </button>
          {/*<button*/}
          {/*    onClick={() => handleEdit(row)}*/}
          {/*    className="text-green-600 hover:text-green-900 transition-colors p-1"*/}
          {/*    title="Edit"*/}
          {/*>*/}
          {/*    <Edit size={16} />*/}
          {/*</button>*/}
          {/*<button*/}
          {/*    onClick={() => handleDelete(row.OrderID)}*/}
          {/*    className="text-red-600 hover:text-red-900 transition-colors p-1"*/}
          {/*    title="Delete"*/}
          {/*>*/}
          {/*    <Trash2 size={16} />*/}
          {/*</button>*/}
        </div>
      ),
      ignoreRowClick: true,
      button: "true",
    },
  ], [orders]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = Object.values(order).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      );
      const matchesFilter = filterStatus === "all" || order.CallStatus === filterStatus;
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

      const api = createAxiosInstance();
      const response = await api.get("neworder");

      console.log(response);

      if (response.status === 200) {
        setOrders(response.data.data);
      }

    } catch (e) {
      console.log(e);
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
                  <option value="SUCCESS">Success</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="NO RESPONSE">No Response</option>
                </select>
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
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium">No orders found</div>
                  <div className="text-sm">Try adjusting your search criteria</div>
                </div>
              }
              progressPending={false}
              progressComponent={
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div className="mt-2 text-sm text-gray-500">Loading orders...</div>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {openAddOrderModal && <AddNewOrderModal isOpen={openAddOrderModal} onClose={() => setOpenAddOrderModal(false)}
                                              onSubmit={addOrder} />}

    </>
  );
};

export default NewOrderComponent;