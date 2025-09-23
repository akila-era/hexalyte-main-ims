import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Package, AlertCircle, Search, Filter, Ban } from "lucide-react";
import { createAxiosInstance } from "api/axiosInstance";
import TrackingNumberAddModal from "components/Modal/TrackingNumberAddModal";

function TrackingNumbers() {
  const [trackingNumbers, setTrackingNumbers] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [partnerFilter, setPartnerFilter] = useState("ALL");

  const filteredData = trackingNumbers.filter(item => {
    const matchesSearch = item.DeliveryPartner?.DeliveryPartnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.minimum.toString().includes(searchTerm) ||
      item.maximum.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchesPartner = partnerFilter === "ALL" || item.DeliveryPartnerID.toString() === partnerFilter;

    return matchesSearch && matchesStatus && matchesPartner;
  });

  const getStatusBadge = (status, remaining) => {
    if (remaining === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Exhausted</span>;
    }
    if (status === "ENABLE") {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Disabled</span>;
  };

  const getUsagePercentage = (minimum, maximum, remaining) => {
    const total = maximum - minimum + 1;
    const used = total - remaining;
    return Math.round((used / total) * 100);
  };

  // const Modal = ({ show, onClose, title, children }) => {
  //     if (!show) return null;

  //     return (
  //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  //             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
  //                 <div className="flex justify-between items-center mb-4">
  //                     <h2 className="text-xl font-semibold">{title}</h2>
  //                     <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
  //                         ×
  //                     </button>
  //                 </div>
  //                 <form onSubmit={handleSubmit}>
  //                     <div className="space-y-4">
  //                         <div>
  //                             <label className="block text-sm font-medium text-gray-700 mb-1">
  //                                 Delivery Partner
  //                             </label>
  //                             <select
  //                                 value={formData.DeliveryPartnerID}
  //                                 onChange={handlePartnerChange}
  //                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                                 required
  //                             >
  //                                 <option value="">Select Partner</option>
  //                                 {deliveryPartners.map(partner => (
  //                                     <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
  //                                         {partner.DeliveryPartnerName}
  //                                     </option>
  //                                 ))}
  //                             </select>
  //                         </div>

  //                         <div className="grid grid-cols-2 gap-4">
  //                             <div>
  //                                 <label className="block text-sm font-medium text-gray-700 mb-1">
  //                                     Minimum Number
  //                                 </label>
  //                                 <input
  //                                     type="number"
  //                                     value={formData.minimum}
  //                                     onChange={handleMinimumChange}
  //                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                                     required
  //                                 />
  //                             </div>
  //                             <div>
  //                                 <label className="block text-sm font-medium text-gray-700 mb-1">
  //                                     Maximum Number
  //                                 </label>
  //                                 <input
  //                                     type="number"
  //                                     value={formData.maximum}
  //                                     onChange={handleMaximumChange}
  //                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
  //                                     required
  //                                 />
  //                             </div>
  //                         </div>

  //                         {/* {formData.minimum && formData.maximum && (
  //                             <div className="bg-blue-50 p-3 rounded-lg">
  //                                 <p className="text-sm text-blue-800">
  //                                     Total numbers in range: {(parseInt(formData.maximum) - parseInt(formData.minimum) + 1).toLocaleString()}
  //                                 </p>
  //                             </div>
  //                         )} */}
  //                     </div>

  //                     <div className="flex justify-end gap-3 mt-6">
  //                         <button
  //                             type="button"
  //                             onClick={() => {
  //                                 setShowEditModal(false);
  //                                 setEditingItem(null);
  //                                 resetForm();
  //                             }}
  //                             className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
  //                         >
  //                             Cancel
  //                         </button>
  //                         <button
  //                             type="submit"
  //                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  //                         >
  //                             Update Range
  //                         </button>
  //                     </div>
  //                 </form>
  //             </div>
  //         </div>
  //     );
  // };

  async function toggleTrackingNumberRangeStatus(id) {
    try {

      const api = createAxiosInstance();
      const trackingNumberRangeStatus = await api.put(`trackingnumbers/${id}`);

      console.log(trackingNumberRangeStatus);

    } catch (e) {
      console.log(e);
    }
  }

  async function fetchDeliveryPartners() {

    try {

      const api = createAxiosInstance();
      const deliveryPartnersRes = await api.get("deliverypartner");

      if (deliveryPartnersRes.status === 200) {
        setDeliveryPartners(deliveryPartnersRes.data.allDeliveryPartners);
      }

    } catch (error) {
      console.log(error);
    }

  }

  async function fetchTrackingNumbers() {

    try {

      const api = createAxiosInstance();
      const trackingNumbersRes = await api.get("trackingnumbers");

      if (trackingNumbersRes.status === 200) {
        setTrackingNumbers(trackingNumbersRes.data.allTrackingNumbers);
      }

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    fetchDeliveryPartners();
    fetchTrackingNumbers();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tracking Numbers Management</h1>
              <p className="text-gray-600 mt-1">Manage tracking number ranges for delivery partners</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Range
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by partner or range..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ENABLE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Partners</option>
                {deliveryPartners.map(partner => (
                  <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID.toString()}>
                    {partner.DeliveryPartnerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <Package className="text-blue-500" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Ranges</p>
                                <p className="text-2xl font-semibold">{trackingNumbers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <Package className="text-green-500" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Active Ranges</p>
                                <p className="text-2xl font-semibold">
                                    {trackingNumbers.filter(t => t.status === 'ENABLE').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <Package className="text-orange-500" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Available</p>
                                <p className="text-2xl font-semibold">
                                    {trackingNumbers.reduce((sum, t) => sum + t.remaining, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500" size={24} />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Exhausted</p>
                                <p className="text-2xl font-semibold">
                                    {trackingNumbers.filter(t => t.remaining === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => {
                const usagePercentage = getUsagePercentage(item.minimum, item.maximum, item.remaining);
                const total = item.maximum - item.minimum + 1;

                return (
                  <tr key={item.ID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.DeliveryPartner?.DeliveryPartnerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.minimum.toLocaleString()} - {item.maximum.toLocaleString()}
                      <div className="text-xs text-gray-500">
                        ({total.toLocaleString()} total)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600">{item.currentValue}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.remaining.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status, item.remaining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center">
                        {/* <button
                                                        // onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit size={16} />
                                                    </button> */}
                        <button
                          onClick={() => toggleTrackingNumberRangeStatus(item.ID)}
                          className="text-red-600 hover:text-red-900 border-2 p-2 rounded border-red-600"
                        >
                          <Ban size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tracking number ranges</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new range.</p>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {/* <Modal
                    show={showAddModal}
                    onClose={() => {
                        setShowAddModal(false);
                        resetForm();
                    }}
                    title="Add Tracking Number Range"
                /> */}

        {showAddModal && <TrackingNumberAddModal deliveryPartners={deliveryPartners} setShowModal={setShowAddModal}
                                                 fetchTrackingNumbers={fetchTrackingNumbers} />}

        {/* Edit Modal */}
        {/* <Modal
                    show={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        resetForm();
                    }}
                    title="Edit Tracking Number Range"
                >
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Delivery Partner
                                </label>
                                <select
                                    value={formData.DeliveryPartnerID}
                                    onChange={(e) => setFormData(prev => ({ ...prev, DeliveryPartnerID: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Partner</option>
                                    {deliveryPartners.map(partner => (
                                        <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
                                            {partner.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Number
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.minimum}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minimum: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Number
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maximum}
                                        onChange={(e) => setFormData(prev => ({ ...prev, maximum: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="ENABLE">Enable</option>
                                    <option value="DISABLED">Disabled</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActiveEdit"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-700">
                                    Active
                                </label>
                            </div>

                            {formData.minimum && formData.maximum && (
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        Total numbers in range: {(parseInt(formData.maximum) - parseInt(formData.minimum) + 1).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingItem(null);
                                    resetForm();
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Update Range
                            </button>
                        </div>
                    </form>
                </Modal> */}
      </div>
    </div>
  );
}

export default TrackingNumbers;


