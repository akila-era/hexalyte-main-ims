const db = require("../models");
const NewOrder = db.NewOrder;
const newOrderServices = require("../service/newOrder.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const getAllNewOrders = catchAsync(async (req, res) => {
  try {

    // const [newOrderItemsSchema] = await db.sequelize.query("DESCRIBE NewOrderItems");
    // const [subProductSchema] = await db.sequelize.query("DESCRIBE subProducts");

    // console.log('NewOrderItems table structure:', newOrderItemsSchema);
    // console.log('subProducts table structure:', subProductSchema);

    // Step 1: Test basic query without includes
    console.log("Testing basic NewOrder query...");
    const basicOrders = await NewOrder.findAll();
    console.log("Basic query successful, found:", basicOrders.length, "orders");

    // Step 2: Test each include separately
    let allNewOrders;

    try {
      console.log("Testing with Page include...");
      allNewOrders = await NewOrder.findAll({
        include: [{
          model: db.Page,
          required: false,
        }],
      });
      console.log("Page include successful");
    } catch (error) {
      console.log("Page include failed:", error.message);
    }

    try {
      console.log("Testing with OrderSource include...");
      allNewOrders = await NewOrder.findAll({
        include: [{
          model: db.OrderSource,
          required: false,
        }],
      });
      console.log("OrderSource include successful");
    } catch (error) {
      console.log("OrderSource include failed:", error.message);
    }

    try {
      console.log("Testing with DeliveryPartner include...");
      allNewOrders = await NewOrder.findAll({
        include: [{
          model: db.DeliveryPartner,
          required: false,
        }],
      });
      console.log("DeliveryPartner include successful");
    } catch (error) {
      console.log("DeliveryPartner include failed:", error.message);
    }

    try {
      console.log("Testing with NewOrderItems include...");
      allNewOrders = await NewOrder.findAll({
        include: [{
          model: db.NewOrderItems,
          required: false,
        }],
      });
      console.log("NewOrderItems include successful");
    } catch (error) {
      console.log("NewOrderItems include failed:", error.message);
    }

    try {
      console.log("Testing with nested subProduct include...");
      allNewOrders = await NewOrder.findAll({
        include: [{
          model: db.NewOrderItems,
          required: false,
          include: [{
            model: db.subProduct,
            required: false,
          }],
        }],
      });
      console.log("Nested subProduct include successful");
    } catch (error) {
      console.log("Nested subProduct include failed:", error.message);
    }

    // Final query with all includes for dispatch orders
    try {
      console.log("Final query with all includes...");
      allNewOrders = await NewOrder.findAll({
        include: [
          {
            model: db.DeliveryPartner,
            required: false,
          },
          {
            model: db.NewOrderItems,
            required: false,
            include: [{
              model: db.subProduct,
              required: false,
              include: [{
                model: db.product,
                required: false,
              }]
            }],
          },
          {
            model: db.Page,
            required: false,
          },
          {
            model: db.OrderSource,
            required: false,
          }
        ],
      });
      console.log("Final query successful with", allNewOrders.length, "orders");
    } catch (error) {
      console.log("Final query failed:", error.message);
      allNewOrders = basicOrders;
    }

    return res.status(httpStatus.OK).json({
      success: true,
      message: "Orders retrieved successfully",
      data: allNewOrders,
    });

  } catch (error) {
    console.error("Error in getAllNewOrders:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving orders",
      error: error.message,
    });
  }
});

const getNewOrderByID = catchAsync(async (req, res) => {
  const newOrder = await newOrderServices.getNewOrderByID(req.params.id);
  if (!newOrder) {
    return res.status(httpStatus.NOT_FOUND).send({
      message: `No Order Found with ID:${req.params.id}`,
    });
  }

  return res.status(httpStatus.OK).send({ newOrder });
});

const addNewOrder = catchAsync(async (req, res) => {

  try {

    // Validate required fields
    const { customerName, address, primaryMobile, city, productId, product } = req.body;

    if (!customerName || !address || !primaryMobile || !city || !productId || !product) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["customerName", "address", "primaryMobile", "city", "productId", "product"],
      });
    }

    // Additional validation for product object
    if (!product.SellingPrice || !product.Name) {
      return res.status(400).json({
        success: false,
        message: "Invalid product data",
        required: ["product.SellingPrice", "product.Name"],
      });
    }

    // Call the service function
    const result = await newOrderServices.addNewOrder(req.body);

    if (result.success) {
      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
      });
    }

  } catch (error) {
    console.error("Controller error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: `${error.message} : something went wrong`,
    });
  }

});

const addBulkOrders = catchAsync(async (req, res) => {

  const bulkOrders = await newOrderServices.addBulkOrders(req.body);

  return res.status(httpStatus.OK).send({ bulkOrders });

});

const assignOrdersToDeliveryPartner = catchAsync(async (req, res) => {

  try {

    const assignToDelivery = await newOrderServices.assignOrdersToDeliveryPartner(req.body);
    return res.status(httpStatus.OK).send({ assignToDelivery });

  } catch (e) {

    return res.status(httpStatus.BAD_REQUEST).send({ status: false, message: e.message });

  }

});

const updateNewOrderById = catchAsync(async (req, res) => {
  const updatedNewOrder = await newOrderServices.updateNewOrderById(req.params.id, req.body);
  if (updatedNewOrder == "no order found") {
    return res.status(httpStatus.NOT_FOUND).send({
      message: `Invalid Order ID. Order ID does not exists`,
    });
  } else if (updatedNewOrder == "no page found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Page ID. Page ID does not exists`,
    });
  } else if (updatedNewOrder == "no order source found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Invalid Order Source ID. Order Source ID does not exists",
    });
  } else if (updatedNewOrder == "no delivery partner found") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: "Invalid Delivery Partner ID. Delivery Partner ID does not exists",
    });
  }

  return res.status(httpStatus.OK).send({ updatedNewOrder });
});

const deleteNewOrderById = catchAsync(async (req, res) => {
  const deletedNewOrder = await newOrderServices.deleteNewOrderById(req.params.id);
  if (deletedNewOrder == 0) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Order ID. Order does not exists`,
    });
  }

  return res.status(httpStatus.OK).send({ deletedNewOrder });
});

const calculateOrderTotal = catchAsync(async (req, res) => {
  const orderTotal = await newOrderServices.calculateOrderTotal(req.params.id);
  if (orderTotal == "no order found") {
    return res.status(httpStatus.NOT_FOUND).send({
      message: `Invalid Order ID. Order ID does not exists`,
    });
  }

  return res.status(httpStatus.OK).send({ orderTotal });
});

module.exports = {
  addNewOrder,
  addBulkOrders,
  getAllNewOrders,
  getNewOrderByID,
  updateNewOrderById,
  deleteNewOrderById,
  calculateOrderTotal,
  assignOrdersToDeliveryPartner,
};