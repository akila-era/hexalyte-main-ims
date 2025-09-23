const express = require('express')
const router = express.Router();
const purchaseorderController = require('../../controller/purchaseorder.controller')
const {auth} = require('../../middleware/auth')
const validate = require('../../middleware/validate')
const purchaseorderValidation = require('../../validations/purchaseorder.validation')

router
    .route('/')
    .get(auth(), purchaseorderController.getAllPurchaseOrders)
    .post(purchaseorderController.addNewPurchaseOrder)

router
    .route('/:id')
    // .get - get PO by Id
    .get(auth(), purchaseorderController.getPurchaseOrderByID)
    // .put - update PO by Id
    .put(auth(), validate(purchaseorderValidation.updatePurchaseOrder), purchaseorderController.updatePurchaseOrderByID)
    // .delete - delete PO by Id
    .delete(auth(), validate(purchaseorderValidation.deletePurchaseOrder), purchaseorderController.deletePurchaseOrderByID)


module.exports = router;