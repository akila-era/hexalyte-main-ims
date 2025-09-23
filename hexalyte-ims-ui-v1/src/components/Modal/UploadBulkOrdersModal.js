
import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';

const UploadBulkOrdersModal = ({ isOpen, onClose, onFileUpload, title = "Upload File" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    // Accepted file types
    const acceptedTypes = {
        'text/csv': '.csv',
        'application/vnd.ms-excel': '.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx'
    };

    const acceptedExtensions = ['.csv', '.xls', '.xlsx'];

    // Handle file validation
    const validateFile = (file) => {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!acceptedExtensions.includes(fileExtension)) {
            return { valid: false, error: 'Please select a CSV or Excel file (.csv, .xls, .xlsx)' };
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return { valid: false, error: 'File size must be less than 10MB' };
        }

        return { valid: true, error: null };
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        const validation = validateFile(file);

        if (!validation.valid) {
            setErrorMessage(validation.error);
            setUploadStatus('error');
            return;
        }

        setSelectedFile(file);
        setErrorMessage('');
        setUploadStatus('idle');
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploadStatus('uploading');

        try {
            // Simulate upload process - replace with your actual upload logic
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call the parent component's upload handler
            if (onFileUpload) {
                await onFileUpload(selectedFile);
            }

            setUploadStatus('success');

            // Close modal after successful upload
            setTimeout(() => {
                handleClose();
            }, 1500);

        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(error.message || 'Upload failed. Please try again.');
        }
    };

    // Handle modal close
    const handleClose = () => {
        setSelectedFile(null);
        setUploadStatus('idle');
        setErrorMessage('');
        setDragActive(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    // Get file icon based on extension
    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        return <FileText className="w-8 h-8 text-blue-500" />;
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Download template
    const handleDownloadTemplate = () => {
        // This would typically download a template file
        alert('Template download functionality would be implemented here');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-white bg-opacity-50 transition-opacity"
                    onClick={handleClose}
                ></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Upload Area */}
                    <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
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

                        {!selectedFile ? (
                            <div className="text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-blue-600 hover:text-blue-500">
                                        Click to upload
                                    </span>
                                    {' '}or drag and drop
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    CSV, XLS, XLSX files up to 10MB
                                </p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    {getFileIcon(selectedFile.name)}
                                </div>
                                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                                >
                                    Remove file
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {uploadStatus === 'error' && errorMessage && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                                <p className="text-sm text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {uploadStatus === 'success' && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <p className="text-sm text-green-700">File uploaded successfully!</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            disabled={uploadStatus === 'uploading'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploadStatus === 'uploading'}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            {uploadStatus === 'uploading' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Upload File
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadBulkOrdersModal