const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const orderStatusService = require('../service/orderStatus.service');

/**
 * Update order status
 */
const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { newStatus, reason } = req.body;

  const result = await orderStatusService.updateOrderStatus(
    parseInt(orderId),
    newStatus,
    reason
  );

  if (result.success) {
    return res.status(httpStatus.OK).send({
      message: result.message,
      data: result.data
    });
  } else {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: result.message
    });
  }
});

/**
 * Get orders by status
 */
const getOrdersByStatus = catchAsync(async (req, res) => {
  const { status } = req.query;

  const orders = await orderStatusService.getOrdersByStatus(status);

  return res.status(httpStatus.OK).send({
    orders,
    count: orders.length
  });
});

/**
 * Bulk update order statuses
 */
const bulkUpdateOrderStatus = catchAsync(async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Updates array is required and must not be empty'
    });
  }

  const results = await orderStatusService.bulkUpdateOrderStatus(updates);

  return res.status(httpStatus.OK).send({
    message: `Processed ${updates.length} updates`,
    results
  });
});

/**
 * Get order status statistics
 */
const getOrderStatusStats = catchAsync(async (req, res) => {
  const stats = await orderStatusService.getOrderStatusStats();

  return res.status(httpStatus.OK).send({
    stats
  });
});

/**
 * Validate order for delivery assignment
 */
const validateOrderForDelivery = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  const validation = await orderStatusService.validateOrderForDelivery(
    parseInt(orderId)
  );

  const statusCode = validation.valid ? httpStatus.OK : httpStatus.BAD_REQUEST;

  return res.status(statusCode).send(validation);
});

module.exports = {
  updateOrderStatus,
  getOrdersByStatus,
  bulkUpdateOrderStatus,
  getOrderStatusStats,
  validateOrderForDelivery
};
