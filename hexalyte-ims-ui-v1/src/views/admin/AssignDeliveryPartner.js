
import React, { useEffect, useState } from "react";
import {
  Truck,
  Calendar,
  Package,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Phone,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { createAxiosInstance } from "../../api/axiosInstance";
import { generateWaybill } from "../../components/Print/WaybillGenerator";


const AssignDeliveryPartner = () => {
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]); // Changed to array for multiple orders
  const [orderSchedules, setOrderSchedules] = useState({}); // Object to store individual schedules for each order
  const [priority, setPriority] = useState("normal");
  const [notes, setNotes] = useState("");
  const [trackingNumbers, setTrackingNumbers] = useState([]); // Array for multiple tracking numbers
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const timeSlots = [
    "9:00 AM - 12:00 PM",
    "12:00 PM - 3:00 PM",
    "3:00 PM - 6:00 PM",
    "6:00 PM - 9:00 PM",
  ];


// // Helper function to generate barcode as base64 image
// const generateBarcode = (text, options = {}) => {
//   const canvas = document.createElement('canvas');
//   JsBarcode(canvas, text, {
//     format: "CODE128",
//     width: options.width || 1,
//     height: options.height || 30,
//     displayValue: false,
//     margin: 0,
//     ...options
//   });
//   return canvas.toDataURL('image/png');
// };


  
  

  // Function to fetch tracking numbers from database for bulk assignment
  const fetchTrackingNumbers = async (partnerId, count) => {
    if (!partnerId || count <= 0) return [];

    setIsLoadingTracking(true);
    try {
      // TODO: Replace with actual API call to fetch available tracking numbers
      const api = createAxiosInstance();
      const response = await api.get(`trackingnumbers/get-tracking-numbers/${partnerId}/${count}`);

      // Temporary simulation - replace with actual API call
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate tracking numbers based on partner (temporary)
      // const partner = deliveryPartners.find(p => p.DeliveryPartnerID == partnerId);
      // let prefix = "TRK";
      // if (partner) {
      //   if (partner.DeliveryPartnerName.toLowerCase().includes("dhl")) prefix = "DHL";
      //   else if (partner.DeliveryPartnerName.toLowerCase().includes("fedex")) prefix = "FDX";
      // }

      // const assignedTrackingNumbers = [];
      // for (let i = 0; i < count; i++) {
      //   assignedTrackingNumbers.push(prefix + Math.random().toString().substr(2, 10));
      // }

      const assignedTrackingNumbers = response.data.trackingNumbersFromDeliveryPartner.trackingNumbers;

      setTrackingNumbers(assignedTrackingNumbers);
      return assignedTrackingNumbers;
    } catch (error) {
      console.error("Failed to fetch tracking numbers:", error);
      setTrackingNumbers([]);
      return [];
    } finally {
      setIsLoadingTracking(false);
    }
  };

  // Handle partner selection change
  const handlePartnerChange = (partnerId) => {
    setSelectedPartner(partnerId);
    setTrackingNumbers([]); // Clear previous tracking numbers
    if (partnerId && partnerId !== "0" && selectedOrders.length > 0) {
      fetchTrackingNumbers(partnerId, selectedOrders.length);
    }
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        // Remove order and its schedule
        const newSelected = prev.filter(id => id !== orderId);
        const newSchedules = { ...orderSchedules };
        delete newSchedules[orderId];
        setOrderSchedules(newSchedules);
        return newSelected;
      } else {
        // Add order with default schedule
        const newSchedules = { ...orderSchedules };
        newSchedules[orderId] = {
          deliveryDate: "",
          timeSlot: "",
        };
        setOrderSchedules(newSchedules);
        return [...prev, orderId];
      }
    });
  };

  // Handle select all orders
  const handleSelectAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
      setOrderSchedules({});
    } else {
      const allOrderIds = orders.map(order => order.NewOrderID);
      setSelectedOrders(allOrderIds);
      const newSchedules = {};
      allOrderIds.forEach(orderId => {
        newSchedules[orderId] = {
          deliveryDate: "",
          timeSlot: "",
        };
      });
      setOrderSchedules(newSchedules);
    }
  };

  // Update schedule for specific order
  const updateOrderSchedule = (orderId, field, value) => {
    setOrderSchedules(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  // Update tracking numbers when orders change
  useEffect(() => {
    if (selectedPartner && selectedOrders.length > 0) {
      fetchTrackingNumbers(selectedPartner, selectedOrders.length);
    }
  }, [selectedOrders.length]);
  const handleAssign = async () => {
    if (
      selectedOrders.length === 0 ||
      !selectedPartner ||
      trackingNumbers.length !== selectedOrders.length
    ) {
      alert("Please select orders and delivery partner with sufficient tracking numbers");
      return;
    }
  
    setIsAssigning(true);
    try {
      const api = createAxiosInstance();
  
      // Build assignment data
      const assignmentData = selectedOrders.map((orderId, index) => ({
        orderId,
        deliveryPartnerId: selectedPartner,
        trackingNumber: trackingNumbers[index],
        deliveryDate: orderSchedules[orderId]?.deliveryDate || "",
        timeSlot: orderSchedules[orderId]?.timeSlot || "",
        priority,
        notes,
      }));
  
      // Call API
      const response = await api.post(
        "neworder/assign/delivery-partner",
        assignmentData
      );
  
      if (response.status === 200) {
        const selectedPartnerData = deliveryPartners.find(
          (p) => p.DeliveryPartnerID == selectedPartner
        );
  
        if (selectedPartnerData) {
          // Generate waybill PDF
          generateWaybill(
            assignmentData,
            selectedPartnerData,
            orders,
            calculateOrderTotal,
            priority,
            notes
          );
        }
  
        alert(`${selectedOrders.length} order(s) assigned successfully! `);
      }
  
      // Reset form
      setSelectedOrders([]);
      setSelectedPartner("");
      setTrackingNumbers([]);
      setOrderSchedules({});
      setNotes("");
      setSearchQuery("");
      setIsDropdownOpen(false);
  
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error("Failed to assign delivery partner:", error);
      alert(" Failed to assign delivery partner. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };
  

  // Calculate order total from items
  const calculateOrderTotal = (order) => {
    if (!order.NewOrderItems || order.NewOrderItems.length === 0) return "0";

    const total = order.NewOrderItems.reduce((sum, item) => {
      const unitPrice = item.UnitPrice || 0;
      const quantity = item.Quantity || 1;
      const discount = item.Discount || 0;

      let itemTotal = unitPrice * quantity;

      // Apply discount if present
      if (discount > 0) {
        if (item.DiscountType === "percentage") {
          itemTotal = itemTotal - (itemTotal * discount / 100);
        } else {
          itemTotal = itemTotal - discount;
        }
      }

      return sum + itemTotal;
    }, 0);

    return total.toFixed(2);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.NewOrderID.toString().includes(searchQuery) ||
    order.CustomerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedPartnerData = deliveryPartners.find(p => p.DeliveryPartnerID == selectedPartner);
  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.NewOrderID));

  async function fetchDeliveryPartners() {
    try {
      const api = createAxiosInstance();
      const response = await api.get("/deliverypartner");

      if (response.status === 200) {
        setDeliveryPartners(response.data.allDeliveryPartners || []);
      }
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
    }
  }

  async function fetchOrders() {
    try {
      const api = createAxiosInstance();
      const response = await api.get("/neworder");

      if (response.status === 200) {
        // Filter orders that are confirmed and don't have a delivery partner assigned yet
        const eligibleOrders = response.data.data.filter(order => 
          !order.DeliveryPartnerID && order.Status === 'Confirmed'
        );
        setOrders(eligibleOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  // Reset selections when component mounts
  useEffect(() => {
    setSelectedOrders([]);
    setTrackingNumbers([]);
    setOrderSchedules({});
  }, []);

  return (
    <div className="w-full mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assign Delivery Partner</h1>
        <p className="text-gray-600">Select orders and assign a delivery partner for delivery</p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Only orders with "Confirmed" status can be assigned for delivery. Orders will automatically move to "Processing" status after tracking number assignment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Selection & Details */}
        <div className="lg:col-span-1">
          {/* Order Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2 text-blue-600" />
                Select Orders ({selectedOrders.length})
              </h3>
              {orders.length > 0 && (
                <button
                  onClick={handleSelectAllOrders}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedOrders.length === orders.length ? "Deselect All" : "Select All"}
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Order ID or Customer Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ShoppingCart className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Dropdown with Orders */}
            {isDropdownOpen && (
              <div className="relative">
                <div
                  className="absolute top-0 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-10">
                  {filteredOrders.length > 0 ? (
                    <div className="p-2">
                      {filteredOrders.map((order) => (
                        <div
                          key={order.NewOrderID}
                          className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedOrders.includes(order.NewOrderID)
                              ? "bg-blue-50 border border-blue-200"
                              : "border border-transparent"
                          }`}
                          onClick={() => handleOrderSelect(order.NewOrderID)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.NewOrderID)}
                                onChange={() => handleOrderSelect(order.NewOrderID)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div>
                                <p className="font-medium text-sm">Order #{order.NewOrderID}</p>
                                <p className="text-xs text-gray-600">{order.CustomerName}</p>
                                <p className="text-xs text-gray-500">{order.CityName} •
                                  Rs. {calculateOrderTotal(order)}</p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Confirmed
                                </span>
                              </div>
                            </div>
                            {selectedOrders.includes(order.NewOrderID) && (
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No orders found matching "{searchQuery}"
                    </div>
                  )}
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show selected count when dropdown is closed */}
            {!isDropdownOpen && selectedOrders.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  {selectedOrders.length} order(s) selected
                  <button
                    onClick={() => setIsDropdownOpen(true)}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    View/Edit Selection
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Selected Orders Summary */}
          {selectedOrdersData.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
                Selected Orders ({selectedOrdersData.length})
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedOrdersData.map((order, index) => (
                  <div key={order.NewOrderID} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm">
                        <div className="font-medium">Order #{order.NewOrderID}</div>
                        <div className="text-gray-600">{order.CustomerName}</div>
                        <div className="text-gray-500">{order.CityName}</div>
                        <div className="text-gray-600">Rs. {calculateOrderTotal(order)}</div>
                      </div>
                      {trackingNumbers[index] && (
                        <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          {trackingNumbers[index]}
                        </div>
                      )}
                    </div>

                    {/* Individual Schedule for this order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={orderSchedules[order.NewOrderID]?.deliveryDate || ""}
                          onChange={(e) => updateOrderSchedule(order.NewOrderID, "deliveryDate", e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Time Slot
                        </label>
                        <select
                          value={orderSchedules[order.NewOrderID]?.timeSlot || ""}
                          onChange={(e) => updateOrderSchedule(order.NewOrderID, "timeSlot", e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select time slot...</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedOrdersData.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-900">
                    Total Value:
                    Rs. {selectedOrdersData.reduce((sum, order) => sum + parseFloat(calculateOrderTotal(order)), 0).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assignment Form */}
        <div className="lg:col-span-2">
          {/* Selected Orders Info Banner */}
          {selectedOrders.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Selected {selectedOrders.length} order(s) for assignment
                </span>
              </div>
            </div>
          )}

          {/* Delivery Partner Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-blue-600" />
              Select Delivery Partner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Partner
                </label>
                <select
                  value={selectedPartner}
                  onChange={(e) => handlePartnerChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={selectedOrders.length === 0}
                >
                  <option value="">
                    {selectedOrders.length === 0 ? "Select orders first" : "Select a Delivery Partner"}
                  </option>
                  {deliveryPartners
                    .filter(partner => partner.isActive === 1)
                    .map((partner) => (
                      <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
                        {partner.DeliveryPartnerName}
                      </option>
                    ))}
                </select>
                {selectedPartnerData && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Partner:</span>
                        <span className="font-medium">{selectedPartnerData.DeliveryPartnerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedPartnerData.isActive === 1
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                        }`}>
                          {selectedPartnerData.isActive === 1 ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Numbers ({trackingNumbers.length})
                </label>
                <div className="relative">
                  <div
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[40px] max-h-32 overflow-y-auto">
                    {isLoadingTracking ? (
                      <div className="flex items-center justify-center py-4">
                        <div
                          className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm text-gray-600">Fetching tracking numbers...</span>
                      </div>
                    ) : trackingNumbers.length > 0 ? (
                      <div className="space-y-1">
                        {trackingNumbers.map((tracking, index) => (
                          <div key={index} className="text-sm text-gray-700 bg-white px-2 py-1 rounded border">
                            {tracking}
                          </div>
                        ))}
                      </div>
                    ) : selectedPartner ? (
                      <span className="text-sm text-gray-500">No tracking numbers available</span>
                    ) : (
                      <span className="text-sm text-gray-500">Select delivery partner first</span>
                    )}
                  </div>
                </div>
                {selectedPartner && !isLoadingTracking && trackingNumbers.length > 0 && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {trackingNumbers.length} tracking numbers ready for assignment
                  </p>
                )}
                {selectedPartner && !isLoadingTracking && trackingNumbers.length === 0 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    No tracking numbers available for this partner
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" />
              Bulk Schedule Settings (Optional)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Set default delivery schedule for all selected orders. You can customize individual schedules in the order
              details section.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Delivery Date
                </label>
                <input
                  type="date"
                  onChange={(e) => {
                    // Apply to all selected orders that don't have a date set
                    const newSchedules = { ...orderSchedules };
                    selectedOrders.forEach(orderId => {
                      if (!newSchedules[orderId]?.deliveryDate) {
                        newSchedules[orderId] = {
                          ...newSchedules[orderId],
                          deliveryDate: e.target.value,
                        };
                      }
                    });
                    setOrderSchedules(newSchedules);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Time Slot
                </label>
                <select
                  onChange={(e) => {
                    // Apply to all selected orders that don't have a time slot set
                    const newSchedules = { ...orderSchedules };
                    selectedOrders.forEach(orderId => {
                      if (!newSchedules[orderId]?.timeSlot) {
                        newSchedules[orderId] = {
                          ...newSchedules[orderId],
                          timeSlot: e.target.value,
                        };
                      }
                    });
                    setOrderSchedules(newSchedules);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select default time slot...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add delivery notes for all selected orders..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Assignment Summary */}
          {selectedOrders.length > 0 && selectedPartner && trackingNumbers.length >= selectedOrders.length && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Assignment Summary
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Orders:</strong> {selectedOrders.length} selected</p>
                <p><strong>Partner:</strong> {selectedPartnerData?.DeliveryPartnerName}</p>
                <p><strong>Tracking Numbers:</strong> {trackingNumbers.length} assigned</p>
                <p><strong>Scheduled
                  Orders:</strong> {Object.values(orderSchedules).filter(schedule => schedule.deliveryDate && schedule.timeSlot).length} of {selectedOrders.length}
                </p>
                {priority !== "normal" && <p><strong>Priority:</strong> {priority}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAssign}
              disabled={
                selectedOrders.length === 0 ||
                !selectedPartner ||
                trackingNumbers.length < selectedOrders.length ||
                isAssigning
              }
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                selectedOrders.length === 0 ||
                !selectedPartner ||
                trackingNumbers.length < selectedOrders.length ||
                isAssigning
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isAssigning ? (
                <div className="flex items-center justify-center">
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Assigning {selectedOrders.length} orders...
                </div>
              ) : (
                `Assign to ${selectedOrders.length} Order${selectedOrders.length > 1 ? "s" : ""}`
              )}
            </button>

            <button
              onClick={() => {
                setSelectedOrders([]);
                setSelectedPartner("");
                setTrackingNumbers([]);
                setOrderSchedules({});
                setNotes("");
                setPriority("normal");
                setSearchQuery("");
                setIsDropdownOpen(false);
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDeliveryPartner;