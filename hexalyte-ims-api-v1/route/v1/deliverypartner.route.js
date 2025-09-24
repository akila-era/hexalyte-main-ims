const express = require("express")
const router = express.Router()
const deliveryPartnerController = require("../../controller/deliveryPartner.controller")
const { auth } = require("../../middleware/auth")

router
    .route('/')
    .get(auth(), deliveryPartnerController.getAllDeliveryPartners)
    .post(auth(), deliveryPartnerController.addDeliveryPartner)

router
    .route('/:id')
    .get(auth(), deliveryPartnerController.getDeliveryPartnerByID)
    .put(auth(), deliveryPartnerController.updateDeliveryPartnerById)
    .delete(auth(), deliveryPartnerController.deleteDeliveryPartnerById)

module.exports = router