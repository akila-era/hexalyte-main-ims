const db = require("../models");
const SubProduct = db.subProduct
const subProductServices = require('../service/subProduct.service')
const httpStatus = require('http-status')
const catchAsync = require('../utils/catchAsync')

const getAllSubProducts = catchAsync(async (req, res) => {

    const subProducts = await SubProduct.findAll({ include: [{ model: db.product, required: true }] })

    return res.send(subProducts)

})

const addProductsToInventory = catchAsync(async(req, res) => {

    const newProducts = await subProductServices.addProductsToInventory(req.body)

    return res.send({ newProducts })

})

module.exports = {addProductsToInventory, getAllSubProducts}