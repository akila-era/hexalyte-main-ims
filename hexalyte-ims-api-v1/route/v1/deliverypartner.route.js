const express = require("express")
const router = express.Router()
const deliveryPartnerController = require("../../controller/deliveryPartner.controller")

router
    .route('/')
    .get(deliveryPartnerController.getAllDeliveryPartners)
    .post(deliveryPartnerController.addDeliveryPartner)

router
    .route('/:id')
    .get(deliveryPartnerController.getDeliveryPartnerByID)
    .put(deliveryPartnerController.updateDeliveryPartnerById)
    .delete(deliveryPartnerController.deleteDeliveryPartnerById)

module.exports = router