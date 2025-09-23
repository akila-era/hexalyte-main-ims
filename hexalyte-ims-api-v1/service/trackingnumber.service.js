const { Op } = require("sequelize");
const db = require("../models");
const catchAsync = require("../utils/catchAsync");
const TrackingNumber = db.trackingNumber;
const DeliveryPartner = db.DeliveryPartner;

const getAllTrackingNumbers = async () => {

  const trackingNumbers = await TrackingNumber.findAll({
    include: [{
      model: db.DeliveryPartner,
      required: true,
    }],
  });

  return trackingNumbers;

};

// const getTrackingNumberFromDeliveryPartner = async (DeliveryPartnerID) => {
//     const trackingNumberRanges = await TrackingNumber.findAll({
//         include: [{
//             model: db.DeliveryPartner,
//             required: true
//         }],
//         where: {
//             DeliveryPartnerID: DeliveryPartnerID,
//             status: 'ENABLE'
//         }
//     });
//
//     // Check if any records found
//     if (!trackingNumberRanges || trackingNumberRanges.length === 0) {
//         return "no tracking number ranges";
//     }
//
//     // Get the first record (since findAll returns an array)
//     const trackingRange = trackingNumberRanges[0];
//     let { ID, minimum, maximum, currentValue, remaining } = trackingRange.dataValues;
//
//     // Check if we've exceeded the maximum
//     if (remaining <= 0) {
//         return "no remaining tracking numbers";
//     }
//
//     const trackingNumber = currentValue;
//
//     // Fix the increment operations
//     // const newCurrentValue = currentValue + 1;
//
//     let newCurrentValue;
//
//     if (currentValue + 1 > maximum) {
//         newCurrentValue = currentValue
//     } else {
//         newCurrentValue = currentValue + 1;
//     }
//
//     const newRemaining = remaining - 1;
//
//     if (newRemaining == 0) {
//
//         const updateTrackingNumberRange = await TrackingNumber.update(
//             {
//                 currentValue: newCurrentValue,
//                 remaining: newRemaining,
//                 status: 'DISABLED',
//                 isActive: false
//             },
//             {
//                 where: { ID: ID } // Use lowercase 'id' (common Sequelize convention)
//             }
//         );
//
//         return { trackingNumber, updateTrackingNumberRange };
//
//     } else {
//
//         const updateTrackingNumberRange = await TrackingNumber.update(
//             {
//                 currentValue: newCurrentValue,
//                 remaining: newRemaining
//             },
//             {
//                 where: { ID: ID } // Use lowercase 'id' (common Sequelize convention)
//             }
//         );
//
//         return { trackingNumber, updateTrackingNumberRange };
//
//     }
//
// }
//
// const getBulkDeliveryNumbersFromDeliveryPartner = async (DeliveryPartnerID, ordersCount) => {
//
//     const trackingNumberRanges = await TrackingNumber.findAll({
//         include: [{
//             model: db.DeliveryPartner,
//             required: true
//         }],
//         where: {
//             DeliveryPartnerID: DeliveryPartnerID,
//             status: 'ENABLE',
//             remaining: {
//                 [Op.gte]: ordersCount  // Simplified: just need >= ordersCount
//             }
//         }
//     });
//
//     if (!trackingNumberRanges || trackingNumberRanges.length === 0) {
//         return "no tracking number ranges";
//     }
//
//     const trackingRange = trackingNumberRanges[0];
//     let { ID, minimum, maximum, currentValue, remaining } = trackingRange;
//
//     if (remaining <= 0) {
//         return "no remaining tracking numbers";
//     }
//
//     // Calculate how many numbers we can actually assign
//     const numbersToAssign = Math.min(ordersCount, remaining, maximum - currentValue + 1);
//
//     if (numbersToAssign <= 0) {
//         return "no available tracking numbers in range";
//     }
//
//     let trackingNumbers = [];
//     let newCurrentValue = currentValue;
//
//     // Generate tracking numbers starting from currentValue
//     for (let i = 0; i < numbersToAssign; i++) {
//         if (newCurrentValue > maximum) break;
//
//         trackingNumbers.push(newCurrentValue);
//         newCurrentValue++;
//     }
//
//     const newRemaining = remaining - trackingNumbers.length;
//
//     // Update the tracking number range
//     const updateData = {
//         currentValue: newCurrentValue > maximum ? newCurrentValue - 1 : newCurrentValue,
//         remaining: newRemaining
//     };
//
//     // If no numbers remaining, disable the range
//     if (newRemaining <= 0) {
//         updateData.status = 'DISABLED';
//         updateData.isActive = false;
//     }
//
//     const updateTrackingNumberRange = await TrackingNumber.update(
//         updateData,
//         {
//             where: { ID: ID }
//         }
//     );
//
//     return {
//         trackingNumbers,
//         updateTrackingNumberRange,
//         assignedCount: trackingNumbers.length
//     };
// }

const getTrackingNumbersFromDeliveryPartner = async (DeliveryPartnerID, count = 1) => {
  const trackingNumberRanges = await TrackingNumber.findAll({
    include: [{
      model: db.DeliveryPartner,
      required: true,
    }],
    where: {
      DeliveryPartnerID: DeliveryPartnerID,
      status: "ENABLE",
      remaining: {
        [Op.gte]: count,
      },
    },
  });

  // Check if any records found
  if (!trackingNumberRanges || trackingNumberRanges.length === 0) {
    return {
      success: false,
      message: "no tracking number ranges available",
      trackingNumbers: [],
      availableCount: 0,
    };
  }

  // Get the first available range
  const trackingRange = trackingNumberRanges[0];
  let { ID, minimum, maximum, currentValue, remaining } = trackingRange.dataValues;

  // Check if we have enough remaining numbers
  if (remaining < count) {
    return {
      success: false,
      message: "insufficient tracking numbers available",
      trackingNumbers: [],
      availableCount: remaining,
    };
  }

  // Calculate how many numbers we can actually provide
  const numbersAvailable = Math.min(count, remaining, maximum - currentValue + 1);

  if (numbersAvailable <= 0) {
    return {
      success: false,
      message: "no available tracking numbers in range",
      trackingNumbers: [],
      availableCount: 0,
    };
  }

  let trackingNumbers = [];
  let tempCurrentValue = currentValue;

  // Generate available tracking numbers starting from currentValue
  for (let i = 0; i < numbersAvailable; i++) {
    if (tempCurrentValue > maximum) break;

    trackingNumbers.push(tempCurrentValue);
    tempCurrentValue++;
  }

  return {
    success: true,
    message: "tracking numbers available",
    trackingNumbers: trackingNumbers,
    availableCount: trackingNumbers.length,
    rangeId: ID,
    currentValue: currentValue,
    remaining: remaining,
  };
};

const assignTrackingNumbersFromDeliveryPartner = async (DeliveryPartnerID, count = 1) => {
  // First, get available tracking numbers
  const availableNumbers = await getTrackingNumbersFromDeliveryPartner(DeliveryPartnerID, count);

  if (!availableNumbers.success) {
    return availableNumbers;
  }

  const { trackingNumbers, rangeId, currentValue, remaining } = availableNumbers;
  const assignedCount = trackingNumbers.length;

  // Calculate new values for database update
  const newCurrentValue = currentValue + assignedCount;
  const newRemaining = remaining - assignedCount;

  // Prepare update data
  const updateData = {
    currentValue: newCurrentValue > trackingNumbers[trackingNumbers.length - 1] ? newCurrentValue : newCurrentValue,
    remaining: newRemaining,
  };

  // If no numbers remaining, disable the range
  if (newRemaining <= 0) {
    updateData.status = "DISABLED";
    updateData.isActive = false;
  }

  try {
    // Update the tracking number range
    const updateResult = await TrackingNumber.update(
      updateData,
      {
        where: { ID: rangeId },
      },
    );

    return {
      success: true,
      message: "tracking numbers assigned successfully",
      trackingNumbers: trackingNumbers,
      assignedCount: assignedCount,
      updateResult: updateResult,
      remainingAfterAssignment: newRemaining,
    };

  } catch (error) {
    return {
      success: false,
      message: "failed to update tracking number range",
      error: error.message,
      trackingNumbers: [],
      assignedCount: 0,
    };
  }
};

// Convenience function for single tracking number (backward compatibility)
const getTrackingNumberFromDeliveryPartner = async (DeliveryPartnerID) => {
  const result = await assignTrackingNumbersFromDeliveryPartner(DeliveryPartnerID, 1);

  if (result.success) {
    return {
      trackingNumber: result.trackingNumbers[0],
      updateTrackingNumberRange: result.updateResult,
    };
  } else {
    return result.message;
  }
};

// Convenience function for bulk tracking numbers (backward compatibility)
const getBulkDeliveryNumbersFromDeliveryPartner = async (DeliveryPartnerID, ordersCount) => {
  const result = await assignTrackingNumbersFromDeliveryPartner(DeliveryPartnerID, ordersCount);

  if (result.success) {
    return {
      trackingNumbers: result.trackingNumbers,
      updateTrackingNumberRange: result.updateResult,
      assignedCount: result.assignedCount,
    };
  } else {
    return result.message;
  }
};

const addTrackingNumbers = async (params) => {

  const { DeliveryPartnerID } = params;

  const minimum = parseInt(params.minimum);
  const maximum = parseInt(params.maximum);

  const checkDeliveryPartner = await DeliveryPartner.findOne({ where: { DeliveryPartnerID, isActive: true } });

  if (checkDeliveryPartner == null) return "no active delivery partner found";

  const currentValue = minimum;

  const remaining = (maximum - currentValue) + 1;

  const addTrackingNumbers = await TrackingNumber.create({
    minimum,
    maximum,
    currentValue,
    remaining,
    status: "ENABLE",
    DeliveryPartnerID,
    isActive: true,
  });

  return addTrackingNumbers;

};

const toggleTrackingNumberStatusFromID = async (id) => {

  console.log(id)

  const trackingNumberRange = await TrackingNumber.findOne({ where: { ID: id } });
  if (!trackingNumberRange) {
    throw new Error(`No trackingNumbers found for ID: ${id}`);
  }

  if (trackingNumberRange.status === "ENABLE" || trackingNumberRange.isActive === true) {
    const toggleTrackingNumberStatus = await TrackingNumber.update({
      status: "DISABLED",
      isActive: false,
    }, { where: { ID: trackingNumberRange.ID } });
    return {
      status: "true",
      message: "tracking number range status change success",
      result: toggleTrackingNumberStatus,
    };
  } else {
    const toggleTrackingNumberStatus = await TrackingNumber.update({
      status: "ENABLE",
      isActive: true,
    }, { where: { ID: trackingNumberRange.ID } });
    return {
      status: "true",
      message: "tracking number range status change success",
      result: toggleTrackingNumberStatus,
    };
  }

};

module.exports = {
  getAllTrackingNumbers,
  addTrackingNumbers,
  getTrackingNumbersFromDeliveryPartner,
  assignTrackingNumbersFromDeliveryPartner,
  toggleTrackingNumberStatusFromID,
};