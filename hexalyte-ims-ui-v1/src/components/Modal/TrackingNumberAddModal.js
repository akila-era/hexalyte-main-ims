import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { createAxiosInstance } from 'api/axiosInstance';

function TrackingNumberAddModal({ deliveryPartners, fetchTrackingNumbers, setShowModal }) {
    const [formData, setFormData] = useState({
        minimum: '',
        maximum: '',
        status: 'ENABLE',
        DeliveryPartnerID: '',
        isActive: true
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.DeliveryPartnerID) {
            newErrors.DeliveryPartnerID = 'Delivery partner is required';
        }

        if (!formData.minimum) {
            newErrors.minimum = 'Minimum value is required';
        } else if (parseInt(formData.minimum) < 0) {
            newErrors.minimum = 'Minimum value must be positive';
        }

        if (!formData.maximum) {
            newErrors.maximum = 'Maximum value is required';
        } else if (parseInt(formData.maximum) < 0) {
            newErrors.maximum = 'Maximum value must be positive';
        }

        if (formData.minimum && formData.maximum) {
            if (parseInt(formData.maximum) <= parseInt(formData.minimum)) {
                newErrors.maximum = 'Maximum must be greater than minimum';
            }
        }

        if (formData.currentValue) {
            const current = parseInt(formData.currentValue);
            const min = parseInt(formData.minimum);
            const max = parseInt(formData.maximum);

            if (current < min) {
                newErrors.currentValue = 'Current value cannot be less than minimum';
            } else if (current > max) {
                newErrors.currentValue = 'Current value cannot be greater than maximum';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API
            const submitData = {
                ...formData,
                minimum: parseInt(formData.minimum),
                maximum: parseInt(formData.maximum),
                DeliveryPartnerID: parseInt(formData.DeliveryPartnerID)
            };

            // Calculate remaining
            // submitData.remaining = submitData.maximum - submitData.currentValue;

            // console.log(submitData)

            // Here you would make your API call
            const api = createAxiosInstance()
            const addTrackingNumbersRes = await api.post('trackingnumbers', submitData)

            console.log(addTrackingNumbersRes)

            // Simulate API call
            // await new Promise(resolve => setTimeout(resolve, 1000));

            setShowSuccess(true);

            // Reset form
            setFormData({
                minimum: '',
                maximum: '',
                status: 'ENABLE',
                DeliveryPartnerID: '',
                isActive: true
            });

            // Refresh the tracking numbers list
            if (fetchTrackingNumbers) {
                fetchTrackingNumbers();
            }

            // Close modal after showing success message
            setTimeout(() => {
                setShowModal(false);
            }, 1500);

        } catch (error) {
            console.error('Error creating tracking number range:', error);
            setErrors({ submit: 'Failed to create tracking number range. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setShowModal(false);
        }
    };

    const calculateRemaining = () => {
        const min = parseInt(formData.minimum) || 0;
        const max = parseInt(formData.maximum) || 0;
        return Math.max(0, (max - min) + 1);
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600">Tracking number range has been created successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Add Tracking Number Range</h3>
                        <p className="text-sm text-gray-600 mt-1">Create a new tracking number range for a delivery partner</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm text-red-700">{errors.submit}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Delivery Partner */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Partner <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="DeliveryPartnerID"
                                value={formData.DeliveryPartnerID}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.DeliveryPartnerID ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                disabled={loading}
                            >
                                <option value="">Select a delivery partner</option>
                                {deliveryPartners?.map(partner => (
                                    <option key={partner.DeliveryPartnerID} value={partner.DeliveryPartnerID}>
                                        {partner.DeliveryPartnerName}
                                    </option>
                                ))}
                            </select>
                            {errors.DeliveryPartnerID && (
                                <p className="mt-1 text-xs text-red-600">{errors.DeliveryPartnerID}</p>
                            )}
                        </div>

                        {/* Range Values */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="minimum"
                                    value={formData.minimum}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.minimum ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    disabled={loading}
                                />
                                {errors.minimum && (
                                    <p className="mt-1 text-xs text-red-600">{errors.minimum}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Maximum Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="maximum"
                                    value={formData.maximum}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.maximum ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    disabled={loading}
                                />
                                {errors.maximum && (
                                    <p className="mt-1 text-xs text-red-600">{errors.maximum}</p>
                                )}
                            </div>
                        </div>

                        {/* Current Value */}
                        {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Value
              </label>
              <input
                type="number"
                name="currentValue"
                value={formData.currentValue}
                onChange={handleInputChange}
                placeholder="Leave empty to start from minimum value"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.currentValue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.currentValue && (
                <p className="mt-1 text-xs text-red-600">{errors.currentValue}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                If not specified, current value will be set to minimum value
              </p>
            </div> */}

                        {/* Status */}
                        {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={loading}
              >
                <option value="ENABLE">Enable</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Enable to allow automatic assignment of tracking numbers
              </p>
            </div> */}

                        {/* Active Checkbox */}
                        {/* <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={loading}
              />
              <label className="ml-2 text-sm text-gray-700">
                Mark as active
              </label>
            </div> */}

                        {/* Range Summary */}
                        {formData.minimum && formData.maximum && parseInt(formData.maximum) > parseInt(formData.minimum) && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">Range Summary</h4>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700 font-medium">Total Numbers:</span>
                                        <p className="text-blue-900 font-semibold">
                                            {parseInt(formData.maximum) - parseInt(formData.minimum) + 1}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-blue-700 font-medium">Starting At:</span>
                                        <p className="text-blue-900 font-semibold">
                                            {formData.minimum}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-blue-700 font-medium">Remaining:</span>
                                        <p className="text-blue-900 font-semibold">
                                            {calculateRemaining()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Range'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackingNumberAddModal;