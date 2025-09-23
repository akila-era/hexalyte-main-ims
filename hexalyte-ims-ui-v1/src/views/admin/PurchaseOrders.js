import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import CategoryMenu from "../../components/Menus/CategoryMenu";
import OrderAddModal from "components/Modal/PurchaseOrderAddModel";
import Swal from "sweetalert2";
import CategoryEditModal from "components/Modal/CategoryEditModel";
import PurchaseOrderInfoModal from "components/Modal/PurchaseOrderInfo";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import checkToken from "api/checkToken";
import handleUserLogout from "api/logout";
import PaymentActionButton from "components/buttons/PaymentActionButton";
import { createAxiosInstance } from "api/axiosInstance";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function ManagePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [openOrderModal, setOrderAddModal] = useState(false);
  const [openCategoryUpdateModal, setOpenCatgoeyUpdateModal] = useState(null);
  const [openModal, setOpenModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const { setAuth } = useAuth();
  const history = useHistory();

  async function loadpurchaseOrdersData() {
    try {
      setIsLoading(true);
      // const purchaseOrdersData = await axios.get(`${BASE_URL}purchaseorders`, { withCredentials: true });

      const api = createAxiosInstance()
      const purchaseOrdersData = await api.get('purchaseorders')

      setPurchaseOrders(() => [...purchaseOrdersData.data.purchaseOrders]);
      setIsLoading(false);
    } catch (error) {
      // if (error.status === 500 && error.response?.data?.error.includes("Please authenticate")) {
      //   localStorage.clear();
      //   history.push('/auth/login');
      // }
      if (error.status === 404 && error.response.data.message === "No Purchase Orders found") {
        console.log("No Purchase Orders Found")
      } else {
        console.log(error);
      }
      setIsLoading(false);
    }
  }

  // Update payment status function
  async function updatePaymentStatus(order) {
    try {
      const result = await Swal.fire({
        title: "Update Payment Status",
        text: `Mark this order as Paid?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#74BF04",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Yes, mark as Paid`,
      });

      if (result.isConfirmed) {
        // const updateReq = await axios.put(
        //   `${BASE_URL}purchaseorders/${order.OrderID}`,
        //   { OrderDate: order.OrderDate, TotalAmount: order.TotalAmount, Status: 'Paid' },
        //   { withCredentials: true }
        // );
        const api = createAxiosInstance();
        const updateReq = await api.put(`purchaseorders/${order.OrderID}`,
          { OrderDate: order.OrderDate, TotalAmount: order.TotalAmount, Status: 'Paid' }
        );

        const newStatus = {
          purchaseorderOrderID: order.OrderID,
          OldStatus: order.Status,
          NewStatus: 'Paid',
          StatusChangeDate: new Date()
        }

        // const orderStatus = await axios.post(`${BASE_URL}orderstatushistory`, newStatus, {withCredentials: true})
        const orderStatus = await api.post(`orderstatushistory`, newStatus)
        if (updateReq.status === 200) {
          // Update local state
          loadpurchaseOrdersData()

          Swal.fire({
            title: "Updated!",
            text: `Payment status has been updated to Paid.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update payment status. Please try again.",
        icon: "error",
      });
    }
  }

  async function deletePurchaseOrder(purchaseOrder) {
    try {
      Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure to delete the Purchase Order: #${purchaseOrder.OrderID}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          async function deletePurchaseOrderRequest(purchaseOrderRow) {
            try {
              // const deleteReq = await axios.delete(
              //   `${BASE_URL}purchaseorders/${purchaseOrderRow.OrderID}`, { withCredentials: true }
              // );
              const api = createAxiosInstance();
              const deleteReq = await api.delete(`purchaseorders/${purchaseOrderRow.OrderID}`)

              if (deleteReq.status === 200) {
                loadpurchaseOrdersData()
              }

            } catch (error) {
              console.log(error);
            }
          }

          deletePurchaseOrderRequest(purchaseOrder);
          loadpurchaseOrdersData();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Filter orders based on search query and filters
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.OrderID.toString().includes(searchQuery) ||
      (order.Status && order.Status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.PaymentStatus && order.PaymentStatus.toLowerCase().includes(searchQuery.toLowerCase()));

    // const matchesStatus = statusFilter === "" || 
    //   (order.Status && order.Status.toLowerCase() === statusFilter.toLowerCase());

    const matchesPayment = paymentFilter === "" ||
      (order.Status && order.Status.toLowerCase() === paymentFilter.toLowerCase())

    return matchesSearch && matchesPayment;
  });

  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout().then(() => setAuth(() => false)).then(() => history.push("/auth/login"));
    //   return;
    // }

    loadpurchaseOrdersData();
  }, []);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f9fafb",
        borderRadius: "8px 8px 0 0",
        border: "none",
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        color: "#4b5563",
        fontSize: "14px",
        fontWeight: "600",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "60px",
        borderBottom: "1px solid #f3f4f6",
        "&:last-of-type": {
          borderBottom: "none",
        },
      },
      highlightOnHoverStyle: {
        backgroundColor: "#f3f4f6",
        cursor: "pointer",
        transitionDuration: "0.15s",
        transitionProperty: "background-color",
        borderBottomColor: "#f3f4f6",
        outlineColor: "transparent",
      },
    },
    pagination: {
      style: {
        border: "none",
        backgroundColor: "#fff",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  };

  const StatusBadge = ({ status }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

    if (status.toLowerCase() === "completed") {
      badgeClass += "bg-green-100 text-green-800";
    } else if (status.toLowerCase() === "pending") {
      badgeClass += "bg-yellow-100 text-yellow-800";
    } else if (status.toLowerCase() === "cancelled") {
      badgeClass += "bg-red-100 text-red-800";
    } else {
      badgeClass += "bg-blue-100 text-blue-800";
    }

    return <span className={badgeClass}>{status}</span>;
  };

  const PaymentStatusBadge = ({ paymentStatus }) => {
    let badgeClass = "px-3 py-1 rounded-full text-xs font-medium ";

    if (paymentStatus?.toLowerCase() === "paid") {
      badgeClass += "bg-green-100 text-green-800";
    } else if (paymentStatus?.toLowerCase() === "unpaid") {
      badgeClass += "bg-red-100 text-red-800";
    } else {
      badgeClass += "bg-gray-100 text-gray-800";
    }

    return <span className={badgeClass}>{paymentStatus || "Not Set"}</span>;
  };

  // Print functionality
  const printOrder = async (order) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const orderDate = new Date(order.OrderDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const api = createAxiosInstance()
    const orderItemsRes = await api.get(`purchaseorderdetail/${order.OrderID}`) || []

    const orderItems = orderItemsRes.data.purchaseOrderDetails || []

    const orderRows = orderItems.map((orderItem) => {

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${orderItem.ProductID}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderItem.Quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${Number(orderItem.UnitPrice)?.toLocaleString() || '0'} LKR</td>
        </tr>
      `

    }).join('')

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Order #${order.OrderID}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
            .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .orders-table th {
            background: #f9fafb;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .document-title {
            font-size: 24px;
            color: #374151;
            margin: 10px 0;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .info-section {
            flex: 1;
          }
          .info-title {
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
          }
          .info-item {
            margin-bottom: 8px;
            display: flex;
          }
          .info-label {
            font-weight: 600;
            width: 120px;
            color: #4b5563;
          }
          .info-value {
            color: #1f2937;
          }
          .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .payment-paid { background: #d1fae5; color: #065f46; }
          .payment-unpaid { background: #fee2e2; color: #991b1b; }
          .amount {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          .print-date {
            text-align: right;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-date">Printed on: ${currentDate}</div>
        
        <div class="header">
          <div class="company-name">Ashoka Rubber Industries</div>
          <p style="font-size: 0.75rem"> <strong> DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEARRING HOSE </strong> </p>
          <p style="font-size: 0.75rem"> No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642 </p>
          <div class="document-title">Purchase Orders Report</div>
        </div>

        <div class="order-info">
          <div class="info-section">
            <div class="info-title">Order Information</div>
            <div class="info-item">
              <span class="info-label">Order ID:</span>
              <span class="info-value">#${order.OrderID}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${orderDate}</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-title">Payment Information</div>
            <div class="info-item">
              <span class="info-label">Total Amount:</span>
              <span class="info-value amount">${Number(order.TotalAmount)?.toLocaleString() || '0'} LKR</span>
            </div>
            <div class="info-item">
              <span class="info-label">Payment Status:</span>
              <span class="info-value">
                <span class="status-badge payment-${order.Status?.toLowerCase() || 'unpaid'}">${order.Status || 'Unpaid'}</span>
              </span>
            </div>
          </div>
        </div>

        <table class="orders-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderRows}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated document. No signature is required.</p>
          <p>Purchase Order #${order.OrderID} | Generated on ${currentDate}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const printAllOrders = () => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const totalOrders = filteredOrders.length;
    const paidOrders = filteredOrders.filter(order => order.PaymentStatus?.toLowerCase() === "paid").length;
    const unpaidOrders = filteredOrders.filter(order => order.PaymentStatus?.toLowerCase() === "unpaid").length;
    const totalAmount = filteredOrders.reduce((sum, order) => sum + (Number(order.TotalAmount) || 0), 0).toLocaleString();

    const ordersTableRows = filteredOrders.map(order => {
      const orderDate = new Date(order.OrderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">#${order.OrderID}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${orderDate}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${Number(order.TotalAmount)?.toLocaleString() || '0'} LKR</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <span class="status-badge payment-${order.Status?.toLowerCase() || 'unpaid'}">${order.Status || 'Unpaid'}</span>
          </td>
        </tr>
      `;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Purchase Orders Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
          }
          .document-title {
            font-size: 24px;
            color: #374151;
            margin: 10px 0;
          }
          .summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 30px;
  max-width: 210mm; /* A4 width */
  margin: 0 auto 30px auto; /* Center the grid */
}
          .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
          }
          .summary-title {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
          }
          .orders-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .orders-table th {
            background: #f9fafb;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          .payment-paid { background: #d1fae5; color: #065f46; }
          .payment-unpaid { background: #fee2e2; color: #991b1b; }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          .print-date {
            text-align: right;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 20px;
          }
          @media print {
            body { margin: 20px; }
            .summary-grid { grid-template-columns: repeat(4, 1fr); }
          }
        </style>
      </head>
      <body>
        <div class="print-date">Printed on: ${currentDate}</div>
        
        <div class="header">
          <div class="company-name">Ashoka Rubber Industries</div>
          <p style="font-size: 0.75rem"> <strong> DEALERS IN RADIATOR HOSE, AIR CLEANER HOSE, OIL HOSE AND POWER STEARRING HOSE </strong> </p>
          <p style="font-size: 0.75rem"> No. 89, Ruwanpura, Hapugasthalawa, Tel: 0776 272 994, 0779 626 642 </p>
          <div class="document-title">Purchase Orders Report</div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-title">Total Orders</div>
            <div class="summary-value">${totalOrders}</div>
          </div>
          <div class="summary-card">
            <div class="summary-title">Paid Orders</div>
            <div class="summary-value">${paidOrders}</div>
          </div>
          <div class="summary-card">
            <div class="summary-title">Unpaid Orders</div>
            <div class="summary-value">${unpaidOrders}</div>
          </div>
          <div class="summary-card">
            <div class="summary-title">Total Amount</div>
            <div class="summary-value">${totalAmount.toLocaleString()} LKR</div>
          </div>
        </div>

        <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            ${ordersTableRows}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated report. Total of ${totalOrders} orders listed.</p>
          <p>Purchase Orders Report | Generated on ${currentDate}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // const PaymentActionButtons = ({ order }) => {
  //   const currentStatus = order.Status?.toLowerCase();

  //   return (
  //     <div className="flex space-x-1">
  //       {currentStatus === "paid" && (
  //         <button
  //           className="bg-green-500 text-white rounded px-2 py-1 text-xs hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             updatePaymentStatus(order.OrderID, "paid");
  //           }}
  //           title="Mark as Paid"
  //           disabled
  //         >
  //           Paid
  //         </button>
  //       )}
  //       {currentStatus === "unpaid" && (
  //         <button
  //           className="bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             updatePaymentStatus(order, "unpaid");
  //           }}
  //           title="Mark as Unpaid"
  //         >
  //           Unpaid
  //         </button>
  //       )}
  //     </div>
  //   );
  // };

  const columns = [
    {
      name: "Order ID",
      selector: row => row.OrderID,
      sortable: true,
      style: {
        fontWeight: 600,
        color: "#1f2937",
      },
    },
    {
      name: "Order Date",
      selector: row => {
        const date = new Date(row.OrderDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
      sortable: true,
      style: {
        color: "#6b7280",
      },
    },
    {
      name: "Total Amount",
      selector: row => {
        return (
          <span className="font-semibold text-gray-800">
            {Number(row.TotalAmount).toLocaleString()} LKR
          </span>
        );
      },
      sortable: true,
      style: {
        color: "#374151",
      },
    },
    // {
    //   name: "Status",
    //   selector: row => <StatusBadge status={row.Status} />,
    //   sortable: true,
    // },
    // {
    //   name: "Payment Status",
    //   selector: row => <PaymentStatusBadge paymentStatus={row.PaymentStatus} />,
    //   sortable: true,
    //   width: "140px",
    // },
    {
      name: "Payment Actions",
      cell: row => <PaymentActionButton order={row} updatePaymentStatus={updatePaymentStatus} />,
      width: "150px",
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-1 gap-2">
          <button
            className="bg-indigo-500 text-white rounded-full p-2 hover:bg-indigo-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50"
            onClick={() => setOpenModal(row)}
            title="View Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            className="bg-purple-500 text-white rounded-full p-2 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              printOrder(row);
            }}
            title="Print Order"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
          {/* <button
            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              deletePurchaseOrder(row);
            }}
            title="Delete"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button> */}
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Orders</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track all purchase orders and payment status in one place
              </p>
            </div>
            <button
              onClick={() => setOrderAddModal(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Purchase Order
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search orders by ID, status, or payment status"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filter Dropdown */}
              {/* <div className="min-w-[150px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div> */}

              {/* Payment Status Filter Dropdown */}
              <div className="min-w-[150px]">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Payments</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("");
                    setPaymentFilter("");
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  title="Clear all filters"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                <button
                  onClick={loadpurchaseOrdersData}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  onClick={printAllOrders}
                  className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter || paymentFilter || searchQuery) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {statusFilter}
                    <button
                      onClick={() => setStatusFilter("")}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {paymentFilter && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Payment: {paymentFilter === "not-set" ? "Not Set" : paymentFilter}
                    <button
                      onClick={() => setPaymentFilter("")}
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredOrders}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              pagination
              onRowClicked={(row) => setOpenModal(row)}
              progressPending={isLoading}
              progressComponent={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              noDataComponent={
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-500">No orders found</p>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or create a new order</p>
                </div>
              }
            />
          </div>

          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">{purchaseOrders.length}</h3>
                </div>
              </div>
            </div>

            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {purchaseOrders.filter(order => order.Status?.toLowerCase() === "completed").length}
                  </h3>
                </div>
              </div>
            </div> */}

            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {purchaseOrders.filter(order => order.Status?.toLowerCase() === "pending").length}
                  </h3>
                </div>
              </div>
            </div> */}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Paid Orders</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {purchaseOrders.filter(order => order.Status?.toLowerCase() === "paid").length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Unpaid Orders</p>
                  <h3 className="mt-1 text-xl font-semibold text-gray-900">
                    {purchaseOrders.filter(order => order.Status?.toLowerCase() === "unpaid").length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <PurchaseOrderInfoModal setOpenModal={setOpenModal} purchaseOrderInfo={openModal} />
      )}

      {openCategoryUpdateModal && (
        <CategoryEditModal />
      )}

      {openOrderModal && (
        <OrderAddModal setOpenModal={setOrderAddModal} loadPurchaseOrders={loadpurchaseOrdersData} />
      )}
    </>
  );
}

export default ManagePurchaseOrders;