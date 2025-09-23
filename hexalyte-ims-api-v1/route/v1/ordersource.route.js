const express = require("express")
const router = express.Router()
const orderSourceController = require("../../controller/orderSource.controller")

router
    .route('/')
    .get(orderSourceController.getAllOrderSources)
    .post(orderSourceController.addOrderSource)

router
    .route('/:id')
    .get(orderSourceController.getOrderSourceByID)
    .put(orderSourceController.updateOrderSourceById)
    .delete(orderSourceController.deleteOrderSourceById)

module.exports = router