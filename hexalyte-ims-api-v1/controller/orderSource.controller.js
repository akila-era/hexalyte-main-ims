const db = require('../models')
const OrderSource = db.OrderSource
const orderSourceServices = require('../service/orderSource.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllOrderSources = catchAsync(async (req, res) => {
    const allOrderSources = await OrderSource.findAll()
    if (allOrderSources.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Order Sources Found"
        })
    }

    return res.status(httpStatus.OK).send({ allOrderSources })
})

const getOrderSourceByID = catchAsync(async (req, res) => {
    const orderSource = await orderSourceServices.getOrderSourceByID(req.params.id)
    if (!orderSource) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Order Source Found with ID:${req.params.id}`
        })
    }

    return res.status(httpStatus.OK).send({ orderSource })
})

const addOrderSource = catchAsync(async (req, res) => {
    const newOrderSource = await orderSourceServices.addOrderSource(req.body)
    return res.status(httpStatus.OK).send({ newOrderSource })
})

const updateOrderSourceById = catchAsync(async (req, res) => {
    const updatedOrderSource = await orderSourceServices.updateOrderSourceById(req.params.id, req.body)
    if (updatedOrderSource == "no order source found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Order Source ID. Order Source ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedOrderSource })
})

const deleteOrderSourceById = catchAsync(async (req, res) => {
    const deletedOrderSource = await orderSourceServices.deleteOrderSourceById(req.params.id)
    if (deletedOrderSource == 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Order Source ID. Order Source does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ deletedOrderSource })
})

const toggleOrderSourceStatus = catchAsync(async (req, res) => {
    const updatedOrderSource = await orderSourceServices.toggleOrderSourceStatus(req.params.id)
    if (updatedOrderSource == "no order source found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Order Source ID. Order Source ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedOrderSource })
})

module.exports = {
    addOrderSource,
    getAllOrderSources,
    getOrderSourceByID,
    updateOrderSourceById,
    deleteOrderSourceById,
    toggleOrderSourceStatus
}