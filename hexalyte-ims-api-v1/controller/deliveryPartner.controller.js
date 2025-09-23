const db = require('../models')
const DeliveryPartner = db.DeliveryPartner
const deliveryPartnerServices = require('../service/deliveryPartner.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllDeliveryPartners = catchAsync(async (req, res) => {
    const allDeliveryPartners = await DeliveryPartner.findAll({
        include: [{
            model: db.NewOrder,
            required: false
        }]
    })
    if (allDeliveryPartners.length == 0) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: "No Delivery Partners Found"
        })
    }

    return res.status(httpStatus.OK).send({ allDeliveryPartners })
})

const getDeliveryPartnerByID = catchAsync(async (req, res) => {
    const deliveryPartner = await deliveryPartnerServices.getDeliveryPartnerByID(req.params.id)
    if (!deliveryPartner) {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `No Delivery Partner Found with ID:${req.params.id}`
        })
    }

    return res.status(httpStatus.OK).send({ deliveryPartner })
})

const addDeliveryPartner = catchAsync(async (req, res) => {
    const newDeliveryPartner = await deliveryPartnerServices.addDeliveryPartner(req.body)
    return res.status(httpStatus.OK).send({ newDeliveryPartner })
})

const updateDeliveryPartnerById = catchAsync(async (req, res) => {
    const updatedDeliveryPartner = await deliveryPartnerServices.updateDeliveryPartnerById(req.params.id, req.body)
    if (updatedDeliveryPartner == "no delivery partner found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Delivery Partner ID. Delivery Partner ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedDeliveryPartner })
})

const deleteDeliveryPartnerById = catchAsync(async (req, res) => {
    const deletedDeliveryPartner = await deliveryPartnerServices.deleteDeliveryPartnerById(req.params.id)
    if (deletedDeliveryPartner == 0) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: `Invalid Delivery Partner ID. Delivery Partner does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ deletedDeliveryPartner })
})

const toggleDeliveryPartnerStatus = catchAsync(async (req, res) => {
    const updatedDeliveryPartner = await deliveryPartnerServices.toggleDeliveryPartnerStatus(req.params.id)
    if (updatedDeliveryPartner == "no delivery partner found") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: `Invalid Delivery Partner ID. Delivery Partner ID does not exists`
        })
    }

    return res.status(httpStatus.OK).send({ updatedDeliveryPartner })
})

const assignDeliveryPartner = catchAsync(async (req, res) => {

    const assignedDeliveryPartners = await deliveryPartnerServices.assignDeliveryPartner(req.body)
    return res.send(assignedDeliveryPartners)

})

module.exports = {
    addDeliveryPartner,
    getAllDeliveryPartners,
    getDeliveryPartnerByID,
    updateDeliveryPartnerById,
    deleteDeliveryPartnerById,
    toggleDeliveryPartnerStatus,
    assignDeliveryPartner,
}