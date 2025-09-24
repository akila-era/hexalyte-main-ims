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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Package, Scan, Check, X, User, MapPin, Phone, Calendar, Truck, 
  AlertCircle, CheckCircle2, Clock, Camera, Zap, BarChart3, 
  Volume2, VolumeX, Maximize2, Minimize2, Search, Filter,
  PlayCircle, PauseCircle, RotateCcw, Target, TrendingUp,
  Settings, Bell, Download, Upload, RefreshCw
} from 'lucide-react';
import { createAxiosInstance } from "../../api/axiosInstance";
import Swal from 'sweetalert2';

const PackOrderUI = () => {
  // Basic states
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

  // Advanced UI states
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanMode, setScanMode] = useState('single'); // single, batch, continuous
  const [batchScans, setBatchScans] = useState([]);
  const [scanningActive, setScanningActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [packingTimer, setPackingTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Refs
  const barcodeInputRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const scanHistoryRef = useRef([]);

  // Transform server data to component format
  const transformOrderData = (serverOrder) => {
    console.log('Transforming order:', serverOrder);
    
    const totalAmount = serverOrder.NewOrderItems?.reduce((total, item) =>
      total + (item.UnitPrice * item.Quantity), 0) || 0;

    const transformedOrder = {
      id: serverOrder.NewOrderID,
      customerName: serverOrder.CustomerName || 'Unknown Customer',
      customerAddress: serverOrder.CustomerAddress || 'No address provided',
      customerMobile: serverOrder.PrimaryPhone || 'No phone',
      customerSecondaryMobile: serverOrder.SecondaryPhone || '',
      cityName: serverOrder.CityName || 'Unknown City',
      status: serverOrder.Status?.toLowerCase() || 'confirmed',
      orderDate: serverOrder.createdAt ? new Date(serverOrder.createdAt).toLocaleDateString() : 'Unknown',
      deliveryDate: serverOrder.deliveryDate || 'TBD',
      totalAmount: totalAmount,
      remark: serverOrder.Remark || '',
      items: serverOrder.NewOrderItems?.map(item => {
        console.log('Transforming item:', item);
        return {
        id: item.NewOrderRowID,
          name: item.subProduct?.product?.Name || `Product ${item.subProduct?.ProductID || 'Unknown'}`,
          sku: item.subProduct?.serialNumber || `SP-${item.SubProductID}`,
          barcode: item.subProduct?.serialNumber || `SP-${item.SubProductID}`,
          quantity: item.Quantity || 1,
          unitPrice: item.UnitPrice || 0,
        subProductId: item.SubProductID,
          productId: item.subProduct?.ProductID || null,
          status: item.subProduct?.status || 'ALLOCATED'
        };
      }) || []
    };

    console.log('Transformed order:', transformedOrder);
    return transformedOrder;
  };

  // Audio feedback
  const playSound = useCallback((type) => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    } else if (type === 'error') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
    } else if (type === 'complete') {
      // Play a sequence of notes for completion
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [soundEnabled]);

  // Timer functions
  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setPackingTimer(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const resetTimer = useCallback(() => {
    setPackingTimer(0);
    stopTimer();
  }, [stopTimer]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setScannedItems([]);
    setPackingStatus('pending');
    setBarcodeInput('');
    setDeliveryPartner('');
    setTrackingNumber('');
    setBatchScans([]);
    setScanHistory([]);
    resetTimer();
    
    // Auto-focus barcode input
    setTimeout(() => {
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    }, 100);
  };

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim() || !selectedOrder) return;

    const trimmedBarcode = barcodeInput.trim();
    console.log('Scanning barcode:', trimmedBarcode);
    console.log('Available items:', selectedOrder.items);

    // Try multiple matching strategies
    const matchingItem = selectedOrder.items.find(item => {
      const matches = [
        item.barcode === trimmedBarcode,
        item.sku === trimmedBarcode,
        item.barcode?.toLowerCase() === trimmedBarcode.toLowerCase(),
        item.sku?.toLowerCase() === trimmedBarcode.toLowerCase(),
        // Try matching without spaces or special characters
        item.barcode?.replace(/[\s-]/g, '') === trimmedBarcode.replace(/[\s-]/g, ''),
        item.sku?.replace(/[\s-]/g, '') === trimmedBarcode.replace(/[\s-]/g, ''),
        // Try partial matching
        item.barcode?.includes(trimmedBarcode),
        trimmedBarcode.includes(item.barcode || ''),
      ];
      
      console.log(`Checking item ${item.name} (${item.barcode}/${item.sku}):`, matches);
      return matches.some(match => match);
    });

    const scanTime = new Date();
    const scanRecord = {
      barcode: barcodeInput,
      timestamp: scanTime.toLocaleTimeString(),
      success: !!matchingItem,
      item: matchingItem?.name || 'Unknown Item'
    };

    // Add to scan history
    setScanHistory(prev => [scanRecord, ...prev.slice(0, 49)]); // Keep last 50 scans

    if (matchingItem) {
      const existingScanned = scannedItems.find(item => item.id === matchingItem.id);

      if (existingScanned) {
        if (existingScanned.scannedQuantity < matchingItem.quantity) {
          setScannedItems(prev =>
            prev.map(item =>
              item.id === matchingItem.id
                ? { ...item, scannedQuantity: item.scannedQuantity + 1, lastScanned: scanTime }
                : item
            )
          );
          playSound('success');
          
          // Show success toast
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Scanned: ${matchingItem.name}`,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        } else {
          playSound('error');
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Item already fully scanned',
            showConfirmButton: false,
            timer: 2000
          });
        }
      } else {
        setScannedItems(prev => [...prev, {
          ...matchingItem,
          scannedQuantity: 1,
          timestamp: scanTime.toLocaleTimeString(),
          lastScanned: scanTime
        }]);
        playSound('success');
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Scanned: ${matchingItem.name}`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
      }

      if (packingStatus === 'pending') {
        setPackingStatus('in-progress');
        startTimer();
      }
    } else {
      playSound('error');
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Barcode not found in this order',
        text: `Scanned: ${barcodeInput}`,
        showConfirmButton: false,
        timer: 3000
      });
    }

    setBarcodeInput('');
    
    // Auto-focus for continuous scanning
    setTimeout(() => {
      if (barcodeInputRef.current && scanMode === 'continuous') {
        barcodeInputRef.current.focus();
      }
    }, 100);
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
      Swal.fire({
        icon: 'warning',
        title: 'Delivery Partner Required',
        text: 'Please select a delivery partner before completing the package.',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    try {
      const generatedTrackingNumber = 'TRK-' + Date.now().toString().slice(-8);
      
      Swal.fire({
        title: 'Completing Package...',
        text: 'Please wait while we finalize your package',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });

      // You can add API call here to update order status
      // const api = createAxiosInstance();
      // await api.put(`/neworder/${selectedOrder.id}`, {
      //   status: 'packed',
      //   deliveryPartnerId: deliveryPartner,
      //   trackingNumber: generatedTrackingNumber
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPackingStatus('completed');
      setTrackingNumber(generatedTrackingNumber);
      stopTimer();
      playSound('complete');

      const selectedPartnerName = deliveryPartners.find(p => 
        p.DeliveryPartnerID === parseInt(deliveryPartner)
      )?.DeliveryPartnerName || 'Unknown';

      Swal.fire({
        icon: 'success',
        title: 'Package Completed Successfully! 🎉',
        html: `
          <div class="text-center space-y-3">
            <div class="bg-green-50 p-4 rounded-lg">
              <p><strong>Order:</strong> #${selectedOrder.id}</p>
              <p><strong>Customer:</strong> ${selectedOrder.customerName}</p>
              <p><strong>Items Packed:</strong> ${scannedItems.length}/${selectedOrder.items.length}</p>
              <p><strong>Packing Time:</strong> ${formatTime(packingTimer)}</p>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p><strong>Tracking Number:</strong> <code class="bg-gray-200 px-2 py-1 rounded">${generatedTrackingNumber}</code></p>
              <p><strong>Delivery Partner:</strong> ${selectedPartnerName}</p>
            </div>
          </div>
        `,
        confirmButtonText: 'Start Next Order',
        confirmButtonColor: '#10b981',
        showCancelButton: true,
        cancelButtonText: 'Stay Here',
        cancelButtonColor: '#6b7280'
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset for next order
          setSelectedOrder(null);
          setScannedItems([]);
          setBarcodeInput('');
          setPackingStatus('pending');
          setDeliveryPartner('');
          setTrackingNumber('');
          resetTimer();
        }
      });
    } catch (error) {
      console.error('Error completing package:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Completing Package',
        text: error.message || 'Please try again.',
        confirmButtonColor: '#ef4444'
      });
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
      console.log('Fetching orders...');
      const api = createAxiosInstance();
      const response = await api.get("/neworder");

      console.log('Orders API Response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status === 200) {
        const ordersData = response.data.data || response.data || [];
        console.log('Raw orders data:', ordersData);
        
        if (Array.isArray(ordersData)) {
          // Filter only confirmed and processing orders for packing
          const packableOrders = ordersData.filter(order => 
            order.Status === 'Confirmed' || order.Status === 'Processing'
          );
          
          console.log('Packable orders:', packableOrders);
          
          const transformedOrders = packableOrders.map(transformOrderData);
          console.log('Transformed orders:', transformedOrders);
          
        setOrders(transformedOrders);
        } else {
          console.error('Orders data is not an array:', ordersData);
          setError('Invalid data format received from server');
        }
      } else {
        console.error('Unexpected response status:', response.status);
        setError(`Server returned status: ${response.status}`);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
      console.error('Error details:', e.response?.data);
      setError(`Failed to load orders: ${e.message}`);
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

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-focus barcode input when order is selected
  useEffect(() => {
    if (selectedOrder && barcodeInputRef.current) {
      const timer = setTimeout(() => {
        barcodeInputRef.current.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedOrder]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + F for search focus
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search orders"]');
        if (searchInput) searchInput.focus();
      }
      
      // Escape to clear barcode input
      if (e.key === 'Escape' && barcodeInputRef.current) {
        setBarcodeInput('');
        barcodeInputRef.current.focus();
      }
      
      // F11 for fullscreen toggle
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

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
              <h3 className="text-sm font-medium text-red-800">Error Loading Pack Order Data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3 space-y-2">
              <button
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      await Promise.all([fetchOrders(), fetchDeliveryPartners()]);
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
                    // Try to load with sample data for testing
                    const sampleOrders = [
                      {
                        id: 5,
                        customerName: 'sd',
                        customerAddress: 'Test Address',
                        customerMobile: '1234567890',
                        status: 'processing',
                        orderDate: new Date().toLocaleDateString(),
                        totalAmount: 500,
                        items: [{
                          id: 1,
                          name: 'Product 1',
                          sku: 'PRDCT 1-1-11',
                          barcode: 'PRDCT 1-1-11',
                          quantity: 1,
                          unitPrice: 500,
                          status: 'ALLOCATED'
                        }]
                      }
                    ];
                    setOrders(sampleOrders);
                    setError(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Load Sample Data
              </button>
              </div>
              <div className="mt-3 text-xs text-red-600">
                <details>
                  <summary className="cursor-pointer">Troubleshooting Tips</summary>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Check if the backend API is running</li>
                    <li>Verify authentication token is valid</li>
                    <li>Ensure orders exist with 'Confirmed' or 'Processing' status</li>
                    <li>Check browser console for detailed errors</li>
                  </ul>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders based on search and filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'confirmed' && order.status === 'confirmed') ||
      (filterStatus === 'processing' && order.status === 'processing');
    
    return matchesSearch && matchesFilter;
  });

  // Calculate analytics
  const analytics = {
    totalOrders: orders.length,
    completedToday: 0, // This would come from API in real implementation
    averagePackTime: '5:30', // This would be calculated from historical data
    scanAccuracy: scanHistory.length > 0 ? 
      ((scanHistory.filter(s => s.success).length / scanHistory.length) * 100).toFixed(1) : 100,
    currentOrderProgress: selectedOrder ? 
      ((scannedItems.reduce((acc, item) => acc + item.scannedQuantity, 0) / 
        selectedOrder.items.reduce((acc, item) => acc + item.quantity, 0)) * 100).toFixed(1) : 0
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full mx-auto p-6 min-h-screen'}`}>
      {/* Enhanced Header with Controls */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Pack Orders
              {selectedOrder && (
                <span className="text-lg text-blue-600 font-normal">
                  - Order #{selectedOrder.id}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Advanced barcode scanning and order packing system</p>
          </div>
          
          {/* Control Panel */}
          <div className="flex items-center gap-3">
            {/* Timer Display */}
            {packingStatus === 'in-progress' && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-blue-800">{formatTime(packingTimer)}</span>
                <button
                  onClick={isTimerRunning ? stopTimer : startTimer}
                  className="p-1 hover:bg-blue-100 rounded"
                >
                  {isTimerRunning ? 
                    <PauseCircle className="w-4 h-4 text-blue-600" /> : 
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                  }
                </button>
              </div>
            )}
            
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              title={soundEnabled ? 'Sound On' : 'Sound Off'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            
            {/* Analytics Toggle */}
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`p-2 rounded-lg ${showAnalytics ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}
              title="Toggle Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            
            {/* Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        {showAnalytics && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-800">{analytics.totalOrders}</p>
                </div>
                <Package className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-800">{analytics.completedToday}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Avg Pack Time</p>
                  <p className="text-2xl font-bold text-purple-800">{analytics.averagePackTime}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Scan Accuracy</p>
                  <p className="text-2xl font-bold text-orange-800">{analytics.scanAccuracy}%</p>
                </div>
                <Target className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600">Current Progress</p>
                  <p className="text-2xl font-bold text-indigo-800">{analytics.currentOrderProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by customer name or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="processing">Processing Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pack Orders ({filteredOrders.length} of {orders.length})
            </h2>
            {orders.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Showing Confirmed & Processing orders
              </div>
            )}
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>{searchTerm || filterStatus !== 'all' ? 'No orders match your search criteria' : 'No orders available for packing'}</p>
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedOrder?.id === order.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleOrderSelect(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'processing' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customerName}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{order.items.length} items • Rs. {order.totalAmount.toLocaleString()}</p>
                    <p>{order.customerMobile} • {order.cityName}</p>
                    {order.items.length > 0 && (
                      <p className="text-gray-400">
                        Products: {order.items.map(item => item.name).join(', ')}
                      </p>
                    )}
                  </div>
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
              {/* Enhanced Barcode Scanner */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Advanced Barcode Scanner
                </label>
                  
                  {/* Scan Mode Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Mode:</span>
                    <select
                      value={scanMode}
                      onChange={(e) => setScanMode(e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      disabled={packingStatus === 'completed'}
                    >
                      <option value="single">Single</option>
                      <option value="continuous">Continuous</option>
                      <option value="batch">Batch</option>
                    </select>
                  </div>
                </div>

                {/* Scanner Input with Enhanced UI */}
                <div className="relative">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                  <input
                        ref={barcodeInputRef}
                    type="text"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeSubmit(e);
                      }
                    }}
                        onFocus={() => setScanningActive(true)}
                        onBlur={() => setScanningActive(false)}
                        placeholder={`${scanMode === 'continuous' ? 'Continuous scanning mode - keep scanning...' : 
                          scanMode === 'batch' ? 'Batch mode - scan multiple items...' : 
                          'Scan or enter barcode/serial number...'}`}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all
                          ${scanningActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                          ${packingStatus === 'completed' ? 'bg-gray-100' : ''}
                        `}
                    disabled={packingStatus === 'completed'}
                        autoComplete="off"
                      />
                      
                      {/* Scanner Status Indicator */}
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        scanningActive ? 'text-blue-500' : 'text-gray-400'
                      }`}>
                        {scanningActive ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs">Ready</span>
                          </div>
                        ) : (
                          <Scan className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                  <button
                    onClick={(e) => handleBarcodeSubmit(e)}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      disabled={packingStatus === 'completed' || !barcodeInput.trim()}
                  >
                      <Scan className="w-5 h-5" />
                  </button>
                    
                    {scanMode === 'batch' && (
                      <button
                        onClick={() => setBatchScans([])}
                        className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                        disabled={packingStatus === 'completed' || batchScans.length === 0}
                        title="Clear batch"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                </div>
                  
                  {/* Scanner Feedback */}
                  {scanMode === 'continuous' && scanningActive && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      <span>Continuous scanning active - scan items rapidly</span>
                    </div>
                  )}
                  
                  {scanMode === 'batch' && batchScans.length > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Batch: {batchScans.length} items queued</span>
                    </div>
                  )}
                </div>

                {/* Available Barcodes for Current Order */}
                {selectedOrder && selectedOrder.items.length > 0 && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-blue-700 mb-2">Available Barcodes for This Order</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs p-2 bg-white rounded border">
                          <span className="font-medium text-gray-700">{item.name}</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-800">
                            {item.barcode}
                          </span>
                          <span className="text-gray-500">Qty: {item.quantity}</span>
                          <button
                            onClick={() => {
                              setBarcodeInput(item.barcode);
                              if (barcodeInputRef.current) {
                                barcodeInputRef.current.focus();
                              }
                            }}
                            className="ml-auto text-blue-600 hover:text-blue-800 p-1"
                            title="Click to fill barcode"
                          >
                            <Target className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scan History (Recent 5 scans) */}
                {scanHistory.length > 0 && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Recent Scans</h4>
                    <div className="space-y-1">
                      {scanHistory.slice(0, 5).map((scan, index) => (
                        <div key={index} className={`flex items-center gap-2 text-xs p-2 rounded ${
                          scan.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {scan.success ? 
                            <CheckCircle2 className="w-3 h-3" /> : 
                            <X className="w-3 h-3" />
                          }
                          <span className="font-mono">{scan.barcode}</span>
                          <span className="flex-1">{scan.item}</span>
                          <span className="text-gray-500">{scan.timestamp}</span>
                        </div>
                      ))}
                    </div>
                    {scanHistory.length > 5 && (
                      <button
                        onClick={() => setShowAnalytics(true)}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                      >
                        View all {scanHistory.length} scans
                      </button>
                    )}
                  </div>
                )}
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