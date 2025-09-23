// import React from "react";

// // components

// import CardLineChart from "components/Cards/CardLineChart.js";
// import CardBarChart from "components/Cards/CardBarChart.js";
// import CardPageVisits from "components/Cards/CardPageVisits.js";
// import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
// import HeaderStats from "components/Headers/HeaderStats";
// // import AdminNavbar from "components/Navbars/AdminNavbar.js";

// export default function Dashboard() {
//   return (
//     <>
//       {/* <AdminNavbar/> */}
//       <HeaderStats />
//       <div className="-mt-24">
//         <div className="flex flex-wrap">
//           <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
//             <CardLineChart />
//           </div>
//           <div className="w-full xl:w-4/12 px-4">
//             <CardBarChart />
//           </div>
//         </div>
//         <div className="flex flex-wrap mt-4">
//           <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
//             <CardPageVisits />
//           </div>
//           <div className="w-full xl:w-4/12 px-4">
//             <CardSocialTraffic />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  Settings,
  Upload,
  Download,
  Eye,
  Edit,
  Printer
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDateRange, setSelectedDateRange] = useState('week');

  // Sample data
  const stats = {
    totalRevenue: 45240,
    totalOrders: 1247,
    activeDeliveries: 89,
    customerAds: 2340
  };

  const deliveries = [
    { id: 'DLV001', orderId: 'ORD123', customer: 'John Doe', carrier: 'FastEx', status: 'OUT_FOR_DELIVERY', date: '2025-07-02' },
    { id: 'DLV002', orderId: 'ORD124', customer: 'Jane Smith', carrier: 'QuickShip', status: 'DELIVERED', date: '2025-07-02' },
    { id: 'DLV003', orderId: 'ORD125', customer: 'Mike Johnson', carrier: 'FastEx', status: 'TO_DELIVER', date: '2025-07-01' },
    { id: 'DLV004', orderId: 'ORD126', customer: 'Sarah Wilson', carrier: 'Internal', status: 'SUBMITTED', date: '2025-07-01' }
  ];

  const recentAds = [
    { id: 1, customerName: 'Alice Brown', product: 'Smart TV', city: 'Colombo', mobile: '+94771234567', status: 'Active' },
    { id: 2, customerName: 'Bob Davis', product: 'Laptop', city: 'Kandy', mobile: '+94771234568', status: 'Pending' },
    { id: 3, customerName: 'Carol White', product: 'Smartphone', city: 'Galle', mobile: '+94771234569', status: 'Active' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'OUT_FOR_DELIVERY': return 'text-blue-600 bg-blue-100';
      case 'SUBMITTED': return 'text-yellow-600 bg-yellow-100';
      case 'TO_DELIVER': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {change > 0 ? (
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last {selectedDateRange}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'deliveries', label: 'Deliveries', icon: Truck },
            { id: 'customers', label: 'Customer', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: PieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                change={12.5}
                icon={DollarSign}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                change={8.2}
                icon={Package}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                title="Active Deliveries"
                value={stats.activeDeliveries}
                change={-3.1}
                icon={Truck}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
              <StatCard
                title="Customer"
                value={stats.customerAds.toLocaleString()}
                change={15.8}
                icon={Users}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Revenue</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Orders</span>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <QuickActionCard
                    title="Create Delivery"
                    description="Schedule new delivery"
                    icon={Truck}
                    color="bg-blue-500"
                    onClick={() => console.log('Create delivery')}
                  />
                  <QuickActionCard
                    title="Upload Customers"
                    description="Bulk upload via Excel/CSV"
                    icon={Upload}
                    color="bg-green-500"
                    onClick={() => console.log('Upload ads')}
                  />
                  <QuickActionCard
                    title="Generate Report"
                    description="Download analytics report"
                    icon={Download}
                    color="bg-purple-500"
                    onClick={() => console.log('Generate report')}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Deliveries */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {deliveries.slice(0, 3).map(delivery => (
                    <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{delivery.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                            {delivery.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{delivery.customer} • {delivery.carrier}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Customer Ads */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Customer Ads</h3>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View All</button>
                </div>
                <div className="space-y-3">
                  {recentAds.map(ad => (
                    <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{ad.customerName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {ad.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{ad.product} • {ad.city}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deliveries' && (
          <div className="space-y-6">
            {/* Delivery Management Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Delivery Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Create Delivery</span>
              </button>
            </div>

            {/* Delivery Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">To Deliver</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Submitted</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">15</p>
                    <p className="text-sm text-gray-600">Out for Delivery</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">All Deliveries</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Status</option>
                      <option>To Deliver</option>
                      <option>Submitted</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Carriers</option>
                      <option>FastEx</option>
                      <option>QuickShip</option>
                      <option>Internal</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Delivery ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Carrier</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deliveries.map(delivery => (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{delivery.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{delivery.orderId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{delivery.customer}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{delivery.carrier}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                              {delivery.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{delivery.date}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-purple-600">
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            {/* Customer Ads Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Customer Management</h2>
              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download Template</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Bulk Upload</span>
                </button>
              </div>
            </div>

            {/* Upload Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Upload Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-gray-600">Total Uploaded</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">1,195</p>
                  <p className="text-sm text-gray-600">Successfully Processed</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">52</p>
                  <p className="text-sm text-gray-600">Failed Records</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">95.8%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Customer Ads Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Cities</option>
                      <option>Colombo</option>
                      <option>Kandy</option>
                      <option>Galle</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>All Products</option>
                      <option>Smart TV</option>
                      <option>Laptop</option>
                      <option>Smartphone</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">City</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Mobile 1</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Mobile 2</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentAds.map(ad => (
                        <tr key={ad.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{ad.customerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ad.product}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ad.city}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{ad.mobile}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">-</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                              {ad.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Delivery success rate over time</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">96.8%</p>
                    <p className="text-sm text-gray-500">Average success rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Engagement</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Ad campaign effectiveness</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">24.3%</p>
                    <p className="text-sm text-gray-500">Conversion rate</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Monthly revenue breakdown</p>
                    <p className="text-2xl font-bold text-green-600 mt-2">$45.2K</p>
                    <p className="text-sm text-gray-500">This month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance by city</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Colombo</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Kandy</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Galle</span>
                        <span className="text-sm font-medium">27%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">2.3 days</p>
                  <p className="text-sm text-gray-600 mb-2">Average Delivery Time</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ↓ 0.5 days vs last month
                  </span>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-1">98.2%</p>
                  <p className="text-sm text-gray-600 mb-2">Customer Satisfaction</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ↑ 2.1% vs last month
                  </span>
                </div>

                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600 mb-1">1,247</p>
                  <p className="text-sm text-gray-600 mb-2">Active Customers</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ↑ 15.8% vs last month
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Reports */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
                <p className="text-sm text-gray-600">Generate comprehensive reports for analysis</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Delivery Report</span>
                  </div>
                  <p className="text-sm text-gray-600">Complete delivery analytics and performance metrics</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Customer Report</span>
                  </div>
                  <p className="text-sm text-gray-600">Customer engagement and advertisement effectiveness</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Financial Report</span>
                  </div>
                  <p className="text-sm text-gray-600">Revenue analysis and financial performance</p>
                </button>

                <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-gray-900">Executive Summary</span>
                  </div>
                  <p className="text-sm text-gray-600">High-level overview for management review</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2025 Hexa VIMS. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Last updated: July 02, 2025 at 10:30 AM</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}