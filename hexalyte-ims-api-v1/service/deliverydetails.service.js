const db = require("../models");
const DeliveryDetails = db.DeliveryDetails;  // ✅ PascalCase
const Customer = db.Customer;
const CustomerAddress = db.CustomerAddress;
const SalesOrder = db.SalesOrder;

// Add new delivery details
const addNewDeliveryDetails = async (params) => {
  const {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus,
  } = params;

  // Validate FKs
  if (!(await Customer.findByPk(CustomerID))) return "no customer found";
  if (!(await CustomerAddress.findByPk(DeliveryAddressID))) return "no customer address found";
  if (!(await SalesOrder.findByPk(OrderID))) return "no sales order found";

  const newDetails = {
    CustomerID,
    DeliveryAddressID,
    OrderID,
    DeliveryDate,
    DeliveryTimeSlot,
    DeliveryStatus,
    TrackingNumber,
    Carrier,
    EstimatedDeliveryDate,
    ActualDeliveryDate,
    PaymentStatus,
  };

  return await DeliveryDetails.create(newDetails);
};

// Get all
const getAllDeliveryDetails = async () => {
  return await DeliveryDetails.findAll({
    include: [Customer, CustomerAddress, SalesOrder], // ✅ eager load relations
  });
};

// Get by ID
const getDeliveryDetailsById = async (deliveryId) => {
  return await DeliveryDetails.findByPk(deliveryId, {
    include: [Customer, CustomerAddress, SalesOrder],
  });
};

// Delete by ID
const deleteDeliveryDetailsById = async (deliveryId) => {
  const rows = await DeliveryDetails.destroy({
    where: { DeliveryID: deliveryId },
  });
  return rows; // ✅ fixed variable name
};

// Update by ID
const updateDeliveryDetailById = async (deliveryId, updateBody) => {
  const { CustomerID, DeliveryAddressID, OrderID } = updateBody;

  // Validate FKs
  if (CustomerID && !(await Customer.findByPk(CustomerID))) {
    return "Invalid Customer ID.";
  }
  if (DeliveryAddressID && !(await CustomerAddress.findByPk(DeliveryAddressID))) {
    return "Invalid Delivery address Id.";
  }
  if (OrderID && !(await SalesOrder.findByPk(OrderID))) {
    return "Invalid Order address Id.";
  }

  await DeliveryDetails.update(updateBody, { where: { DeliveryID: deliveryId } });

  // Return the updated row
  return await DeliveryDetails.findByPk(deliveryId, {
    include: [Customer, CustomerAddress, SalesOrder],
  });
};

module.exports = {
  addNewDeliveryDetails,
  getAllDeliveryDetails,
  getDeliveryDetailsById,
  deleteDeliveryDetailsById,
  updateDeliveryDetailById,
};
