const express = require('express');
const router = express.Router();
const orderStatusController = require('../../controller/orderStatus.controller');
const validate = require('../../middleware/validate');
const orderStatusValidation = require('../../validations/orderStatus.validation');
const { auth } = require('../../middleware/auth');

// Update order status
router
  .route('/:orderId')
  .put(
    auth(), 
    validate(orderStatusValidation.updateOrderStatus), 
    orderStatusController.updateOrderStatus
  );

// Get orders by status
router
  .route('/')
  .get(
    auth(), 
    validate(orderStatusValidation.getOrdersByStatus), 
    orderStatusController.getOrdersByStatus
  );

// Bulk update order statuses
router
  .route('/bulk')
  .put(
    auth(), 
    validate(orderStatusValidation.bulkUpdateOrderStatus), 
    orderStatusController.bulkUpdateOrderStatus
  );

// Get order status statistics
router
  .route('/stats')
  .get(auth(), orderStatusController.getOrderStatusStats);

// Validate order for delivery assignment
router
  .route('/:orderId/validate-delivery')
  .get(
    auth(), 
    validate(orderStatusValidation.validateOrderForDelivery), 
    orderStatusController.validateOrderForDelivery
  );

module.exports = router;
