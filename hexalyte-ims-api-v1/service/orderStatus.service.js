const db = require("../models");
const NewOrder = db.NewOrder;
const { Op } = require('sequelize');

/**
 * Update order status with validation
 * @param {number} orderId - Order ID
 * @param {string} newStatus - New status to set
 * @param {string} reason - Optional reason for status change
 * @returns {Object} Result object with success/error information
 */
const updateOrderStatus = async (orderId, newStatus, reason = null) => {
  try {
    // Validate status value
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      };
    }

    // Find the order
    const order = await NewOrder.findByPk(orderId);
    if (!order) {
      return {
        success: false,
        message: `Order with ID ${orderId} not found`
      };
    }

    const oldStatus = order.Status;

    // Validate status transitions
    const validTransitions = {
      'Pending': ['Confirmed', 'Cancelled'],
      'Confirmed': ['Processing', 'Cancelled'],
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Delivered'],
      'Delivered': [], // Final status
      'Cancelled': [] // Final status
    };

    if (!validTransitions[oldStatus].includes(newStatus)) {
      return {
        success: false,
        message: `Invalid status transition from ${oldStatus} to ${newStatus}. Valid transitions: ${validTransitions[oldStatus].join(', ')}`
      };
    }

    // Additional validation for specific status changes
    if (newStatus === 'Processing') {
      // Check if order can be processed (should have confirmed status)
      if (oldStatus !== 'Confirmed') {
        return {
          success: false,
          message: 'Order must be in Confirmed status to move to Processing'
        };
      }
    }

    if (newStatus === 'Shipped') {
      // Check if order has delivery partner and tracking number
      if (!order.DeliveryPartnerID || !order.TrackingNumber) {
        return {
          success: false,
          message: 'Order must have delivery partner and tracking number assigned before shipping'
        };
      }
    }

    // Update the order status
    await order.update({
      Status: newStatus,
      Remark: reason ? `${order.Remark || ''}\n[${new Date().toISOString()}] Status changed to ${newStatus}: ${reason}`.trim() : order.Remark
    });

    return {
      success: true,
      message: `Order status updated from ${oldStatus} to ${newStatus}`,
      data: {
        orderId,
        oldStatus,
        newStatus,
        updatedAt: new Date()
      }
    };

  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      message: `Error updating order status: ${error.message}`
    };
  }
};

/**
 * Get orders by status
 * @param {string} status - Status to filter by
 * @returns {Array} Array of orders with the specified status
 */
const getOrdersByStatus = async (status) => {
  try {
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    const whereClause = status ? { Status: status } : {};

    const orders = await NewOrder.findAll({
      where: whereClause,
      include: [
        {
          model: db.NewOrderItems,
          include: [{
            model: db.subProduct,
            include: [{
              model: db.product
            }]
          }]
        },
        {
          model: db.DeliveryPartner,
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

/**
 * Bulk update order statuses
 * @param {Array} updates - Array of {orderId, newStatus, reason} objects
 * @returns {Object} Result with success and error arrays
 */
const bulkUpdateOrderStatus = async (updates) => {
  const results = {
    success: [],
    errors: []
  };

  for (const update of updates) {
    const { orderId, newStatus, reason } = update;
    const result = await updateOrderStatus(orderId, newStatus, reason);
    
    if (result.success) {
      results.success.push(result.data);
    } else {
      results.errors.push({
        orderId,
        message: result.message
      });
    }
  }

  return results;
};

/**
 * Get order status statistics
 * @returns {Object} Status counts
 */
const getOrderStatusStats = async () => {
  try {
    const stats = await NewOrder.findAll({
      attributes: [
        'Status',
        [db.sequelize.fn('COUNT', db.sequelize.col('NewOrderID')), 'count']
      ],
      group: ['Status']
    });

    const statusCounts = {};
    stats.forEach(stat => {
      statusCounts[stat.Status] = parseInt(stat.dataValues.count);
    });

    // Ensure all statuses are represented
    const allStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    allStatuses.forEach(status => {
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
    });

    return statusCounts;
  } catch (error) {
    console.error('Error getting order status stats:', error);
    throw error;
  }
};

/**
 * Validate if order can be assigned for delivery
 * @param {number} orderId - Order ID
 * @returns {Object} Validation result
 */
const validateOrderForDelivery = async (orderId) => {
  try {
    const order = await NewOrder.findByPk(orderId);
    if (!order) {
      return {
        valid: false,
        message: `Order with ID ${orderId} not found`
      };
    }

    if (order.Status !== 'Confirmed') {
      return {
        valid: false,
        message: `Order must be in 'Confirmed' status for delivery assignment. Current status: ${order.Status}`
      };
    }

    if (order.DeliveryPartnerID) {
      return {
        valid: false,
        message: 'Order already has a delivery partner assigned'
      };
    }

    return {
      valid: true,
      message: 'Order is eligible for delivery assignment',
      order: order
    };
  } catch (error) {
    console.error('Error validating order for delivery:', error);
    return {
      valid: false,
      message: `Error validating order: ${error.message}`
    };
  }
};

module.exports = {
  updateOrderStatus,
  getOrdersByStatus,
  bulkUpdateOrderStatus,
  getOrderStatusStats,
  validateOrderForDelivery
};
