const express = require('express');
const router = express.Router();

const trackingNumberController = require('../../controller/trackingnumber.controller')

const { auth } = require('../../middleware/auth');


router
    .route('/')
    .get(trackingNumberController.getAllTrackingNumbers)
    .post(trackingNumberController.addTrackingNumbers)

router
    .route('/:id')
    .put(trackingNumberController.toggleTrackingNumberRangeStatusFromID)

router
    .route('/get-tracking-numbers/:id/:ordersCount')
    .get(trackingNumberController.getTrackingNumbersFromDeliveryPartner)

router
  .route('/assign-tracking-numbers/:id/:ordersCount')
  .get(trackingNumberController.assignTrackingNumbersFromDeliveryPartner)

module.exports = router