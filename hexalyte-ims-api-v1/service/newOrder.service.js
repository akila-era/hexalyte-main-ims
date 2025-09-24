const db = require("../models");
const NewOrder = db.NewOrder;
const NewOrderItem = db.NewOrderItems;
const SubProduct = db.subProduct;
const Page = db.Page;
const OrderSource = db.OrderSource;
const DeliveryPartner = db.DeliveryPartner;
const Product = db.product;
const trackingNumberService = require("../service/trackingnumber.service");
const orderStatusService = require("../service/orderStatus.service");

const addNewOrder = async (orderData) => {

  if (!orderData) {
    return { success: false, message: "No order data provided" };
  }

  const response = {
    success: false,
    order: null,
    newOrder: null,
    orderItem: null,
    error: null,
  };

  try {
    // Step 1: Validate required fields
    if (!orderData.customerName || !orderData.primaryMobile || !orderData.productId) {
      return {
        success: false,
        message: "Missing required fields: customerName, primaryMobile, or productId",
      };
    }

    // Step 2: Validate product exists using productId
    const product = await Product.findOne({
      where: {
        ProductID: orderData.productId,
        isActive: true,
      },
    });

    if (!product) {
      return {
        success: false,
        message: `No active product found with ID: ${orderData.productId}`,
      };
    }

    // Step 3: Check if customer already has an order
    const existingOrder = await NewOrder.findOne({
      where: {
        PrimaryPhone: orderData.primaryMobile,
        SecondaryPhone: orderData.secondaryMobile || null,
      },
    });

    let orderID;

    if (existingOrder) {
      // Use existing order
      orderID = existingOrder.NewOrderID;
      response.order = existingOrder.dataValues;
    } else {
      // Create new order
      const createNewOrder = await NewOrder.create({
        CustomerName: orderData.customerName,
        CustomerAddress: orderData.address,
        PrimaryPhone: orderData.primaryMobile,
        SecondaryPhone: orderData.secondaryMobile || null,
        CityName: orderData.city,
        Remark: orderData.remark || null,
      });

      orderID = createNewOrder.NewOrderID;
      response.newOrder = createNewOrder.dataValues;
    }

    // Step 4: Check stock availability
    const availableProduct = await SubProduct.findOne({
      where: {
        ProductID: orderData.productId,
        status: "AVAILABLE",
      },
    });

    if (!availableProduct) {
      return {
        success: false,
        message: `No stock available for product: ${product.Name}`,
        order: response.order || response.newOrder,
      };
    }

    // Step 5: Update stock status to prevent race conditions
    await availableProduct.update({ status: "ALLOCATED" });

    // Step 6: Create order item
    const createOrderItem = await NewOrderItem.create({
      NewOrderID: orderID,
      SubProductID: availableProduct.ID,
      Quantity: 1,
      UnitPrice: product.SellingPrice,
    });

    response.orderItem = {
      ...createOrderItem.dataValues,
      CustomerName: orderData.customerName,
      ProductName: product.Name,
    };

    response.success = true;
    response.message = existingOrder
      ? "Item added to existing order successfully"
      : "New order created successfully";

    return response;

  } catch (error) {
    console.error("Error processing single order:", error);

    return {
      success: false,
      message: `Error processing order: ${error.message}`,
      error: error.message,
    };
  }

};

const addBulkOrders = async (orderData) => {
  if (!orderData || orderData.length <= 0) {
    return { success: false, message: "No order items provided" };
  }

  const success = [];
  const errors = [];

  // Step 1: Validate products and prepare data
  for (const orderRow of orderData) {
    const productName = orderRow.Product?.trim().toLowerCase();

    if (!productName) {
      errors.push(`Missing product name in row ${orderRow.No}`);
      continue;
    }

    // Validate required fields
    if (!orderRow.CustomerName || !orderRow.MobileNo1) {
      errors.push(`Missing required customer information in row ${orderRow.No}`);
      continue;
    }

    try {
      const checkProduct = await Product.findAll({
        where: db.sequelize.where(
          db.sequelize.fn("LOWER", db.sequelize.fn("TRIM", db.sequelize.col("Name"))),
          productName,
        ),
      });

      if (checkProduct.length > 0) {
        const productData = checkProduct[0].dataValues;

        success.push({
          ...productData,
          CustomerName: orderRow.CustomerName,
          PrimaryPhone: orderRow.MobileNo1,
          SecondaryPhone: orderRow.MobileNo2 || null,
          Address: orderRow.Address,
          City: orderRow.City,
          Remark: orderRow.Remark || null,
          RowNumber: orderRow.No, // Keep track of original row
        });
      } else {
        errors.push(`No such product: ${orderRow.Product} in row ${orderRow.No}`);
      }
    } catch (e) {
      console.error("Database error for row", orderRow.No, ":", e);
      errors.push(`Database error in row ${orderRow.No}: ${e.message}`);
    }
  }

  // Step 2: Process orders if validation passed
  if (success.length === 0) {
    return {
      success: false,
      totalProcessed: orderData.length,
      validItems: success.length,
      errors,
    };
  }

  const response = {
    success: true,
    orders: [],
    newOrders: [],
    orderItems: [],
    errors: [], // Track processing errors separately
  };

  // Track allocated SubProductIDs to avoid duplicates
  const allocatedSubProductIDs = new Set();

  console.log("=== BULK UPLOAD DEBUG START ===");
  console.log("Processing", success.length, "validated items");
  console.log(success);

  for (const item of success) {
    try {
      // Check if customer already has an order
      const existingOrder = await NewOrder.findOne({
        where: {
          PrimaryPhone: item.PrimaryPhone,
          SecondaryPhone: item.SecondaryPhone || null,
        },
      });

      if (existingOrder) {
        // Add item to existing order
        const orderID = existingOrder.NewOrderID;

        // Check stock availability - EXCLUDE already allocated ones
        const availableProduct = await SubProduct.findOne({
          where: {
            ProductID: item.ProductID,
            status: "AVAILABLE",
          },
        });

        if (!availableProduct) {
          response.errors.push(`No stock available for ${item.Name} (Customer: ${item.CustomerName})`);
          continue;
        }

        // Track this allocation immediately to prevent double allocation
        // allocatedSubProductIDs.add(availableProduct.SubProductID);

        // Update stock status first to prevent race conditions
        await availableProduct.update({ status: "ALLOCATED" });

        // Create order item
        const createOrderItem = await NewOrderItem.create({
          NewOrderID: orderID,
          SubProductID: availableProduct.dataValues.ID,
          Quantity: 1,
          UnitPrice: item.SellingPrice,
        });

        response.orderItems.push({
          ...createOrderItem.dataValues,
          CustomerName: item.CustomerName,
          ProductName: item.Name,
        });

      } else {
        // Create new order
        console.log("Creating new order for customer:", item.CustomerName);
        const createNewOrder = await NewOrder.create({
          CustomerName: item.CustomerName,
          CustomerAddress: item.Address,
          PrimaryPhone: item.PrimaryPhone,
          SecondaryPhone: item.SecondaryPhone,
          CityName: item.City,
          Remark: item.Remark,
          Status: item.OrderStatus || 'Pending',
          CallStatus: item.CallStatus || 'Not Called',
        });

        console.log("New order created:", createNewOrder.NewOrderID);
        response.newOrders.push(createNewOrder.dataValues);

        console.log("PRODUCT ID: " + item.ProductID);

        // Now add the first item to this new order - EXCLUDE already allocated ones
        const availableProduct = await SubProduct.findOne({
          where: {
            ProductID: item.ProductID,
            status: "AVAILABLE",
          },
        });

        console.log(availableProduct);

        if (!availableProduct) {
          response.errors.push(`No stock available for ${item.Name} (Customer: ${item.CustomerName})`);
          continue;
        }

        // Track this allocation immediately to prevent double allocation
        allocatedSubProductIDs.add(availableProduct.SubProductID);

        // Update stock status first to prevent race conditions
        await availableProduct.update({ status: "ALLOCATED" });

        // Create order item
        console.log("Creating order item for order:", createNewOrder.NewOrderID, "with SubProduct:", availableProduct.dataValues.ID);
        const createOrderItem = await NewOrderItem.create({
          NewOrderID: createNewOrder.NewOrderID,
          SubProductID: availableProduct.dataValues.ID,
          Quantity: 1,
          UnitPrice: item.SellingPrice,
        });

        console.log("Order item created:", createOrderItem.dataValues);
        response.orderItems.push({
          ...createOrderItem.dataValues,
          CustomerName: item.CustomerName,
          ProductName: item.Name,
        });
      }

      response.orders.push({
        CustomerName: item.CustomerName,
        ProductName: item.Name,
        Status: "Processed",
      });

    } catch (e) {
      console.error("Error processing order for customer:", item.CustomerName, e);
      response.errors.push(`Error processing order for ${item.CustomerName}: ${e.message}`);

      // Note: Without transactions, partial data may already be committed
      // Consider implementing a cleanup mechanism if needed
    }
  }

  // Final response
  return {
    success: true,
    totalProcessed: orderData.length,
    validationErrors: errors,
    processingErrors: response.errors,
    summary: {
      newOrdersCreated: response.newOrders.length,
      orderItemsAdded: response.orderItems.length,
      totalSuccessful: response.orders.length,
      totalErrors: errors.length + response.errors.length,
    },
    data: {
      newOrders: response.newOrders,
      orderItems: response.orderItems,
      orders: response.orders,
    },
  };
};

const assignOrdersToDeliveryPartner = async (orders) => {
  try {

    const response = {
      success: [],
      errors: [],
    };

    if (!orders.length) {
      throw new Error("No orders found");
      return;
    }

    for (const order of orders) {
      // Use the order status service for validation
      const validation = await orderStatusService.validateOrderForDelivery(order.orderId);
      
      if (!validation.valid) {
        response.errors.push(validation.message);
        continue;
      }

      const checkOrder = validation.order;

      const trackingNumber = await trackingNumberService.assignTrackingNumbersFromDeliveryPartner(order.deliveryPartnerId, 1);

      console.log(`----------------`);
      console.log(trackingNumber);

      if (trackingNumber.success) {
        const updateOrder = await NewOrder.update({
          TrackingNumber: trackingNumber.trackingNumbers[0],
          DeliveryPartnerID: order.deliveryPartnerId,
          Status: 'Processing',
          PaymentMode: order.paymentMethod || 'COD',
          DeliveryFee: order.deliveryCost || 0
        }, {
          where: {
            NewOrderID: order.orderId,
          },
        });

        if (updateOrder) response.success.push(updateOrder);
      } else {
        response.errors.push(`Failed to assign tracking number for order ${order.orderId}: ${trackingNumber.message}`);
      }

    }

  } catch (e) {
    throw e;
  }
};

const getNewOrderByID = async (orderId) => {
  try {
    const order = await NewOrder.findByPk(orderId, {
      include: [{
        model: db.Page,
        required: false,
      }, {
        model: db.OrderSource,
        required: false,
      }, {
        model: db.DeliveryPartner,
        required: false,
      }, {
        model: db.NewOrderItems,
        required: false,
        include: [{
          model: db.product,
          required: false,
        }],
      }],
    });
    return order;
  } catch (error) {
    throw error;
  }
};

const updateNewOrderById = async (orderId, updateData) => {
  try {
    const order = await NewOrder.findByPk(orderId);
    if (!order) {
      return "no order found";
    }

    // Validate Page if being updated
    if (updateData.PageID) {
      const page = await Page.findByPk(updateData.PageID);
      if (!page) {
        return "no page found";
      }
    }

    // Validate OrderSource if being updated
    if (updateData.OrderSourceID) {
      const orderSource = await OrderSource.findByPk(updateData.OrderSourceID);
      if (!orderSource) {
        return "no order source found";
      }
    }

    // Validate DeliveryPartner if being updated
    if (updateData.DeliverPartnerID) {
      const deliveryPartner = await DeliveryPartner.findByPk(updateData.DeliverPartnerID);
      if (!deliveryPartner) {
        return "no delivery partner found";
      }
    }

    await order.update(updateData);
    return order;
  } catch (error) {
    throw error;
  }
};

const deleteNewOrderById = async (orderId) => {
  try {
    // First delete associated order items
    await db.NewOrderItems.destroy({
      where: { NewOrderID: orderId },
    });

    // Then delete the order
    const deletedOrder = await NewOrder.destroy({
      where: { NewOrderID: orderId },
    });
    return deletedOrder;
  } catch (error) {
    throw error;
  }
};

const calculateOrderTotal = async (orderId) => {
  try {
    const order = await NewOrder.findByPk(orderId, {
      include: [{
        model: db.NewOrderItems,
        required: false,
      }],
    });

    if (!order) {
      return "no order found";
    }

    let total = 0;

    // Calculate items total
    if (order.NewOrderItems && order.NewOrderItems.length > 0) {
      for (const item of order.NewOrderItems) {
        const itemTotal = item.Quantity * item.UnitPrice;
        const discountAmount = item.DiscountType === 1
          ? (itemTotal * item.Discount / 100) // Percentage discount
          : (item.Discount || 0); // Fixed discount

        total += itemTotal - discountAmount;
      }
    }

    // Add delivery fee
    if (order.DeliveryFee) {
      total += order.DeliveryFee;
    }

    return total;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addNewOrder,
  addBulkOrders,
  getNewOrderByID,
  updateNewOrderById,
  deleteNewOrderById,
  calculateOrderTotal,
  assignOrdersToDeliveryPartner,
};

