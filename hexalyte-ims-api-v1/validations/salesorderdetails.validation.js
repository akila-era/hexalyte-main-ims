const Joi = require('joi');


const createSalesOrderDetail = {
  body: Joi.object().keys({
    OrderId: Joi.number().integer().required(),  
    ProductId: Joi.number().integer().required(), 
    Quantity: Joi.number().integer().min(1).required(),
    UnitPrice: Joi.number().precision(2).required(),
  }),
};


const getSalesOrderDetailByID = {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
};
const deleteSalesOrderDetail= {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
};

const updateSalesOrderDetail = {
  params: Joi.object().keys({
    OrderId: Joi.number().integer().required(),
    ProductId: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    Quantity: Joi.number().integer().min(1),  
    UnitPrice: Joi.number().precision(2),    
  }).min(1),  
};



module.exports = {
  createSalesOrderDetail,
  getSalesOrderDetailByID,
  updateSalesOrderDetail,
  deleteSalesOrderDetail,
}