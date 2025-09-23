import { useEffect, useState } from "react";
import { AlertCircle, Edit, Eye, EyeOff, Plus, Search, Trash, X } from "lucide-react";
import { createAxiosInstance } from "../../api/axiosInstance";
import Swal from "sweetalert2";

function ManageDeliveryCompanies(){

  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newDeliveryPartner, setNewDeliveryPartner] = useState({
    DeliveryPartnerName: "",
  });

  async function fetchDeliveryPartners(){
    try {

      const api = createAxiosInstance();
      const response = await api.get('deliverypartner')

      console.log(response)

      if (response.status === 200) {
        setDeliveryPartners(response.data.allDeliveryPartners);
      }

    } catch (e) {
      console.log(e);
    }
  }

  // Simulated API data based on your structure
  useEffect(() => {

    fetchDeliveryPartners()

    // Simulate fetching data
    // const mockData = [
    //   {
    //     DeliveryPartnerID: 1,
    //     DeliveryPartnerName: "DHL",
    //     isActive: 1,
    //     createdAt: "2025-08-16T20:23:16.000Z",
    //     updatedAt: "2025-08-16T20:23:16.000Z",
    //     deletedAt: null
    //   },
    //   {
    //     DeliveryPartnerID: 2,
    //     DeliveryPartnerName: "FedEx",
    //     isActive: 1,
    //     createdAt: "2025-08-15T10:15:30.000Z",
    //     updatedAt: "2025-08-15T10:15:30.000Z",
    //     deletedAt: null
    //   },
    //   {
    //     DeliveryPartnerID: 3,
    //     DeliveryPartnerName: "UPS",
    //     isActive: 0,
    //     createdAt: "2025-08-14T08:45:20.000Z",
    //     updatedAt: "2025-08-17T14:30:10.000Z",
    //     deletedAt: null
    //   }
    // ];
    //
    // setDeliveryPartners(mockData);



  }, []);

  // Filter partners based on search term
  const filteredPartners = deliveryPartners.filter(partner =>
    partner.DeliveryPartnerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new delivery partner
  const handleAddPartner = async (partnerData) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      const newPartner = {
        // DeliveryPartnerID: Date.now(), // Mock ID
        DeliveryPartnerName: partnerData.name,
        isActive: partnerData.isActive ? 1 : 0,
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
        // deletedAt: null
      };

      const api = createAxiosInstance();
      const response = await api.post('deliverypartner', newPartner)

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Delivery Partner added',
        })
        fetchDeliveryPartners();
      }

      // setDeliveryPartners(prev => [...prev, newPartner]);
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add delivery partner');
    } finally {
      setLoading(false);
    }
  };

  // Update delivery partner
  const handleUpdatePartner = async (partnerData) => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      const updatedPartner = {
        ...selectedPartner,
        DeliveryPartnerName: partnerData.name,
        isActive: partnerData.isActive ? 1 : 0,
        updatedAt: new Date().toISOString()
      };

      const api = createAxiosInstance();
      const response = await api.put(`deliverypartner/${selectedPartner.DeliveryPartnerID}`, updatedPartner)

      console.log(response)

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Delivery Partner updated',
        })
        fetchDeliveryPartners();
      }

      setShowEditModal(false);
      setSelectedPartner(null);
    } catch (err) {
      setError('Failed to update delivery partner');
    } finally {
      setLoading(false);
    }
  };

  // Delete delivery partner
  const handleDeletePartner = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      setDeliveryPartners(prev =>
        prev.filter(partner => partner.DeliveryPartnerID !== selectedPartner.DeliveryPartnerID)
      );
      setShowDeleteModal(false);
      setSelectedPartner(null);
    } catch (err) {
      setError('Failed to delete delivery partner');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Delivery Partner Management</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
              Add New Partner
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search delivery partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Partners Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No partners found matching your search.' : 'No delivery partners found.'}
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.DeliveryPartnerID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {partner.DeliveryPartnerID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {partner.DeliveryPartnerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          partner.isActive === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {partner.isActive === 1 ? (
                            <>
                              <Eye size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              Inactive
                            </>
                          )}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(partner.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(partner.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPartner(partner);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                          disabled={loading}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPartner(partner);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          disabled={loading}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Partner Modal */}
        {showAddModal && (
          <PartnerFormModal
            title="Add New Delivery Partner"
            onClose={() => setShowAddModal(false)}
            onSave={handleAddPartner}
            loading={loading}
          />
        )}

        {/* Edit Partner Modal */}
        {showEditModal && selectedPartner && (
          <PartnerFormModal
            title="Edit Delivery Partner"
            partner={selectedPartner}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPartner(null);
            }}
            onSave={handleUpdatePartner}
            loading={loading}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedPartner && (
          <DeleteConfirmationModal
            partner={selectedPartner}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedPartner(null);
            }}
            onConfirm={handleDeletePartner}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

// Partner Form Modal (for Add/Edit)
const PartnerFormModal = ({ title, partner, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: partner?.DeliveryPartnerName || '',
    isActive: partner?.isActive === 1 || !partner
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Partner name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Partner name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter partner name"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                  disabled={loading}
                />
                <span className="text-sm font-medium text-gray-700">Active Partner</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ partner, onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold">Delete Delivery Partner</h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{partner.DeliveryPartnerName}</strong>?
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

}

export default ManageDeliveryCompanies