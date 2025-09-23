const express = require("express");
const router = express.Router();
const customerController = require("../../controller/customer.controller");
const { auth } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const customerValidation = require("../../validations/customer.validation");

router
  .route("/")
  .get(auth(), customerController.getAllCustomers)
  .post(
    auth(),
    validate(customerValidation.createCustomer),
    customerController.addCustomer
  );

router
  .route("/:id")
  .get(
    auth(),
    validate(customerValidation.getCustomerById),
    customerController.getCustomerById
  )
  .put(
    auth(),
    validate(customerValidation.updateCustomerById),
    customerController.updateCustomerById
  )
  .delete(
    auth(),
    validate(customerValidation.deleteCustomerById),
    customerController.deleteCustomerById
  );

module.exports = router;
