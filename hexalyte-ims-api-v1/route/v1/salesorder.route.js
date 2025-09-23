const express = require('express');
const router = express.Router();
const salesorderController = require('../../controller/salesorder.controller'); 
const validate = require('../../middleware/validate');
const salesorderValidation = require('../../validations/salesorder.validation');
const {auth} = require('../../middleware/auth');
const salesorderInvoice = require('../../controller/salesorderinvoice.controller');





router
  .route('/')
  .post( auth(), validate(salesorderValidation.createsalesorder), salesorderController.createsalesorder)
  .get( auth(), salesorderController.getallsalesorder);
router
  .route('/:id')
  .get(auth(), salesorderController.getsalesorderbyID)
  .delete(auth(), validate(salesorderValidation.deletesalesorder), salesorderController.deletesalesorder) 
  .put(auth(), validate(salesorderValidation.updatesalesorder), salesorderController.updatesalesorder); 

// router
//   .route('/invoice')
//   .post(auth(), salesorderInvoice.saveSalesOrderInvoice)

router
.route('/report/sales')
.get(salesorderController.getsalesreport);

router
.route('/summery/paidsummery')
.get(salesorderController.getPaymentStatsummery);


module.exports = router;         
