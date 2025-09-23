const db = require("../models");
const TrackingNumber = db.trackingNumber;
const trackingNumberService = require("../service/trackingnumber.service");

const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const getAllTrackingNumbers = catchAsync(async (req, res) => {

  const allTrackingNumbers = await trackingNumberService.getAllTrackingNumbers();

  return res.send({ allTrackingNumbers });

});

const addTrackingNumbers = catchAsync(async (req, res) => {

  const addTrackingNumbers = await trackingNumberService.addTrackingNumbers(req.body);

  return res.send({ addTrackingNumbers });

});

const getTrackingNumbersFromDeliveryPartner = catchAsync(async (req, res) => {

  const trackingNumbersFromDeliveryPartner = await trackingNumberService.getTrackingNumbersFromDeliveryPartner(req.params.id, req.params.ordersCount);
  return res.send({ trackingNumbersFromDeliveryPartner });

});

const assignTrackingNumbersFromDeliveryPartner = catchAsync(async (req, res) => {

  const trackingNumbersFromDeliveryPartner = await trackingNumberService.assignTrackingNumbersFromDeliveryPartner(req.params.id, req.params.ordersCount);
  return res.send({ trackingNumbersFromDeliveryPartner });

});

const toggleTrackingNumberRangeStatusFromID = catchAsync(async (req, res) => {

  try {

    const toggleTrackingNumberRangeStatus = await trackingNumberService.toggleTrackingNumberStatusFromID(req.params.id);
    return res.send({ toggleTrackingNumberRangeStatus });

  } catch (e) {

    console.log(e);
    return res.status(httpStatus.BAD_REQUEST).send({ status: false, error: e.message });

  }

});

module.exports = {
  getAllTrackingNumbers,
  addTrackingNumbers,
  getTrackingNumbersFromDeliveryPartner,
  assignTrackingNumbersFromDeliveryPartner,
  toggleTrackingNumberRangeStatusFromID,
};