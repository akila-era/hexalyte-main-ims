const db = require('../models')
const NewOrderItems = db.NewOrderItems
const newOrderItemsServices = require('../service/newOrderItems.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllNewOrderItems = catchAsync(async (req, res) => {
    const allNewOrderItems = await NewOrderItems.findAll({
        include: [{
            model: db.NewOrder,
            required: false
        }, 
        
        {
            model: db.product,
            required: false
        }
    
    ]
    })

    console.log(allNewOrderItems)   // TODO: remove this later      
    // const allNewOrderItems = await NewOrderItems.findAll()

    if (allNewOrderItems.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Order Items Found"
        })
    }

    return res.status(httpStatus.OK).send({ allNewOrderItems })
})

const getNewOrderItemsByOrderID = catchAsync(async (req, res) => {
    const orderItems = await newOrderItemsServices.getNewOrderItemsByOrderID(req.params.orderId)
    if (!orderItems || orderItems.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Order Items Found for Order ID:${req.params.orderId}`
        })
    }

    return res.status(httpStatus.OK).send({ orderItems })
})

const addNewOrderItem = catchAsync(async (req, res) => {
    const newOrderItem = await newOrderItemsServices.addNewOrderItem(req.body)
    if (newOrderItem == "no order found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Order ID. Order ID does not exists`
        })
    } else if (newOrderItem == "no product found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "Invalid Product ID. Product ID does not exists"
        })
    } else if (newOrderItem == "item already exists") {
        return res.status(httpStatus.CONFLICT).send({
            message: "Order item already exists for this product"
        })
    }

    return res.status(httpStatus.OK).send({ newOrderItem })
})

const updateNewOrderItemById = catchAsync(async (req, res) => {
    const updatedOrderItem = await newOrderItemsServices.updateNewOrderItemById(req.params.orderId, req.params.productId, req.body)
    if (updatedOrderItem == "no order item found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Order Item Found with Order ID:${req.params.orderId} and Product ID:${req.params.productId}`
        })
    } else if (updatedOrderItem == "no product found") {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "Invalid Product ID. Product ID does not exists"
        })
    }

    return res.status(httpStatus.OK).send({ updatedOrderItem })
})

const deleteNewOrderItemById = catchAsync(async (req, res) => {
    const deletedOrderItem = await newOrderItemsServices.deleteNewOrderItemById(req.params.orderId, req.params.productId)
    if (deletedOrderItem == 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Order Item. Order Item does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ deletedOrderItem })
})

const calculateItemTotal = catchAsync(async (req, res) => {
    const itemTotal = await newOrderItemsServices.calculateItemTotal(req.params.orderId, req.params.productId)
    if (itemTotal == "no order item found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Order Item Found with Order ID:${req.params.orderId} and Product ID:${req.params.productId}`
        })
    }

    return res.status(httpStatus.OK).send({ itemTotal })
})

module.exports = {
    addNewOrderItem,
    getAllNewOrderItems,
    getNewOrderItemsByOrderID,
    updateNewOrderItemById,
    deleteNewOrderItemById,
    calculateItemTotal
}