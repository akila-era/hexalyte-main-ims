// import React, { useState, useEffect } from 'react';
// import { Package, Scan, Check, X, User, MapPin, Phone, Calendar, Truck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
// import { createAxiosInstance } from "../../api/axiosInstance";
//
// const PackOrderUI = () => {
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [scannedItems, setScannedItems] = useState([]);
//   const [barcodeInput, setBarcodeInput] = useState('');
//   const [packingStatus, setPackingStatus] = useState('pending'); // pending, in-progress, completed
//   const [deliveryPartner, setDeliveryPartner] = useState('');
//   const [trackingNumber, setTrackingNumber] = useState('');
//
//   // Mock data for demonstration
//   const [orders, setOrders] = useState([]);
//   const [deliveryPartners, setDeliveryPartners] = useState([])
//
//   const handleOrderSelect = (order) => {
//     setSelectedOrder(order);
//     setScannedItems([]);
//     setPackingStatus('pending');
//     setBarcodeInput('');
//     setDeliveryPartner('');
//     setTrackingNumber('');
//   };
//
//   const handleBarcodeSubmit = (e) => {
//     e.preventDefault();
//     if (!barcodeInput.trim() || !selectedOrder) return;
//
//     const matchingItem = selectedOrder.items.find(item => item.barcode === barcodeInput);
//
//     if (matchingItem) {
//       const existingScanned = scannedItems.find(item => item.barcode === barcodeInput);
//
//       if (existingScanned) {
//         if (existingScanned.scannedQuantity < matchingItem.quantity) {
//           setScannedItems(prev =>
//             prev.map(item =>
//               item.barcode === barcodeInput
//                 ? { ...item, scannedQuantity: item.scannedQuantity + 1 }
//                 : item
//             )
//           );
//         }
//       } else {
//         setScannedItems(prev => [...prev, {
//           ...matchingItem,
//           scannedQuantity: 1,
//           timestamp: new Date().toLocaleTimeString()
//         }]);
//       }
//
//       if (packingStatus === 'pending') {
//         setPackingStatus('in-progress');
//       }
//     }
//
//     setBarcodeInput('');
//   };
//
//   const isOrderComplete = () => {
//     if (!selectedOrder) return false;
//     return selectedOrder.items.every(orderItem => {
//       const scannedItem = scannedItems.find(item => item.id === orderItem.id);
//       return scannedItem && scannedItem.scannedQuantity >= orderItem.quantity;
//     });
//   };
//
//   const handleCompletePackaging = () => {
//     if (!deliveryPartner) {
//       alert('Please select a delivery partner');
//       return;
//     }
//
//     setPackingStatus('completed');
//     // Generate tracking number
//     setTrackingNumber('TRK-' + Date.now().toString().slice(-8));
//   };
//
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'in-progress': return 'bg-blue-100 text-blue-800';
//       case 'completed': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };
//
//     async function fetchDeliveryPartners() {
//     try {
//       const api = createAxiosInstance();
//       const response = await api.get("deliverypartner");
//
//       console.log(response.data.allDeliveryPartners);
//
//       if (response.status === 200) {
//         setDeliveryPartners(() => response.data.allDeliveryPartners);
//       }
//
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   async function fetchOrders() {
//     try {
//       const api = createAxiosInstance();
//       const response = await api.get("/neworder");
//
//       if (response.status === 200) {
//
//         console.log(response.data.data);
//
//         setOrders(response.data.data);
//       }
//
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   useEffect(() => {
//     fetchOrders();
//     fetchDeliveryPartners();
//   }, []);
//
//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Pack Orders</h1>
//         <p className="text-gray-600">Scan items and prepare orders for delivery</p>
//       </div>
//
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Orders List */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="p-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Package className="w-5 h-5" />
//               Confirmed Orders
//             </h2>
//           </div>
//           <div className="divide-y max-h-96 overflow-y-auto">
//             {orders.map((order) => (
//               <div
//                 key={order.id}
//                 className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
//                   selectedOrder?.id === order.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
//                 }`}
//                 onClick={() => handleOrderSelect(order)}
//               >
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="font-medium text-gray-900">{order.id}</h3>
//                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                     {order.status}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600 mb-1">{order.customerName}</p>
//                 <p className="text-xs text-gray-500">{order.NewOrderItems.length} items </p>
//               </div>
//             ))}
//           </div>
//         </div>
//
//         {/* Packing Interface */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="p-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <Scan className="w-5 h-5" />
//               Pack Items
//               {packingStatus !== 'pending' && (
//                 <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(packingStatus)}`}>
//                   {packingStatus.replace('-', ' ')}
//                 </span>
//               )}
//             </h2>
//           </div>
//
//           {selectedOrder ? (
//             <div className="p-4">
//               {/* Barcode Scanner */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Scan Item Barcode
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={barcodeInput}
//                     onChange={(e) => setBarcodeInput(e.target.value)}
//                     onKeyPress={(e) => {
//                       if (e.key === 'Enter') {
//                         handleBarcodeSubmit(e);
//                       }
//                     }}
//                     placeholder="Scan or enter barcode..."
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={packingStatus === 'completed'}
//                   />
//                   <button
//                     onClick={(e) => handleBarcodeSubmit(e)}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
//                     disabled={packingStatus === 'completed'}
//                   >
//                     <Scan className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//
//               {/* Items to Pack */}
//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-gray-900">Items to Pack:</h3>
//                 {selectedOrder.items.map((item) => {
//                   const scannedItem = scannedItems.find(s => s.id === item.id);
//                   const scannedQty = scannedItem ? scannedItem.scannedQuantity : 0;
//                   const isComplete = scannedQty >= item.quantity;
//
//                   return (
//                     <div key={item.id} className={`p-3 rounded-md border ${isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm font-medium text-gray-900">{item.name}</span>
//                         {isComplete ? (
//                           <CheckCircle2 className="w-4 h-4 text-green-600" />
//                         ) : (
//                           <Clock className="w-4 h-4 text-gray-400" />
//                         )}
//                       </div>
//                       <p className="text-xs text-gray-600 mb-1">SKU: {item.sku}</p>
//                       <div className="flex justify-between text-xs">
//                         <span>Required: {item.quantity}</span>
//                         <span className={scannedQty >= item.quantity ? 'text-green-600 font-medium' : 'text-gray-600'}>
//                           Scanned: {scannedQty}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//
//               {/* Delivery Partner Selection */}
//               {packingStatus === 'in-progress' && isOrderComplete() && (
//                 <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                   <h3 className="text-sm font-medium text-gray-900 mb-2">Select Delivery Partner:</h3>
//                   <select
//                     value={deliveryPartner}
//                     onChange={(e) => setDeliveryPartner(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Choose delivery partner...</option>
//                     {deliveryPartners.map((partner) => (
//                       <option key={partner.id} value={partner.id}>
//                         {partner.name}
//                       </option>
//                     ))}
//                   </select>
//                   <button
//                     onClick={handleCompletePackaging}
//                     className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
//                   >
//                     <Check className="w-4 h-4" />
//                     Complete Packaging
//                   </button>
//                 </div>
//               )}
//
//               {/* Completion Status */}
//               {packingStatus === 'completed' && (
//                 <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
//                   <div className="flex items-center gap-2 text-green-800 mb-2">
//                     <CheckCircle2 className="w-5 h-5" />
//                     <span className="font-medium">Package Ready for Delivery</span>
//                   </div>
//                   <p className="text-sm text-green-700">Tracking Number: <strong>{trackingNumber}</strong></p>
//                   <p className="text-sm text-green-700">Delivery Partner: <strong>{deliveryPartners.find(p => p.id === deliveryPartner)?.name}</strong></p>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>Select an order to start packing</p>
//             </div>
//           )}
//         </div>
//
//         {/* Order Details */}
//         <div className="bg-white rounded-lg shadow-sm border">
//           <div className="p-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
//           </div>
//
//           {selectedOrder ? (
//             <div className="p-4">
//               <div className="space-y-4">
//                 {/* Customer Info */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
//                     <User className="w-4 h-4" />
//                     Customer Information
//                   </h3>
//                   <div className="bg-gray-50 p-3 rounded-md space-y-1">
//                     <p className="text-sm"><strong>Name:</strong> {selectedOrder.customerName}</p>
//                     <p className="text-sm flex items-start gap-1">
//                       <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
//                       <span><strong>Address:</strong> {selectedOrder.customerAddress}</span>
//                     </p>
//                     <p className="text-sm flex items-center gap-1">
//                       <Phone className="w-3 h-3" />
//                       <span><strong>Mobile:</strong> {selectedOrder.customerMobile}</span>
//                     </p>
//                   </div>
//                 </div>
//
//                 {/* Order Info */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Order Information
//                   </h3>
//                   <div className="bg-gray-50 p-3 rounded-md space-y-1">
//                     <p className="text-sm"><strong>Order ID:</strong> {selectedOrder.id}</p>
//                     <p className="text-sm"><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
//                     <p className="text-sm"><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
//                     <p className="text-sm"><strong>Total Amount:</strong> Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
//                   </div>
//                 </div>
//
//                 {/* Scanned Items History */}
//                 {scannedItems.length > 0 && (
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-900 mb-2">Scan History</h3>
//                     <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
//                       {scannedItems.map((item, index) => (
//                         <div key={index} className="text-xs text-gray-600 mb-1">
//                           <span className="font-medium">{item.timestamp}</span> - {item.name} (Qty: {item.scannedQuantity})
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//
//                 {/* Progress Indicator */}
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-900 mb-2">Packing Progress</h3>
//                   <div className="bg-gray-50 p-3 rounded-md">
//                     {selectedOrder.items.map((item) => {
//                       const scannedItem = scannedItems.find(s => s.id === item.id);
//                       const scannedQty = scannedItem ? scannedItem.scannedQuantity : 0;
//                       const progress = (scannedQty / item.quantity) * 100;
//
//                       return (
//                         <div key={item.id} className="mb-2 last:mb-0">
//                           <div className="flex justify-between text-xs text-gray-600 mb-1">
//                             <span>{item.name}</span>
//                             <span>{scannedQty}/{item.quantity}</span>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className="bg-blue-600 h-2 rounded-full transition-all"
//                               style={{ width: `${Math.min(progress, 100)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500">
//               <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//               <p>Order details will appear here</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default PackOrderUI;

import React, { useState, useEffect } from 'react';
import { Package, Scan, Check, X, User, MapPin, Phone, Calendar, Truck, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { createAxiosInstance } from "../../api/axiosInstance";

const PackOrderUI = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [packingStatus, setPackingStatus] = useState('pending'); // pending, in-progress, completed
  const [deliveryPartner, setDeliveryPartner] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform server data to component format
  const transformOrderData = (serverOrder) => {
    const totalAmount = serverOrder.NewOrderItems?.reduce((total, item) =>
      total + (item.UnitPrice * item.Quantity), 0) || 0;

    return {
      id: serverOrder.NewOrderID,
      customerName: serverOrder.CustomerName,
      customerAddress: serverOrder.CustomerAddress,
      customerMobile: serverOrder.PrimaryPhone,
      customerSecondaryMobile: serverOrder.SecondaryPhone,
      cityName: serverOrder.CityName,
      status: 'confirmed',
      orderDate: new Date(serverOrder.createdAt).toLocaleDateString(),
      deliveryDate: serverOrder.deliveryDate || 'TBD',
      totalAmount: totalAmount,
      remark: serverOrder.Remark,
      items: serverOrder.NewOrderItems?.map(item => ({
        id: item.NewOrderRowID,
        name: `Product ${item.subProduct?.ProductID || 'Unknown'}`,
        sku: item.subProduct?.serialNumber || 'N/A',
        barcode: item.subProduct?.serialNumber || `${item.SubProductID}`,
        quantity: item.Quantity,
        unitPrice: item.UnitPrice,
        subProductId: item.SubProductID,
        productId: item.subProduct?.ProductID,
        status: item.subProduct?.status
      })) || []
    };
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setScannedItems([]);
    setPackingStatus('pending');
    setBarcodeInput('');
    setDeliveryPartner('');
    setTrackingNumber('');
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim() || !selectedOrder) return;

    const matchingItem = selectedOrder.items.find(item =>
      item.barcode === barcodeInput || item.sku === barcodeInput
    );

    if (matchingItem) {
      const existingScanned = scannedItems.find(item => item.id === matchingItem.id);

      if (existingScanned) {
        if (existingScanned.scannedQuantity < matchingItem.quantity) {
          setScannedItems(prev =>
            prev.map(item =>
              item.id === matchingItem.id
                ? { ...item, scannedQuantity: item.scannedQuantity + 1 }
                : item
            )
          );
        }
      } else {
        setScannedItems(prev => [...prev, {
          ...matchingItem,
          scannedQuantity: 1,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }

      if (packingStatus === 'pending') {
        setPackingStatus('in-progress');
      }
    } else {
      alert('Item not found in this order. Please check the barcode.');
    }

    setBarcodeInput('');
  };

  const isOrderComplete = () => {
    if (!selectedOrder) return false;
    return selectedOrder.items.every(orderItem => {
      const scannedItem = scannedItems.find(item => item.id === orderItem.id);
      return scannedItem && scannedItem.scannedQuantity >= orderItem.quantity;
    });
  };

  const handleCompletePackaging = async () => {
    if (!deliveryPartner) {
      alert('Please select a delivery partner');
      return;
    }

    try {
      // You can add API call here to update order status
      // const api = createAxiosInstance();
      // await api.put(`/neworder/${selectedOrder.id}`, {
      //   status: 'packed',
      //   deliveryPartnerId: deliveryPartner,
      //   trackingNumber: trackingNumber
      // });

      setPackingStatus('completed');
      setTrackingNumber('TRK-' + Date.now().toString().slice(-8));

      alert('Package completed successfully!');
    } catch (error) {
      console.error('Error completing package:', error);
      alert('Error completing package. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  async function fetchDeliveryPartners() {
    try {
      const api = createAxiosInstance();
      const response = await api.get("deliverypartner");

      if (response.status === 200) {
        setDeliveryPartners(response.data.allDeliveryPartners || []);
      }
    } catch (e) {
      console.error('Error fetching delivery partners:', e);
      setError('Failed to load delivery partners');
    }
  }

  async function fetchOrders() {
    try {
      const api = createAxiosInstance();
      const response = await api.get("/neworder");

      if (response.status === 200) {
        const transformedOrders = response.data.data?.map(transformOrderData) || [];
        setOrders(transformedOrders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
      setError('Failed to load orders');
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchOrders(), fetchDeliveryPartners()]);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full mx-auto p-6 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders and delivery partners...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-6 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pack Orders</h1>
        <p className="text-gray-600">Scan items and prepare orders for delivery</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Confirmed Orders ({orders.length})
            </h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No orders available for packing</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedOrder?.id === order.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleOrderSelect(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customerName}</p>
                  <p className="text-xs text-gray-500">{order.items.length} items • Rs. {order.totalAmount.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Packing Interface */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Pack Items
              {packingStatus !== 'pending' && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(packingStatus)}`}>
                  {packingStatus.replace('-', ' ')}
                </span>
              )}
            </h2>
          </div>

          {selectedOrder ? (
            <div className="p-4">
              {/* Barcode Scanner */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Item Barcode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeSubmit(e);
                      }
                    }}
                    placeholder="Scan or enter barcode/serial number..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={packingStatus === 'completed'}
                  />
                  <button
                    onClick={(e) => handleBarcodeSubmit(e)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={packingStatus === 'completed'}
                  >
                    <Scan className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items to Pack */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Items to Pack:</h3>
                {selectedOrder.items.map((item) => {
                  const scannedItem = scannedItems.find(s => s.id === item.id);
                  const scannedQty = scannedItem ? scannedItem.scannedQuantity : 0;
                  const isComplete = scannedQty >= item.quantity;

                  return (
                    <div key={item.id} className={`p-3 rounded-md border ${isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Serial: {item.sku}</p>
                      <p className="text-xs text-gray-600 mb-1">Status: {item.status}</p>
                      <div className="flex justify-between text-xs">
                        <span>Required: {item.quantity}</span>
                        <span className={scannedQty >= item.quantity ? 'text-green-600 font-medium' : 'text-gray-600'}>
                          Scanned: {scannedQty}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Partner Selection */}
              {packingStatus === 'in-progress' && isOrderComplete() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Select Delivery Partner:</h3>
                  <select
                    value={deliveryPartner}
                    onChange={(e) => setDeliveryPartner(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose delivery partner...</option>
                    {deliveryPartners.map((partner) => (
                      <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
                        {partner.DeliveryPartnerName}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleCompletePackaging}
                    className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Complete Packaging
                  </button>
                </div>
              )}

              {/* Completion Status */}
              {packingStatus === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Package Ready for Delivery</span>
                  </div>
                  <p className="text-sm text-green-700">Tracking Number: <strong>{trackingNumber}</strong></p>
                  <p className="text-sm text-green-700">
                    Delivery Partner: <strong>
                    {deliveryPartners.find(p => p.DeliveryPartnerID === parseInt(deliveryPartner))?.DeliveryPartnerName}
                  </strong>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select an order to start packing</p>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          </div>

          {selectedOrder ? (
            <div className="p-4">
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-1">
                    <p className="text-sm"><strong>Name:</strong> {selectedOrder.customerName}</p>
                    <p className="text-sm flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span><strong>Address:</strong> {selectedOrder.customerAddress}</span>
                    </p>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span><strong>Primary:</strong> {selectedOrder.customerMobile}</span>
                    </p>
                    {selectedOrder.customerSecondaryMobile && (
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span><strong>Secondary:</strong> {selectedOrder.customerSecondaryMobile}</span>
                      </p>
                    )}
                    <p className="text-sm"><strong>City:</strong> {selectedOrder.cityName}</p>
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Order Information
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-1">
                    <p className="text-sm"><strong>Order ID:</strong> #{selectedOrder.id}</p>
                    <p className="text-sm"><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                    <p className="text-sm"><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
                    <p className="text-sm"><strong>Total Amount:</strong> Rs. {selectedOrder.totalAmount.toLocaleString()}</p>
                    {selectedOrder.remark && (
                      <p className="text-sm"><strong>Remark:</strong> {selectedOrder.remark}</p>
                    )}
                  </div>
                </div>

                {/* Scanned Items History */}
                {scannedItems.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Scan History</h3>
                    <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
                      {scannedItems.map((item, index) => (
                        <div key={index} className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">{item.timestamp}</span> - {item.name} (Qty: {item.scannedQuantity})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Indicator */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Packing Progress</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedOrder.items.map((item) => {
                      const scannedItem = scannedItems.find(s => s.id === item.id);
                      const scannedQty = scannedItem ? scannedItem.scannedQuantity : 0;
                      const progress = (scannedQty / item.quantity) * 100;

                      return (
                        <div key={item.id} className="mb-2 last:mb-0">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{item.name}</span>
                            <span>{scannedQty}/{item.quantity}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Order details will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackOrderUI;