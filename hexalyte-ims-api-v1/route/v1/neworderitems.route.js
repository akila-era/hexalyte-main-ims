const express = require("express")
const router = express.Router()
const newOrderItemsController = require("../../controller/newOrderItems.controller")

router
    .route('/')
    .get(newOrderItemsController.getAllNewOrderItems)
    .post(newOrderItemsController.addNewOrderItem)

router
    .route('/:id')
    .get(newOrderItemsController.getNewOrderItemsByOrderID)
    .put(newOrderItemsController.updateNewOrderItemById)
    .delete(newOrderItemsController.deleteNewOrderItemById)

module.exports = router