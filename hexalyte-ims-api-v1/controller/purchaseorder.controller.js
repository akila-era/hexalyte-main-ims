const db = require('../models')
const PurchaseOrder = db.purchaseorder
const purchaseorderServices = require('../service/purchaseorder.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const addNewPurchaseOrder = catchAsync(async (req, res) => {
    const purchaseOrder = await purchaseorderServices.addNewPurchaseOrder(req.body)
    if (purchaseOrder) {
        return res.status(httpStatus.OK).send({ purchaseOrder })
    }

})

const getAllPurchaseOrders = catchAsync(async (req, res) => {
    const purchaseOrders = await PurchaseOrder.findAll();

    if (purchaseOrders.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Purchase Orders found"
        })
    }

    return res.status(httpStatus.OK).send({ purchaseOrders })
})

const getPurchaseOrderByID = catchAsync(async (req, res) => {
    const PurchaseOrder = await purchaseorderServices.getPurchaseOrderByID(req.params.id)

    if (!PurchaseOrder) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Purchase Order Exists"
        })
    }

    return res.status(httpStatus.OK).send({ PurchaseOrder })
})

const updatePurchaseOrderByID = catchAsync(async (req, res) => {
    const PurchaseOrder = await purchaseorderServices.updatePurchaseOrderByID(req.params.id, req.body)
    return res.status(httpStatus.OK).send({ PurchaseOrder })
})

const deletePurchaseOrderByID = catchAsync(async (req, res) => {

    const PurchaseOrder = await purchaseorderServices.deletePurchaseOrderByID(req.params.id)

    if (PurchaseOrder == 1) {
        return res.status(httpStatus.OK).send({
            status: 'success',
            message: 'Purchase Order Deleted successfully'
        })
    } else if (PurchaseOrder == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            status: 'fail',
            message: 'No Purchase Order Found'
        })
    } else {
        return res.status(httpStatus.BAD_REQUEST).send({
            status: 'fail',
            message: PurchaseOrder
        })
    }

})

module.exports = {
    getAllPurchaseOrders,
    addNewPurchaseOrder,
    getPurchaseOrderByID,
    updatePurchaseOrderByID,
    deletePurchaseOrderByID
}