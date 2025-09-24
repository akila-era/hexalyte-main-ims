const express = require("express")
const router = express.Router()
const newOrderController = require("../../controller/newOrder.controller")
const { auth } = require("../../middleware/auth")

router
    .route('/')
    .get(auth(), newOrderController.getAllNewOrders)
    .post(auth(), newOrderController.addNewOrder)

router
    .route('/:id')
    .get(auth(), newOrderController.getNewOrderByID)
    .put(auth(), newOrderController.updateNewOrderById)
    .delete(auth(), newOrderController.deleteNewOrderById)

router
  .route('/add/bulk')
  .post(auth(), newOrderController.addBulkOrders)

router
  .route('/assign/delivery-partner')
  .post(auth(), newOrderController.assignOrdersToDeliveryPartner)

module.exports = router