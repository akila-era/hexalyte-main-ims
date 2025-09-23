
import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';

const EditNewOrderModal = ({ isOpen, onClose, orderData, extractedData, setExtractedData, setOriginalData }) => {
  const [formData, setFormData] = useState({
    OrderID: '',
    CustomerName: '',
    ProductName: '',
    OrderNote: '',
    CallStatus: '',
    CallAgent: '',
    id: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  // Populate form when orderData changes
  useEffect(() => {
    if (orderData) {
      setFormData(orderData);
    }
  }, [orderData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSave = () => {
    if (!orderData) return;
    
    const updatedData = extractedData.map(item => 
      item.OrderID === orderData.OrderID ? formData : item
    );
    
    setExtractedData(updatedData);
    setOriginalData(updatedData)
    setIsEditing(false);
    onClose();
  };

  // Handle cancel editing
  const handleCancel = () => {
    setFormData(orderData);
    setIsEditing(false);
  };

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Edit3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Order Details - ID: {orderData.OrderID}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                name="OrderID"
                value={formData.OrderID}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="CustomerName"
                value={formData.CustomerName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="ProductName"
                value={formData.ProductName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>

            {/* Call Agent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Agent
              </label>
              <input
                type="text"
                name="CallAgent"
                value={formData.CallAgent}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>

            {/* Call Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call Status
              </label>
              <select
                name="CallStatus"
                value={formData.CallStatus}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              >
                <option value="">Select Status</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
                <option value="NO_ANSWER">NO ANSWER</option>
                <option value="BUSY">BUSY</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing 
                    ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Order Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Note
            </label>
            <textarea
              name="OrderNote"
              value={formData.OrderNote}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                !isEditing 
                  ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              placeholder="Enter order notes..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {!isEditing ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditNewOrderModal