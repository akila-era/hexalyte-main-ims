const { raw } = require("body-parser");
const db = require("../models");
const {
  generateAndSaveSalesorderInvoice,
} = require("./salesorderInvoice.service");
const Salesorder = db.salesorder;
const SalesorderDetail = db.salesorderdetail
const Inventory = db.inventorytransaction
const ProductStorage = db.productstorage
const Product = db.product
const OrderStatusHistory = db.orderstatushistory

const createsalesorder = async (params) => {

  const { OrderDate, TotalAmount, Status, LocationID, Discount, CustomerID, PaymentStatus, DiscountID, TransactionType, OrderItems } = params;
  const salesorder = { OrderDate, TotalAmount, Status, LocationID, Discount, CustomerID, PaymentStatus, DiscountID };

  let response = {
    SalesOrder: "",
    Status: "",
    OrderItemsRes: [],
    InventoryTransactionRes: [],
    ProductStorageRes: [],
    ProductQuantityRes: [],
  }

  if (OrderItems.length == 0) {
    response.Status = "No Order Items Found"
    return response
  }

  let terminate = false;

  for (const soItem of OrderItems) {
    const productStorageStock = await ProductStorage.findOne({ where: { ProductID: soItem.ProductId, LocationID } })

    if (!productStorageStock || Number(productStorageStock.Quantity) < soItem.Quantity) {
      response.Status = `Not quantity available for Product #${soItem.ProductId} in Warehouse #${LocationID}`
      terminate = true
      break
    }

  }

  if (!terminate) {

    const salesOrderRow = await Salesorder.create(salesorder)
    response.SalesOrder = salesOrderRow
    const OrderID = salesOrderRow.OrderID
    console.log(`OrderID: ${OrderID}`)

    for (const soItem of OrderItems) {

      const productStorageStock = await ProductStorage.findOne({ where: { ProductID: soItem.ProductId, LocationID } })
      const productStock = await Product.findOne({ where: { ProductID: soItem.ProductId } })

      const newStock = Number(productStorageStock.Quantity) - Number(soItem.Quantity)
      const newProductStock = Number(productStock.QuantityInStock) - Number(soItem.Quantity)

      const addSalesOrderItem = await SalesorderDetail.create({ ...soItem, OrderId: OrderID })
      const addInventoryTransaction = await Inventory.create({ SalesOrderID: OrderID, ProductID: soItem.ProductId, Quantity: soItem.Quantity, TransactionDate: OrderDate, TransactionType })
      const updateProductStorage = await ProductStorage.update({ Quantity: newStock }, { where: { ProductID: soItem.ProductId, LocationID } })
      const updateProductQuantity = await Product.update({ QuantityInStock: newProductStock }, { where: { ProductID: soItem.ProductId } })

      response.OrderItemsRes.push(addSalesOrderItem)
      response.InventoryTransactionRes.push(addInventoryTransaction)
      response.ProductStorageRes.push(updateProductStorage)
      response.ProductQuantityRes.push(updateProductQuantity)

    }

    OrderStatusHistory.create({ salesorderOrderID: OrderID, StatusChangeDate: new Date(), NewStatus: Status })
    response.Status = "success"

  }

  return response

};

const getallsalesorder = async () => {
  try {
    const salesorder = await Salesorder.findAll();
    return salesorder;
  } catch (error) {
    console.log(error);
  }
};

const getsalesorderBYId = async (OrderId) => {
  const salesorder = await Salesorder.findOne({ where: { OrderId } });
  return salesorder;
};

const updatesalesorderById = async (OrderId, updateBody) => {
  const {
    CustomerName,
    OrderDate,
    TotalAmount,
    Status,
    LocationID,
    PaymentStatus,
  } = updateBody;
  const salesorder = {
    CustomerName,
    OrderDate,
    TotalAmount,
    Status,
    LocationID,
    PaymentStatus,
  };

  const row = await Salesorder.update(salesorder, {
    where: { OrderId: OrderId },
  });
  return row;
};

const deletesalesorderById = async (OrderId) => {
  const salesorder = await getsalesorderBYId(OrderId);
  if (!salesorder) return null;
  await salesorder.destroy();
  return salesorder;
};

const getSalesReport = async ({ startDate, endDate }) => {
  const results = await db.sequelize.query(
    `
          SELECT 
            Name AS ProductName,
            SUM(Quantity) AS UnitsSold,
            SUM(ProductSales) AS TotalSales,
            SUM(Quantity * BuyingPrice) AS COGS,
            (SUM(ProductSales) - 
            SUM(Quantity * BuyingPrice)) AS Profit
        FROM (
            SELECT 
                sod.OrderID,
                sod.ProductId,
                sod.Quantity,
                sod.UnitPrice,
                p.Name,
                p.BuyingPrice,
                (sod.Quantity * sod.UnitPrice) AS ProductSales
            FROM salesorderdetails sod
            JOIN products p ON sod.ProductId = p.ProductId
            JOIN salesorders so ON sod.OrderID = so.OrderID
            WHERE so.OrderDate BETWEEN :startDate AND :endDate
        ) AS OrderTotals
        GROUP BY Name;
        `,
    {
      replacements: { startDate, endDate },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );

  const discounts = await db.sequelize.query(`
      SELECT SUM(Discount) AS TotalDiscount FROM salesorders WHERE OrderDate BETWEEN :startDate AND :endDate
    `, {
    replacements: { startDate, endDate },
    type: db.sequelize.QueryTypes.SELECT
  })

  return { results, discounts };
};

const getPaymentStatusSummary = async () => {
  try {
    const query = `
    SELECT
    SUM(CASE WHEN PaymentStatus = 'PAID' THEN TotalAmount ELSE 0 END) AS
    TotalPaidAmount,
    SUM(CASE WHEN PaymentStatus='UNPAID' THEN TotalAmount ELSE 0 END) AS
    TotalUnpaidAmount(TotalAmount) AS TotalAmount FROM salesorders;
    `;

    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true,
    });

    return {
      success: true,
      data: results[0],
      message: "Payment status summary fetch successfully",
    };
  } catch (error) {
    console.error("Error fetching payment status summary:", error);
    return {
      success: false,
      data: {},
      message: "Failed to fetch payment status summary: "
    };
  }
};

module.exports = {
  getPaymentStatusSummary,
  createsalesorder,
  getallsalesorder,
  getsalesorderBYId,
  updatesalesorderById,
  deletesalesorderById,
  getSalesReport,
};
