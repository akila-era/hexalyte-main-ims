import React, { useState, useRef, useMemo, useEffect } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import {
  Upload,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Edit,
  Trash2,
  Save,
  RefreshCw,
} from "lucide-react";
import EditNewOrderModal from "components/Modal/EditNewOrderModal";
import { createAxiosInstance } from "../../api/axiosInstance";
import Swal from "sweetalert2";

const BulkUploadComponent = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, processing, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [extractedData, setExtractedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const fileInputRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [productNames, setProductNames] = useState([]);
  const [productIndex, setProductIndex] = useState({});
  const [users, setUsers] = useState([]);

  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [loadAllDataMode, setLoadAllDataMode] = useState(false);
  const [allOrdersData, setAllOrdersData] = useState([]);
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);

  // Product selection modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentRowForSelection, setCurrentRowForSelection] = useState(null);
  const [productSearchResults, setProductSearchResults] = useState({ exactMatches: [], partialMatches: [] });
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  const acceptedExtensions = [".csv", ".xls", ".xlsx"];

  const expectedColumns = ["No", "CustomerName", "MobileNo1", "MobileNo2", "City", "Product", "Remark"];

  const parseCSV = (text) => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map(v => v.trim().replace(/"/g, ""));
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });
        row.id = i;
        data.push(row);
      }
    }

    return { headers, data };
  };

  const parseExcel = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!json || json.length === 0) {
      return { headers: [], data: [] };
    }

    const headers = Object.keys(json[0]);
    const data = json.map((row, idx) => ({ ...row, id: idx + 1 }));
    return { headers, data };
  };

  const processFile = async (file) => {
    setUploadStatus("processing");
    setErrorMessage("");

    try {
      let result;
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();

      if (fileExtension === ".csv") {
        const text = await file.text();
        result = parseCSV(text);
      } else {
        result = await parseExcel(file);
      }

      const errors = validateData(result.data, result.headers);
      setValidationErrors(errors);

      const enriched = autoMatchProducts(result.data);

      setExtractedData(enriched);
      setOriginalData(enriched);
      setUploadStatus("success");

    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error.message || "Failed to process file. Please check the file format.");
    }
  };

  const validateData = (data, headers) => {
    const errors = [];

    const missingColumns = expectedColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      errors.push(`Missing required columns: ${missingColumns.join(", ")}`);
    }

    data.forEach((row, index) => {
      const rowNum = index + 2;
      if (!row.CustomerName || row.CustomerName.trim() === "") {
        errors.push(`Row ${rowNum}: Customer Name is required`);
      }
      if (!row.Product || row.Product.trim() === "") {
        errors.push(`Row ${rowNum}: Product Name is required`);
      }
      const qty = Number(row.Quantity || 1);
      if (Number.isNaN(qty) || qty <= 0) {
        errors.push(`Row ${rowNum}: Quantity must be a positive number`);
      }
      const discount = Number(row.Discount || 0);
      if (Number.isNaN(discount) || discount < 0) {
        errors.push(`Row ${rowNum}: Discount must be a non-negative number`);
      }
    });

    return errors.slice(0, 10);
  };

  useEffect(() => {
    const index = {};
    productNames.forEach(p => {
      if (!p || !p.Name) return;
      index[p.Name.trim().toLowerCase()] = p;
    });
    setProductIndex(index);
  }, [productNames]);

  function autoMatchProducts(rows) {
    return rows.map((row) => computeRow({
      ...row,
      Quantity: Number(row.Quantity) || 1,
      Discount: Number(row.Discount) || 0,
      MatchedProductID: (() => {
        const key = (row.Product || "").trim().toLowerCase();
        const match = key ? productIndex[key] : undefined;
        return match ? match.ProductID : null;
      })(),
      MatchedProductName: (() => {
        const key = (row.Product || "").trim().toLowerCase();
        const match = key ? productIndex[key] : undefined;
        return match ? match.Name : null;
      })(),
      MatchedProductSellingPrice: (() => {
        const key = (row.Product || "").trim().toLowerCase();
        const match = key ? productIndex[key] : undefined;
        return match ? Number(match.SellingPrice || 0) : 0;
      })(),
      MatchStatus: (() => {
        const key = (row.Product || "").trim().toLowerCase();
        return productIndex[key] ? "MATCHED" : "UNMATCHED";
      })(),
      CallStatus: row.CallStatus || "Not Called",
      OrderStatus: row.OrderStatus || "Pending",
      CustomerID: row.CustomerID || null,
      CustomerLabel: row.CustomerLabel || "",
    }));
  }

  function computeRow(row) {
    const unit = Number(row.MatchedProductSellingPrice || 0);
    const qty = Number(row.Quantity || 0);
    const discount = Number(row.Discount || 0);
    const subtotal = unit * qty;
    const total = Math.max(0, subtotal - discount);
    return { ...row, UnitPrice: unit, TotalPrice: total };
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    processFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData([]);
    setOriginalData([]);
    setAllOrdersData([]);
    setUploadStatus("idle");
    setErrorMessage("");
    setValidationErrors([]);
    setSearchTerm("");
    setPasteText("");
    setLoadAllDataMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitData = async () => {
    try {
      // Check if we're in Load All Data mode (updating existing orders)
      if (loadAllDataMode) {
        return await handleUpdateExistingOrders();
      }

      // Original bulk upload logic for new orders
      const unmatched = extractedData.filter(r => r.MatchStatus !== "MATCHED");
      if (unmatched.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Unmatched Products",
          html: `There are ${unmatched.length} rows with unknown products. Please select products for all rows before submitting.`,
        });
        return;
      }

      const invalidQty = extractedData.some(r => !r.Quantity || Number(r.Quantity) <= 0);
      if (invalidQty) {
        Swal.fire({ icon: "error", title: "Invalid Quantity", text: "All quantities must be positive numbers." });
        return;
      }

      Swal.fire({
        title: "Uploading Orders...",
        text: "Please wait while we process your bulk orders",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = extractedData.map(r => ({
        No: r.No,
        CustomerName: r.CustomerName,
        Address: r.Address,
        MobileNo1: r.MobileNo1,
        MobileNo2: r.MobileNo2 || null,
        City: r.City,
        Product: r.MatchedProductName || r.Product,
        Remark: r.Remark || null,
        CallerAgent: r.CallerAgent || null,
        Quantity: Number(r.Quantity) || 1,
        UnitPrice: Number(r.UnitPrice) || 0,
        Discount: Number(r.Discount) || 0,
        TotalPrice: Number(r.TotalPrice) || 0,
        AssignedUserID: r.AssignedUserID || null,
        CallStatus: r.CallStatus || "Not Called",
        OrderStatus: r.OrderStatus || "Pending",
      }));

      const api = createAxiosInstance();
      const response = await api.post("neworder/add/bulk", payload);

      Swal.close();
      showBulkUploadResult(response);
      handleReset();

    } catch (e) {
      Swal.close();
      showApiErrorAlert(e);
    }
  };

  const handleUpdateExistingOrders = async () => {
    try {
      Swal.fire({
        title: "Updating Orders...",
        text: "Please wait while we update the order statuses",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      const api = createAxiosInstance();
      const updatedOrders = [];
      const errors = [];

      // Update each order individually
      for (const row of extractedData) {
        if (row.NewOrderID) {
          try {
            // Update order status and call status
            await api.put(`/neworder/${row.NewOrderID}`, {
              CallStatus: row.CallStatus,
              Status: row.OrderStatus,
            });
            updatedOrders.push(row.NewOrderID);
          } catch (error) {
            console.error(`Error updating order ${row.NewOrderID}:`, error);
            errors.push(`Order ${row.NewOrderID}: ${error.response?.data?.message || 'Update failed'}`);
          }
        }
      }

      Swal.close();

      if (errors.length === 0) {
        Swal.fire({
          icon: "success",
          title: "Orders Updated Successfully!",
          html: `
            <div style="text-align: center; margin: 20px 0;">
              <div style="font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 10px;">
                ${updatedOrders.length}
              </div>
              <div style="color: #6c757d;">Orders Updated</div>
            </div>
          `,
          confirmButtonText: "Great!",
          confirmButtonColor: "#28a745",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Partial Update",
          html: `
            <div style="margin-bottom: 15px;">
              <strong>Updated:</strong> ${updatedOrders.length} orders<br>
              <strong>Errors:</strong> ${errors.length} orders
            </div>
            <div style="background: #f8d7da; padding: 10px; border-radius: 5px; font-size: 12px; text-align: left;">
              ${errors.slice(0, 5).join('<br>')}
              ${errors.length > 5 ? '<br>...and more' : ''}
            </div>
          `,
          confirmButtonText: "OK",
        });
      }

    } catch (e) {
      Swal.close();
      showApiErrorAlert(e);
    }
  };

  function showBulkUploadResult(response) {
    const result = response.data.bulkOrders;
    const totalErrors = result.summary?.totalErrors || 0;

    if (result.success && totalErrors === 0) {
      showPureSuccessAlert(result);
    } else if (result.success && totalErrors > 0) {
      showMixedResultAlert(result);
    } else {
      showErrorAlert(result);
    }

    function showPureSuccessAlert(result) {
      const htmlContent = `
        <div class="custom-swal-content">
            <div style="background: #f0fff4; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 15px;">
                <h3 style="color: #28a745; margin-top: 0;">🎉 Upload Completed Successfully!</h3>
                <p>All orders have been processed without any errors.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary.totalSuccessful}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Orders Processed</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary.newOrdersCreated}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">New Orders Created</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary.orderItemsAdded}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Items Added</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${result.summary.totalErrors}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Errors</div>
                </div>
            </div>
        </div>
    `;

      Swal.fire({
        icon: "success",
        title: "Bulk Upload Successful!",
        html: htmlContent,
        confirmButtonText: "Great!",
        confirmButtonColor: "#28a745",
        width: "600px",
        showCloseButton: true,
      });
    }

    function showErrorAlert(result) {
      const allErrors = [
        ...(result.validationErrors || []).map(err => typeof err === 'string' ? err : `Row ${err.row}: ${err.message} (Field: ${err.field})`),
        ...(result.processingErrors || []).map(err => typeof err === 'string' ? err : `Row ${err.row}: ${err.message}`),
      ];

      const htmlContent = `
        <div class="custom-swal-content">
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 15px;">
                <h3 style="color: #721c24; margin-top: 0;">❌ Upload Failed</h3>
                <p>Several errors were encountered during the upload process.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary?.totalSuccessful || 0}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Successful</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${result.summary?.totalErrors || 0}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Errors</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary?.newOrdersCreated || 0}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Orders Created</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">${result.totalProcessed || 0}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Total Processed</div>
                </div>
            </div>

            <div style="max-height: 200px; overflow-y: auto; margin-top: 15px; padding: 10px; background: #fff5f5; border-radius: 8px; border-left: 4px solid #dc3545;">
                <strong>Errors Found:</strong>
                ${allErrors.map(error => `<div style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">❌ ${error}</div>`).join("")}
            </div>
        </div>
    `;

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        html: htmlContent,
        confirmButtonText: "Fix Issues",
        confirmButtonColor: "#dc3545",
        width: "650px",
        showCloseButton: true,
      });
    }

    function showMixedResultAlert(result) {
      const allErrors = [
        ...(result.validationErrors || []).map(err => typeof err === 'string' ? err : `Row ${err.row}: ${err.message} (${err.field})`),
        ...(result.processingErrors || []).map(err => typeof err === 'string' ? err : `Row ${err.row}: ${err.message}`),
      ];

      const htmlContent = `
        <div class="custom-swal-content">
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
                <h3 style="color: #856404; margin-top: 0;">⚠️ Upload Completed with Warnings</h3>
                <p>Most orders were processed successfully, but some rows had issues.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary.totalSuccessful}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Successful</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${result.summary.totalErrors}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Errors</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${result.summary.newOrdersCreated}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Orders Created</div>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">${result.totalProcessed}</div>
                    <div style="font-size: 12px; color: #6c757d; margin-top: 5px;">Total Processed</div>
                </div>
            </div>

            ${allErrors.length > 0 ? `
                <div style="max-height: 200px; overflow-y: auto; margin-top: 15px; padding: 10px; background: #fff5f5; border-radius: 8px; border-left: 4px solid #dc3545;">
                    <strong>Issues Found:</strong>
                    ${allErrors.map(error => `<div style="margin: 8px 0; padding: 8px; background: white; border-radius: 4px; font-size: 14px;">❌ ${error}</div>`).join("")}
                </div>
            ` : ""}
        </div>
    `;

      Swal.fire({
        icon: "warning",
        title: "Upload Completed with Issues",
        html: htmlContent,
        confirmButtonText: "Understood",
        confirmButtonColor: "#ffc107",
        width: "650px",
        showCloseButton: true,
      });
    }

  }

  function showApiErrorAlert(error) {
    let errorMessage = 'An unexpected error occurred during upload.';
    let errorDetails = '';

    if (error.response) {
      errorMessage = `Upload failed (${error.response.status})`;
      errorDetails = error.response.data?.message || error.response.statusText || '';
    } else if (error.request) {
      errorMessage = 'Network error - unable to reach server';
      errorDetails = 'Please check your internet connection and try again.';
    } else {
      errorMessage = 'Upload failed';
      errorDetails = error.message || 'Unknown error occurred';
    }

    Swal.fire({
      icon: 'error',
      title: 'Upload Failed',
      html: `
            <div style="text-align: left;">
                <p><strong>Error:</strong> ${errorMessage}</p>
                ${errorDetails ? `<p><strong>Details:</strong> ${errorDetails}</p>` : ''}
                <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin-top: 15px;">
                    <p style="margin: 0;"><strong>What you can do:</strong></p>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Check your file format and try again</li>
                        <li>Verify your internet connection</li>
                        <li>Contact support if the issue persists</li>
                    </ul>
                </div>
            </div>
        `,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc3545',
      showCloseButton: true,
      width: '500px'
    });
  }

  const handleDownloadTemplate = () => {
    const csvContent = expectedColumns.join(",") + "\n" +
      "1,John Doe,0771234567,,Colombo,Wireless Headphones,Please call after 5 PM\n" +
      "2,Jane Smith,0772345678,0719876543,Kandy,Smartphone Case,Leave at reception";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_upload_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleView = (row) => {
    alert(`Viewing record: ${JSON.stringify(row, null, 2)}`);
  };

  const handleEdit = (row) => {
    setIsEditModalOpen(row);
  };

  const handleDelete = (rowId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedData = extractedData.filter(row => row.id !== rowId);
      setExtractedData(updatedData);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "Called – Confirmed": "bg-green-100 text-green-800",
      "Called – Rejected": "bg-red-100 text-red-800",
      "Follow-up Required": "bg-yellow-100 text-yellow-800",
      "Pending Call": "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = useMemo(() => [
    {
      name: "No",
      selector: row => row.No || "",
      sortable: true,
      width: "60px",
    },
    {
      name: "Customer Name",
      selector: row => row.CustomerName || "",
      sortable: true,
      width: "150px",
    },
    {
      name: "Mobile No 1",
      selector: row => row.MobileNo1 || "",
      sortable: true,
      width: "120px",
    },
    {
      name: "City",
      selector: row => row.City || "",
      sortable: true,
      width: "100px",
    },
    {
      name: "Product",
      selector: row => row.MatchedProductName || row.Product || "",
      width: "250px",
      cell: row => (
        <div className="flex flex-col gap-1 w-full">
          <div className="text-sm font-medium">
            {row.Product}
          </div>
          <div className="flex items-center gap-2">
            <div className={`text-xs px-2 py-0.5 rounded-full ${row.MatchStatus === "MATCHED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {row.MatchStatus === "MATCHED" ? "Matched" : "Unmatched"}
            </div>
            {row.MatchStatus === "MATCHED" ? (
              <span className="text-xs text-green-600">{row.MatchedProductName}</span>
            ) : (
              <button
                onClick={() => openProductSelectionModal(row)}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Select Product
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Qty",
      width: "80px",
      cell: row => (
        <input
          type="number"
          min={1}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
          value={row.Quantity}
          onChange={(e) => {
            const qty = Math.max(1, Number(e.target.value || 1));
            setExtractedData(prev => prev.map(r => r.id === row.id ? computeRow({ ...r, Quantity: qty }) : r));
          }}
        />
      ),
      sortable: true,
    },
    {
      name: "Unit Price",
      width: "100px",
      selector: row => row.UnitPrice?.toFixed ? row.UnitPrice.toFixed(2) : row.UnitPrice || 0,
    },
    {
      name: "Discount",
      width: "100px",
      cell: row => (
        <input
          type="number"
          min={0}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
          value={row.Discount}
          onChange={(e) => {
            const disc = Math.max(0, Number(e.target.value || 0));
            setExtractedData(prev => prev.map(r => r.id === row.id ? computeRow({ ...r, Discount: disc }) : r));
          }}
        />
      ),
    },
    {
      name: "Total",
      width: "100px",
      selector: row => row.TotalPrice?.toFixed ? row.TotalPrice.toFixed(2) : row.TotalPrice || 0,
    },
    {
      name: "Assigned Staff",
      width: "200px",
      cell: row => (
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
          value={row.AssignedUserID || ""}
          onChange={(e) => {
            const id = e.target.value ? Number(e.target.value) : null;
            const selected = users.find(u => u.id === id);
            console.log(`Updating AssignedUser for row ${row.id} to user:`, selected);
            setExtractedData(prev => prev.map(r => r.id === row.id ? { 
              ...r, 
              AssignedUserID: id, 
              AssignedUserLabel: selected ? `${selected.firstname} ${selected.lastname}` : "",
              CallerAgent: selected ? selected.username : ""
            } : r));
          }}
        >
          <option value="">Select staff member</option>
          {users.length === 0 && <option disabled>Loading staff...</option>}
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.firstname} {u.lastname} ({u.username}) - {u.role}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Call",
      width: "60px",
      cell: row => (
        <a
          href={row.MobileNo1 ? `tel:${row.MobileNo1}` : undefined}
          className={`px-2 py-1 rounded text-white text-xs ${row.MobileNo1 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
          onClick={(e) => { if (!row.MobileNo1) e.preventDefault(); }}
        >
          Call
        </a>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Call Status",
      width: "150px",
      cell: row => (
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
          value={row.CallStatus || "Not Called"}
          onChange={(e) => {
            const value = e.target.value;
            console.log(`Updating CallStatus for row ${row.id} from "${row.CallStatus}" to "${value}"`);
            setExtractedData(prev => prev.map(r => r.id === row.id ? { ...r, CallStatus: value } : r));
          }}
        >
          <option value="Not Called">Not Called</option>
          <option value="Called">Called</option>
          <option value="Answered">Answered</option>
          <option value="No Answer">No Answer</option>
          <option value="Busy">Busy</option>
          <option value="Wrong Number">Wrong Number</option>
          <option value="Callback Requested">Callback Requested</option>
        </select>
      ),
    },
    {
      name: "Order Status",
      width: "150px",
      cell: row => (
        <select
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm bg-white"
          value={row.OrderStatus || "Pending"}
          onChange={(e) => {
            const value = e.target.value;
            console.log(`Updating OrderStatus for row ${row.id} from "${row.OrderStatus}" to "${value}"`);
            setExtractedData(prev => prev.map(r => r.id === row.id ? { ...r, OrderStatus: value } : r));
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      name: "Remark",
      width: "150px",
      selector: row => row.Remark || "",
      sortable: true,
    },
    {
      name: "Actions",
      width: "120px",
      cell: row => (
        <div className="flex gap-1">
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-900 transition-colors p-1"
            title="View"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-green-600 hover:text-green-900 transition-colors p-1"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-900 transition-colors p-1"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: "true",
    },
  ], [extractedData, users, productNames]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return extractedData;

    return extractedData.filter(row =>
      Object.values(row).some(value =>
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [extractedData, searchTerm]);

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
        },
      },
      stripedStyle: {
        backgroundColor: "#f9fafb",
      },
    },
  };

  async function fetchProducts() {
    try {

      const api = createAxiosInstance();
      const response = await api.get("/product");

      if (response.status === 200) {
        setProductNames(response.data.allProducts);
      }

    } catch (e) {
      console.log(e);
    }
  }

  async function fetchUsers() {
    try {
      const api = createAxiosInstance();
      const response = await api.get("/user");
      console.log("User API response:", response.data);
      if (response.status === 200) {
        const userData = response.data.users || [];
        console.log("Setting users:", userData);
        setUsers(userData);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  }

  async function searchProductsByName(productName) {
    if (!productName || !productName.trim()) {
      setProductSearchResults({ exactMatches: [], partialMatches: [] });
      return;
    }

    setIsSearchingProducts(true);
    try {
      const api = createAxiosInstance();
      const response = await api.get(`/product/search?name=${encodeURIComponent(productName.trim())}`);
      
      if (response.status === 200) {
        setProductSearchResults({
          exactMatches: response.data.exactMatches || [],
          partialMatches: response.data.partialMatches || []
        });
      }
    } catch (e) {
      console.error("Error searching products:", e);
      setProductSearchResults({ exactMatches: [], partialMatches: [] });
    } finally {
      setIsSearchingProducts(false);
    }
  }

  function openProductSelectionModal(row) {
    setCurrentRowForSelection(row);
    setShowProductModal(true);
    // Search for products matching the current product name
    searchProductsByName(row.Product);
  }

  function selectProductForRow(selectedProduct) {
    if (!currentRowForSelection || !selectedProduct) return;

    // Update the row with selected product
    setExtractedData(prev => prev.map(r => 
      r.id === currentRowForSelection.id ? computeRow({
        ...r,
        MatchedProductID: selectedProduct.ProductID,
        MatchedProductName: selectedProduct.Name,
        MatchedProductSellingPrice: Number(selectedProduct.SellingPrice || 0),
        MatchStatus: "MATCHED",
        UnitPrice: Number(selectedProduct.SellingPrice || 0)
      }) : r
    ));

    // Close modal
    setShowProductModal(false);
    setCurrentRowForSelection(null);
    setProductSearchResults({ exactMatches: [], partialMatches: [] });
  }

  async function loadAllData() {
    setIsLoadingAllData(true);
    try {
      const api = createAxiosInstance();
      
      // Fetch all orders, products, and users simultaneously
      const [ordersResponse, productsResponse, usersResponse] = await Promise.all([
        api.get("/neworder"),
        api.get("/product"),
        api.get("/user")
      ]);

      // Transform orders data to match our bulk upload format
      const orders = ordersResponse.data.data || [];
      const products = productsResponse.data.allProducts || [];
      const users = usersResponse.data.users || [];

      // Create enriched order data
      const enrichedOrders = orders.map((order, idx) => {
        const assignedUser = users.find(u => u.firstname === order.CallerAgent || u.username === order.CallerAgent);
        return computeRow({
          id: idx + 1,
          NewOrderID: order.NewOrderID, // Add the original order ID for updates
          No: String(idx + 1),
          CustomerName: order.CustomerName || "",
          MobileNo1: order.PrimaryPhone || "",
          MobileNo2: order.SecondaryPhone || "",
          City: order.CityName || "",
          Product: "Various Products", // Orders may have multiple items
          Remark: order.Remark || "",
          CallerAgent: order.CallerAgent || "",
          Address: order.CustomerAddress || "",
          Quantity: 1,
          Discount: 0,
          MatchedProductID: null,
          MatchedProductName: "Various Products",
          MatchedProductSellingPrice: 0,
          MatchStatus: "MATCHED",
          CallStatus: order.CallStatus || "Not Called",
          OrderStatus: order.Status || "Pending",
          AssignedUserID: assignedUser ? assignedUser.id : null,
          AssignedUserLabel: assignedUser ? `${assignedUser.firstname} ${assignedUser.lastname}` : "",
          UnitPrice: 0,
          TotalPrice: 0,
        });
      });

      setAllOrdersData(enrichedOrders);
      setExtractedData(enrichedOrders);
      setOriginalData(enrichedOrders);
      setUploadStatus("success");
      setLoadAllDataMode(true);

      Swal.fire({
        icon: "success",
        title: "Data Loaded Successfully!",
        text: `Loaded ${enrichedOrders.length} orders, ${products.length} products, and ${users.length} staff users.`,
        timer: 3000,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Error loading all data:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Data",
        text: "There was an error loading the system data. Please try again.",
      });
    } finally {
      setIsLoadingAllData(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div className="w-full px-4">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="py-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">New Orders - Bulk Add</h1>
                  <p className="text-gray-600 mt-1">Upload CSV or Excel to bulk add new orders. Match products, call customers, and set call status before submission.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Download size={16} />
                    Download Template
                  </button>
                  <button
                    onClick={loadAllData}
                    disabled={isLoadingAllData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
                  >
                    {isLoadingAllData ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FileText size={16} />
                    )}
                    {isLoadingAllData ? "Loading..." : "Load All Data"}
                  </button>
                  {extractedData.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <RefreshCw size={16} />
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {uploadStatus === "idle" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <input id="pasteMode" type="checkbox" checked={pasteMode} onChange={(e) => setPasteMode(e.target.checked)} />
                    <label htmlFor="pasteMode" className="text-sm text-gray-700">Paste product names instead</label>
                  </div>
                </div>

                {!pasteMode && (
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="text-center">
                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div className="text-lg text-gray-600 mb-2">
                                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                                Click to upload
                                            </span>
                      {" "}or drag and drop
                    </div>
                    <p className="text-sm text-gray-500">
                        CSV/XLS/XLSX up to 50MB
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Expected columns: {expectedColumns.join(", ")}
                    </p>
                  </div>
                </div>
                )}

                {pasteMode && (
                  <div className="space-y-3">
                    <textarea
                      className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Paste product names, one per line"
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          const lines = pasteText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
                          if (!lines.length) return;
                          const rows = lines.map((name, idx) => ({
                            id: idx + 1,
                            No: String(idx + 1),
                            CustomerName: "",
                            MobileNo1: "",
                            MobileNo2: "",
                            City: "",
                            Product: name,
                            Remark: "",
                            CallerAgent: "",
                            Quantity: 1,
                            Discount: 0,
                          }));
                          const enriched = autoMatchProducts(rows);
                          setExtractedData(enriched);
                          setOriginalData(enriched);
                          setUploadStatus("success");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Validate Products
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadStatus === "processing" && (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Validating products...</p>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Upload Error</p>
                      <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {uploadStatus === "success" && extractedData.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {loadAllDataMode ? "System Data" : (selectedFile?.name || "Pasted Products")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {extractedData.length} {loadAllDataMode ? "orders" : "records"} found
                        {users.length > 0 && ` • ${users.length} staff users loaded`}
                      </p>
                      {extractedData.some(r => r.MatchStatus !== "MATCHED") && (
                        <p className="text-xs mt-1">
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                            {extractedData.filter(r => r.MatchStatus !== "MATCHED").length} unmatched product(s)
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSubmitData}
                      disabled={validationErrors.length > 0 || uploadStatus === "processing" || extractedData.some(r => r.MatchStatus !== "MATCHED")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Save size={16} />
                      {uploadStatus === "processing" ? "Submitting..." : "Save & Submit"}
                    </button>
                  </div>
                </div>

                {validationErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Data Validation Issues</p>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                        {validationErrors.length >= 10 && (
                          <p className="text-xs text-yellow-600 mt-2">Showing first 10 errors...</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 50, 100]}
                  highlightOnHover
                  striped
                  responsive
                  fixedHeader
                  fixedHeaderScrollHeight="600px"
                  customStyles={customStyles}
                  noDataComponent={
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-lg font-medium">No data found</div>
                      <div className="text-sm">Try adjusting your search criteria</div>
                    </div>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <EditNewOrderModal
        isOpen={isEditModalOpen !== false}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        orderData={isEditModalOpen}
        extractedData={extractedData}
        setExtractedData={setExtractedData}
        setOriginalData={setOriginalData}
      />

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Select Product</h3>
                  <p className="text-sm text-gray-600">
                    Searching for: <span className="font-medium">{currentRowForSelection?.Product}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setCurrentRowForSelection(null);
                    setProductSearchResults({ exactMatches: [], partialMatches: [] });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isSearchingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">Searching products...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Exact Matches */}
                  {productSearchResults.exactMatches.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-green-700 mb-3 flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        Exact Matches ({productSearchResults.exactMatches.length})
                      </h4>
                      <div className="grid gap-2">
                        {productSearchResults.exactMatches.map(product => (
                          <div
                            key={product.ProductID}
                            className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer"
                            onClick={() => selectProductForRow(product)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3 h-4 w-4 text-green-600"
                                onChange={() => selectProductForRow(product)}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{product.Name}</div>
                                <div className="text-sm text-gray-500">
                                  Category: {product.category?.CategoryName || 'N/A'} | 
                                  Supplier: {product.supplier?.Name || 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-700">₹{product.SellingPrice}</div>
                              <div className="text-xs text-gray-500">ID: {product.ProductID}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Partial Matches */}
                  {productSearchResults.partialMatches.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Similar Products ({productSearchResults.partialMatches.length})
                      </h4>
                      <div className="grid gap-2">
                        {productSearchResults.partialMatches.map(product => (
                          <div
                            key={product.ProductID}
                            className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer"
                            onClick={() => selectProductForRow(product)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3 h-4 w-4 text-blue-600"
                                onChange={() => selectProductForRow(product)}
                              />
                              <div>
                                <div className="font-medium text-gray-900">{product.Name}</div>
                                <div className="text-sm text-gray-500">
                                  Category: {product.category?.CategoryName || 'N/A'} | 
                                  Supplier: {product.supplier?.Name || 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-blue-700">₹{product.SellingPrice}</div>
                              <div className="text-xs text-gray-500">ID: {product.ProductID}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {!isSearchingProducts && productSearchResults.exactMatches.length === 0 && productSearchResults.partialMatches.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h4>
                      <p className="text-gray-600">
                        No products match "{currentRowForSelection?.Product}". 
                        Please check the product name or contact your administrator to add this product.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setCurrentRowForSelection(null);
                    setProductSearchResults({ exactMatches: [], partialMatches: [] });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BulkUploadComponent;