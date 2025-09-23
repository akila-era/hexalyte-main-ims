const express = require("express");
const router = express.Router();
const subProductController = require("../../controller/subProduct.controller");

router
  .route("/")
  .get(subProductController.getAllSubProducts)
  .post(subProductController.addProductsToInventory);


module.exports = router;