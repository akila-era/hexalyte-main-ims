const joi = require('joi');

const updateOrderStatus = {
  params: joi.object().keys({
    orderId: joi.number().integer().positive().required()
  }),
  body: joi.object().keys({
    newStatus: joi.string()
      .valid('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
      .required(),
    reason: joi.string().max(500).optional()
  })
};

const getOrdersByStatus = {
  query: joi.object().keys({
    status: joi.string()
      .valid('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
      .optional()
  })
};

const bulkUpdateOrderStatus = {
  body: joi.object().keys({
    updates: joi.array().items(
      joi.object().keys({
        orderId: joi.number().integer().positive().required(),
        newStatus: joi.string()
          .valid('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
          .required(),
        reason: joi.string().max(500).optional()
      })
    ).min(1).required()
  })
};

const validateOrderForDelivery = {
  params: joi.object().keys({
    orderId: joi.number().integer().positive().required()
  })
};

module.exports = {
  updateOrderStatus,
  getOrdersByStatus,
  bulkUpdateOrderStatus,
  validateOrderForDelivery
};
