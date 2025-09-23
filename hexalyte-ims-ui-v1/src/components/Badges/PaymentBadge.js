import React from 'react'

function PaymentBadge({ status }) {

    const getPaymentStyles = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'partial':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'unpaid':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'refunded':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStyles(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

export default PaymentBadge