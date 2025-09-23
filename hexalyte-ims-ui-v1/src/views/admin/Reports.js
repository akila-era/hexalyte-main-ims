import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import checkToken from "../../api/checkToken";
import handleUserLogout from "../../api/logout";
import axios from "axios";
import { createAxiosInstance } from "api/axiosInstance";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("profit");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [warehouses, setWarehouses] = useState([]);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);

  const [productSalesData, setProductSalesData] = useState([])
  const [totalDiscounts, setTotalDiscounts] = useState([])

  const [stockReportData, setStockReportData] = useState([])

  const { setAuth } = useAuth();
  const history = useHistory();

  // Report types with descriptions
  const reportTypes = [
    // {
    //   id: "stock",
    //   name: "Stock Report",
    //   description:
    //     "Current stock levels, low stock alerts, and inventory valuation",
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       className="h-6 w-6"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       stroke="currentColor"
    //     >
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         strokeWidth={2}
    //         d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    //       />
    //     </svg>
    //   ),
    // },
    // {
    //     id: "movement",
    //     name: "Inventory Movement",
    //     description: "Track inventory receipts, transfers, and issues over time",
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    //         </svg>
    //     )
    // },
    // {
    //     id: "turnover",
    //     name: "Inventory Turnover",
    //     description: "Analysis of inventory turnover rates by product and warehouse",
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    //         </svg>
    //     )
    // },
    {
      id: "profit",
      name: "Sales & Earnings",
      description:
        "Space utilization, capacity analysis, and efficiency metrics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    // {
    //     id: "forecast",
    //     name: "Demand Forecast",
    //     description: "Predictive analysis for inventory needs based on historical data",
    //     icon: (
    //         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //         </svg>
    //     )
    // }
  ];

  async function loadWarehouses() {
    try {
      // const warehouseLocations = await axios.get(`${BASE_URL}location`, { withCredentials: true });
      const api = createAxiosInstance();
      const warehouseLocations = await api.get(`location`);
      setWarehouses(() => [...warehouseLocations.data.locations]);
    } catch (error) {
      if (
        error.status === 404 &&
        error.response.data.message === "no location found"
      ) {
        console.log("no location found");
      } else {
        console.log(error);
      }

      if (
        error.status === 500 &&
        error.response?.data?.error.includes("Please authenticate")
      ) {
        sessionStorage.clear();
        history.push("/auth/login");
      }
    }
  }

  // async function fetchStockReportData() {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     const params = {
  //       startDate: dateRange.startDate,
  //       endDate: dateRange.endDate,
  //       locationId: selectedWarehouse === "all" ? undefined : selectedWarehouse,
  //     };

  //     console.log("Feting stock data with params: ", params);

  //     // const response = await axios.get(
  //     //     `${BASE_URL}productstorage`,{
  //     //     params,
  //     //     withCredentials : true,
  //     // });

  //     const api = createAxiosInstance();
  //     const response = await api.get("productstorage", { params });

  //     let stockData = response.data;
  //     console.log("Final Stock Report Data: ", stockData);
  //     setReportData(stockData);

  //     if (dateRange.startDate && dateRange.endDate) {
  //       console.log("Feting stock data with params: ", params);

  //       // const transactionResponse = await axios.get(`${BASE_URL}transaction`,
  //       //     {
  //       //         params,
  //       //         withCredentials: true,
  //       //     }
  //       // );
  //       // const transactions = transactionResponse.data;
  //       // console.log("Transaction Data:", transactions);

  //       //                     stockData = stockData.map((item) => {
  //       //                         const relevantTransactions = transactions.filter(
  //       //                             (t) =>
  //       //                                 t.productId === item.productId &&
  //       //                             t.locationId === item.locationId &&
  //       //                             new Date(t.date) >= new Date(dateRange.startDate) &&
  //       //                             new Date(t.date) <= new Date(dateRange.endDate)
  //       //                         );
  //       //                         console.log(`Relevant transactions for product ${item.productId}:`, relevantTransactions);
  //       //                         const stockAdujstment = relevantTransactions.reduce((acc, t) => {
  //       //                             if(t.transactionType === "RECEIPT"){
  //       //                                 return acc + t.quantity;
  //       //                             }else if(t.transactionType === "ISSUE" || t.transactionType === "TRANSFER_OUT"){
  //       //                                 return acc - t.quantity;
  //       //                             }
  //       //                             return acc;
  //       //                         },0);
  //       // console.log(`Stock adjustment for product ${item.productId}:`, stockAdujstment);
  //       //                         return {
  //       //                             ...item,
  //       //                             currentStock: item.Quantity + stockAdujstment,
  //       //                             belowReorder: item.Quantity + stockAdujstment < (item.reorderLevel || 0),
  //       //                         };
  //       //                     });
  //     }
  //     console.log("Final Stock Report Data:", stockData);
  //     setReportData(stockData);
  //   } catch (error) {
  //     if (
  //       error.response?.status === 500 &&
  //       error.response?.data?.error.includes("Please Authenticate")
  //     ) {
  //       handleUserLogout()
  //         .then(() => setAuth(false))
  //         .then(() => history.push("/auth/login"));
  //     } else {
  //       setError("Failed to generate stock report. Please try again");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }
  async function fetchStockReportData() {
    setIsLoading(true);
    setError(null);

    // try {
    //   const locationId =
    //     selectedWarehouse === "all" ? "all" : selectedWarehouse;
    //   console.log("Fetching stock report for locationId:", locationId); // Debug selected warehouse
    //   const api = createAxiosInstance();
    //   const response = await api.get(`productstorage/report/warehouse/${locationId}`, {
    //     headers: { "Cache-Control": "no-cache" },
    //   });

    //   console.log("API Response:", JSON.stringify(response.data, null, 2)); // Pretty-print response
    //   const stockData = Array.isArray(response.data?.data)
    //     ? response.data.data
    //     : [];
    //   console.log("Final Stock Report Data:", stockData);
    //   setReportData(stockData);
    //   if (stockData.length === 0) {
    //     setError(
    //       `No stock data found for warehouse ${locationId === "all" ? "all" : locationId
    //       }.`
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error fetching stock report:", error);
    //   if (
    //     error.response?.status === 500 &&
    //     error.response?.data?.error?.includes("Please Authenticate")
    //   ) {
    //     handleUserLogout()
    //       .then(() => setAuth(false))
    //       .then(() => history.push("/auth/login"));
    //   } else {
    //     setError(
    //       error.response?.data?.message || "Failed to generate stock report."
    //     );
    //     setReportData([]);
    //   }
    // } finally {
    //   setIsLoading(false);
    // }

    try {

      if (selectedWarehouse === "all") {
        setError("Select a warehouse")
        setIsLoading(false)
        return
      }

      const api = createAxiosInstance()
      const response = await api.get(`productstorage/report/warehouse/${selectedWarehouse}`)

      if (response.status === 200) {
        setStockReportData(response.data.data)
      }

      setIsLoading(false)

    } catch (error) {
      console.log(error)
    }

  }

  async function fetchProfitReportData() {
    try {

      const api = createAxiosInstance()
      const profitDataRes = await api.get(`salesorder/report/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`)

      if (profitDataRes.status === 200) {
        setProductSalesData(profitDataRes.data.productSalesData)
        setTotalDiscounts(profitDataRes.data.totalDiscounts)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleGenerateReport = async () => {
    setIsLoading(true);

    // // Simulate API call for report generation
    setTimeout(() => {
      // Here you would typically handle the response and display the report

      if (activeReport === "profit") {
        fetchProfitReportData()
      } else if (activeReport === "stock") {
        fetchStockReportData()
      }

      setIsLoading(false);
    }, 1500);

    if (activeReport === "profit") {
      if (!dateRange.startDate || !dateRange.endDate) {
        setError("Please Select a vaild date range");
        return;
      }
    }


    if (new Date(dateRange.endDate) < new Date(dateRange.startDate)) {
      setError("End date cannot be before start date");
      return;
    }
    // fetchStockReportData();
    // fetchProfitReportData()
  };

  // const handleExport = (format) => {
  //   // if (format === "pdf" && reportData.length > 0) {
  //   //     // handlePrintStockReport(reportData);
  //   //     const doc = new jsPDF();
  //   //     doc.text("Stock Report", 14, 20);
  //   //     doc.text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, 14, 30);
  //   //     doc.text(`Warehouse: ${selectedWarehouse === "all" ? "All Warehouses" : warehouses.find(w => w.LocationID === selectedWarehouse)?.WarehouseName || "Unknown"}`, 14, 40);
  //   //     const tableColumn = [
  //   //         "Product Name",
  //   //         "Current Stock",
  //   //         "Buying Price",
  //   //         "Selling Price",
  //   //         "Supplier",
  //   //         "Below Reorder"
  //   //     ];
  //   //     const tableRows = reportData.map(item => [
  //   //         item.Name || "N/A",
  //   //         item.currentStock || 0,
  //   //         item.buyingPrice ? `$${item.buyingPrice.toFixed(2)}` : "N/A",
  //   //         item.sellingPrice ? `$${item.sellingPrice.toFixed(2)}` : "N/A",
  //   //         item.supplier || "N/A",
  //   //         item.belowReorder ? "Yes" : "No"
  //   //     ]);
  //   //     doc.autoTable({
  //   //         head: [tableColumn],
  //   //         body: tableRows,
  //   //         startY: 50,
  //   //         theme: "grid",
  //   //         headStyles: { fillColor: [66, 139, 202] },
  //   //         columnStyles: {
  //   //             0: { cellWidth: 40 },
  //   //             1: { cellWidth: 30 },
  //   //             2: { cellWidth: 30 },
  //   //             3: { cellWidth: 30 },
  //   //             4: { cellWidth: 40 },
  //   //             5: { cellWidth: 30 },
  //   //         },
  //   //     });
  //   //     doc.save(`Stock_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  //   // }
  // };

  const handleExport = async (format) => {
    // if (format === "pdf" && reportData.length > 0) {
    //   const doc = new jsPDF();
    //   doc.text("Stock Report", 14, 20);
    //   doc.text(
    //     `Warehouse: ${
    //       selectedWarehouse === "all"
    //         ? "All Warehouses"
    //         : warehouses.find(
    //             (w) => w.LocationID === parseInt(selectedWarehouse)
    //           )?.WarehouseName || "Unknown"
    //     }`,
    //     14,
    //     30
    //   );

    //   const tableColumn = [
    //     "Product Name",
    //     "Warehouse Location",
    //     "Stock Quantity",
    //     "Out of Stock",
    //   ];
    //   const tableRows = reportData.map((item) => [
    //     item.ProductName || "N/A",
    //     item.WarehouseLocation || "N/A",
    //     item.StockQuantity ?? 0,
    //     item.IsOutOfStock || "N/A",
    //   ]);

    //   doc.autoTable({
    //     head: [tableColumn],
    //     body: tableRows,
    //     startY: 40,
    //     theme: "grid",
    //     headStyles: { fillColor: [66, 139, 202] },
    //     columnStyles: {
    //       0: { cellWidth: 60 },
    //       1: { cellWidth: 60 },
    //       2: { cellWidth: 30 },
    //       3: { cellWidth: 30 },
    //     },
    //   });

    //   doc.save(`Stock_Report_${new Date().toISOString().split("T")[0]}.pdf`);
    // } else if (format === "csv" && reportData.length > 0) {
    //   const csvContent = [
    //     [
    //       "Product Name",
    //       "Warehouse Location",
    //       "Stock Quantity",
    //       "Out of Stock",
    //     ],
    //     ...reportData.map((item) => [
    //       item.ProductName || "N/A",
    //       item.WarehouseLocation || "N/A",
    //       item.StockQuantity ?? 0,
    //       item.IsOutOfStock || "N/A",
    //     ]),
    //   ]
    //     .map((e) => e.join(","))
    //     .join("\n");
    //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    //   const link = document.createElement("a");
    //   link.href = URL.createObjectURL(blob);
    //   link.setAttribute(
    //     "download",
    //     `Stock_Report_${new Date().toISOString().split("T")[0]}.csv`
    //   );
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } else if (format === "excel" && reportData.length > 0) {
    //   const ws = XLSX.utils.json_to_sheet(reportData);
    //   const wb = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, "Stock Report");
    //   XLSX.writeFile(
    //     wb,
    //     `Stock_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    //   );
    // } else {
    //   setError("No report data available to export.");
    // }

    if (!productSalesData || productSalesData.length === 0) {
      setError("No sales data available to export.");
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0];
    const fileName = `Sales_Report_${dateString}`;

    try {
      switch (format.toLowerCase()) {
        case "pdf":
          await generatePDFReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
          break;

        case "csv":
          generateCSVReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
          break;

        case "excel":
          generateExcelReport(productSalesData, totalProfit, totalDiscount, netProfit, fileName);
          break;

        default:
          setError("Unsupported export format. Please choose PDF, CSV, or Excel.");
      }
    } catch (error) {
      console.error("Export failed:", error);
      setError(`Failed to export ${format.toUpperCase()} report. Please try again.`);
    }
  };

  // PDF Report Generation
  const generatePDFReport = async (data, totalProfit, totalDiscount, netProfit, fileName) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header Section
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("Sales Report", margin, 25);

    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, margin, 35);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Table Configuration
    const tableConfig = {
      startY: 50,
      margin: margin,
      columnWidths: [45, 25, 35, 30, 35],
      rowHeight: 8,
      headerHeight: 12
    };

    let currentY = tableConfig.startY;

    // Table Header
    doc.setFont(undefined, 'bold');
    doc.setFillColor(52, 58, 64); // Dark gray
    doc.rect(tableConfig.margin, currentY - 2, pageWidth - (2 * tableConfig.margin), tableConfig.headerHeight, 'F');
    doc.setTextColor(255, 255, 255);

    const headers = ["Product Name", "Units", "Sales (LKR)", "COGS (LKR)", "Profit (LKR)"];
    let xPos = tableConfig.margin + 2;

    headers.forEach((header, index) => {
      doc.text(header, xPos, currentY + 6);
      xPos += tableConfig.columnWidths[index];
    });

    currentY += tableConfig.headerHeight + 2;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);

    // Table Rows
    data.forEach((item, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250);
        doc.rect(tableConfig.margin, currentY - 2, pageWidth - (2 * tableConfig.margin), tableConfig.rowHeight, 'F');
      }

      xPos = tableConfig.margin + 2;
      const rowData = [
        truncateText(item.ProductName || "N/A", 20),
        (item.UnitsSold || 0).toString(),
        formatCurrency(item.TotalSales || 0),
        formatCurrency(item.COGS || 0),
        formatCurrency(item.Profit || 0)
      ];

      rowData.forEach((cell, cellIndex) => {
        doc.text(cell, xPos, currentY + 4);
        xPos += tableConfig.columnWidths[cellIndex];
      });

      currentY += tableConfig.rowHeight;

      // Page break if needed
      if (currentY > 260) {
        doc.addPage();
        currentY = 30;
      }
    });

    // Summary Section
    currentY += 20;
    doc.setDrawColor(200, 200, 200);
    doc.line(tableConfig.margin, currentY, pageWidth - tableConfig.margin, currentY);

    currentY += 15;
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Financial Summary", tableConfig.margin, currentY);

    currentY += 15;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');

    const summaryData = [
      { label: "Total Profit:", value: totalProfit, color: [0, 128, 0] },
      { label: "Total Discounts:", value: -totalDiscount, color: [255, 0, 0] },
      { label: "Net Profit:", value: netProfit, color: [0, 0, 0], bold: true }
    ];

    summaryData.forEach((item, index) => {
      doc.setTextColor(...item.color);
      if (item.bold) doc.setFont(undefined, 'bold');

      doc.text(item.label, tableConfig.margin, currentY);
      doc.text(`${formatCurrency(Math.abs(item.value))} LKR`, tableConfig.margin + 100, currentY);

      if (item.bold) doc.setFont(undefined, 'normal');
      currentY += 10;
    });

    doc.save(`${fileName}.pdf`);
  };

  // CSV Report Generation
  const generateCSVReport = (data, totalProfit, totalDiscount, netProfit, fileName) => {
    const csvRows = [
      // Header
      ["Product Name", "Units Sold", "Total Sales (LKR)", "COGS (LKR)", "Profit (LKR)"],

      // Data rows
      ...data.map(item => [
        `"${(item.ProductName || "N/A").replace(/"/g, '""')}"`, // Escape quotes
        item.UnitsSold || "0",
        parseFloat(item.TotalSales || 0).toFixed(2),
        parseFloat(item.COGS || 0).toFixed(2),
        parseFloat(item.Profit || 0).toFixed(2)
      ]),

      // Separator
      [],

      // Summary
      ["FINANCIAL SUMMARY", "", "", "", ""],
      ["Total Profit", "", "", "", totalProfit.toFixed(2)],
      ["Total Discounts", "", "", "", (-totalDiscount).toFixed(2)],
      ["Net Profit", "", "", "", netProfit.toFixed(2)],
      [],
      [`"Report generated on ${new Date().toLocaleString()}"`]
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    downloadFile(csvContent, `${fileName}.csv`, "text/csv");
  };

  // Excel Report Generation
  const generateExcelReport = (data, totalProfit, totalDiscount, netProfit, fileName) => {
    // Main data sheet
    const mainData = data.map(item => ({
      "Product Name": item.ProductName || "N/A",
      "Units Sold": parseInt(item.UnitsSold || 0),
      "Total Sales (LKR)": parseFloat(item.TotalSales || 0),
      "COGS (LKR)": parseFloat(item.COGS || 0),
      "Profit (LKR)": parseFloat(item.Profit || 0),
    }));

    // Summary data
    const summaryData = [
      { "Metric": "Total Profit", "Value (LKR)": totalProfit },
      { "Metric": "Total Discounts", "Value (LKR)": -totalDiscount },
      { "Metric": "Net Profit", "Value (LKR)": netProfit },
      { "Metric": "Report Date", "Value (LKR)": new Date().toLocaleDateString() }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sales data sheet
    const ws1 = XLSX.utils.json_to_sheet(mainData);
    XLSX.utils.book_append_sheet(wb, ws1, "Sales Data");

    // Summary sheet
    const ws2 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    // Style the headers (if supported)
    const range = XLSX.utils.decode_range(ws1['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws1[address]) continue;
      ws1[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // Utility Functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

  };


  useEffect(() => {
    // if (!checkToken()) {
    //   handleUserLogout()
    //     .then(() => setAuth(() => false))
    //     .then(() => history.push("/auth/login"));
    //   return;
    // }

    loadWarehouses();
  }, []);

  const totalProfit = productSalesData?.reduce((sum, item) => sum + parseFloat(item.Profit || 0), 0) || 0;
  const totalDiscount = parseFloat(totalDiscounts?.[0]?.TotalDiscount || 0);
  const netProfit = totalProfit - totalDiscount;


  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate and manage inventory and warehouse reports
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Types Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report Types
            </h2>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${activeReport === report.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <div
                    className={`flex-shrink-0 ${activeReport === report.id
                      ? "text-blue-600"
                      : "text-gray-500"
                      }`}
                  >
                    {report.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {report.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {reportTypes.find((r) => r.id === activeReport)?.name} Report
              </h2>

              <div className="space-y-6">
                {/* Date Range Selection */}
                {activeReport === "profit" && <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={dateRange.startDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={dateRange.endDate}
                        onChange={(e) =>
                          setDateRange({
                            ...dateRange,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>}

                {/* Warehouse Selection */}
                {activeReport === "stock" && <div>
                  <label
                    htmlFor="warehouse"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Warehouse
                  </label>
                  <select
                    id="warehouse"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                  >
                    <option value="all">All Warehouses</option>
                    {warehouses.map((warehouse) => (
                      <option
                        key={warehouse.LocationID}
                        value={warehouse.LocationID}
                      >
                        {warehouse.WarehouseName} ({warehouse.Address})
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Additional Filters - shown based on report type */}
                {activeReport === "inventory" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inventory Filters
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          id="low-stock"
                          name="low-stock"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="low-stock"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Show only low stock items
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="zero-stock"
                          name="zero-stock"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="zero-stock"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Include zero stock items
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeReport === "movement" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Movement Types
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <input
                          id="receipts"
                          name="receipts"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="receipts"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Receipts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="issues"
                          name="issues"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="issues"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Issues
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="transfers"
                          name="transfers"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="transfers"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Transfers
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Report Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    onClick={handleGenerateReport}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <svg
                          className="-ml-1 mr-2 h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Report Preview Area */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Preview
                </h2>
                <div className="flex space-x-2 no-print">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Export as PDF"
                    disabled={isLoading || productSalesData.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Export as CSV"
                    disabled={isLoading || productSalesData.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    CSV
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    title="Print Report"
                    disabled={isLoading || reportData.length === 0}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-600 text-sm">{error}</div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <svg
                    className="animate-spin mx-auto h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <p className="mt-2 text-gray-600">Loading report...</p>
                </div>
              ) : productSalesData.length > 0 ? (
                // <div className="overflow-x-auto">
                //   <table className="min-w-full divide-y divide-gray-200">
                //     <thead className="bg-gray-50">
                //       <tr>
                //         <th
                //           scope="col"
                //           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                //         >
                //           Product Name
                //         </th>
                //         <th
                //           scope="col"
                //           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                //         >
                //           Warehouse Location
                //         </th>
                //         <th
                //           scope="col"
                //           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                //         >
                //           Stock Quantity
                //         </th>
                //         <th
                //           scope="col"
                //           className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                //         >
                //           Out of Stock
                //         </th>
                //       </tr>
                //     </thead>
                //     <tbody className="bg-white divide-y divide-gray-200">
                //       {reportData.map((item, index) => (
                //         <tr key={index}>
                //           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                //             {item.ProductName || "N/A"}
                //           </td>
                //           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                //             {item.WarehouseLocation || "N/A"}
                //           </td>
                //           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                //             {item.StockQuantity ?? 0}
                //           </td>
                //           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                //             {item.IsOutOfStock || "N/A"}
                //           </td>
                //         </tr>
                //       ))}
                //     </tbody>
                //   </table>
                // </div>

                <div className="space-y-6">
                  {/* Sales Data Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Units Sold
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total Sales
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            COGS
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Profit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {productSalesData.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.ProductName || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.UnitsSold || "0"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(item.TotalSales || 0).toLocaleString()} LKR
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(item.COGS || 0).toLocaleString()} LKR
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {parseFloat(item.Profit || 0).toLocaleString()} LKR
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">Total Profit</h3>
                      <p className="text-2xl font-bold text-blue-900">
                        ${totalProfit.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h3 className="text-sm font-medium text-red-800 mb-1">Total Discounts</h3>
                      <p className="text-2xl font-bold text-red-900">
                        -${totalDiscount.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-1">Net Profit</h3>
                      <p className="text-2xl font-bold text-green-900">
                        ${netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center h-64">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-500">
                    No report generated yet
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Configure your report parameters and click "Generate Report"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Report Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <svg
                  className="h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Total Reports
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">0</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">--</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Total Warehouses
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  {warehouses.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">
                  Last Generated
                </p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900">
                  Never
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
