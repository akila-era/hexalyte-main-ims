const db = require("../models");
const Product = db.product;
const Warehouse = db.warehouselocation;
const subProduct = db.subProduct;
const ProductStorage = db.productstorage;

// const addProductsToInventory = async (params) => {

//     const { ProductID, ProductName, Quantity, WarehouseID } = params

//     const checkProductID = await Product.findByPk(ProductID)
//     if (checkProductID == null) return "no product found";

//     const checkWarehouseID = await Warehouse.findByPk(WarehouseID)
//     if (checkWarehouseID == null) return "no warehouse found";

//     // Use transaction to ensure data consistency
//     const result = await db.sequelize.transaction(async (t) => {
//         // Get the current max serial number for this specific product
//         const [maxResult] = await db.sequelize.query(`
//         SELECT COALESCE(MAX(
//             CAST(SUBSTRING_INDEX(serialNumber, '-', -1) AS UNSIGNED)
//         ), 0) as maxSerial 
//         FROM subProducts 
//         WHERE ProductID = :productId
//     `, {
//             replacements: { productId: ProductID },
//             transaction: t
//         });

//         let nextSerial = Number(maxResult[0].maxSerial) + 1;
//         let records = [];

//         for (let index = 0; index < Quantity; index++) {
//             const record = await subProduct.create({
//                 serialNumber: `${ProductID}-${ Number(nextSerial) + Number(index)}`,
//                 status: 'AVAILABLE',
//                 ProductID: ProductID,
//                 WarehouseID: WarehouseID,
//                 isActive: true
//             }, { transaction: t });

//             const productQuantityUpdate = await Product.increment('QuantityInStock', {
//                 by: 1,
//                 where: { ProductID: ProductID }
//             })

//             records.push(record);
//         }

//         return records;
//     });

//     return result;

// }

const addProductsToInventory = async (params) => {
  const { ProductID, ProductName, Quantity, WarehouseID } = params;

  const checkProductID = await Product.findByPk(ProductID);
  if (checkProductID == null) return "no product found";

  const checkWarehouseID = await Warehouse.findByPk(WarehouseID);
  if (checkWarehouseID == null) return "no warehouse found";

  function removeVowelsAndUppercase(productName) {
    // Check if input is a string
    if (typeof productName !== "string") {
      throw new Error("Input must be a string");
    }

    // Remove vowels (a, e, i, o, u) - both lowercase and uppercase
    // Keep spaces and other characters intact
    const withoutVowels = productName.replace(/[aeiouAEIOU]/g, "");

    // Convert to uppercase
    return withoutVowels.toUpperCase();
  }

  // Use transaction to ensure data consistency
  const result = await db.sequelize.transaction(async (t) => {
    // Get the current max serial number for this specific product
    const [maxResult] = await db.sequelize.query(`
        SELECT COALESCE(MAX(
                                CAST(SUBSTRING_INDEX(serialNumber, '-', -1) AS UNSIGNED)
                        ), 0) as maxSerial
        FROM subProducts
        WHERE ProductID = :productId
    `, {
      replacements: { productId: ProductID },
      transaction: t,
    });

    let nextSerial = Number(maxResult[0].maxSerial) + 1;
    let records = [];

    const dbResponse = {
      products: [],
      subProducts: [],
      productStorage: [],
    };

    // Move the increment outside the loop for better performance
    // and increment by the total quantity at once
    const productRecord = await Product.increment("QuantityInStock", {
      by: Quantity,
      where: { ProductID: ProductID },
      transaction: t,  // Add this line!
    });

    dbResponse.products.push(productRecord);

    for (let index = 0; index < Quantity; index++) {
      const record = await subProduct.create({
        serialNumber: `${removeVowelsAndUppercase(ProductName)}-${ProductID}-${Number(nextSerial) + Number(index)}`,
        status: "AVAILABLE",
        ProductID: ProductID,
        WarehouseID: WarehouseID,
        isActive: true,
      }, { transaction: t });

      dbResponse.subProducts.push(record);
    }

    const checkProductStorage = await ProductStorage.findOne({
      where: { ProductID: ProductID, LocationID: WarehouseID },
      transaction: t,
    });

    if (!checkProductStorage) {

      const createProductStorage = await ProductStorage.create({
        ProductID: ProductID,
        LocationID: WarehouseID,
        Quantity: Quantity,
        LastUpdated: new Date(),
      }, { transaction: t });

      dbResponse.productStorage.push(createProductStorage);

    } else {

      const createProductStorage = await ProductStorage.increment("Quantity", {
        by: Quantity,
        where: { ProductID: ProductID, LocationID: WarehouseID },
        transaction: t,
      });

      dbResponse.productStorage.push(createProductStorage);

    }

    return dbResponse;

  });

  return result;

};

module.exports = { addProductsToInventory };