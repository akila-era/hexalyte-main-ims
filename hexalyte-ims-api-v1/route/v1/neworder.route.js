const express = require("express")
const router = express.Router()
const newOrderController = require("../../controller/newOrder.controller")

router
    .route('/')
    .get(newOrderController.getAllNewOrders)
    .post(newOrderController.addNewOrder)

router
    .route('/:id')
    .get(newOrderController.getNewOrderByID)
    .put(newOrderController.updateNewOrderById)
    .delete(newOrderController.deleteNewOrderById)

router
  .route('/add/bulk')
  .post(newOrderController.addBulkOrders)

router
  .route('/assign/delivery-partner')
  .post(newOrderController.assignOrdersToDeliveryPartner)

module.exports = router