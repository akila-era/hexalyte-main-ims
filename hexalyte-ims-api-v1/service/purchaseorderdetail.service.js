const db = require('../models');
const Purchaseorderdetail = db.purchaseorderdetail;
const Purchaseorder = db.purchaseorder;
const Product = db.product;

const getPurchaseOrderDetailsByOrderID = async (orderID) => {

    const purchaseOrderDetailsByOrderID = await Purchaseorderdetail.findAll({ where: { OrderID: orderID } })
    return purchaseOrderDetailsByOrderID

}

const addPurchaseOrderDetails = async (params) => {

    const { OrderID, ProductID, Quantity, UnitPrice } = params;

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    const newPurchaseOrderDetail = {
        OrderID,
        ProductID,
        Quantity,
        UnitPrice
    }

    const addPurchaseOrderByOrderID = await Purchaseorderdetail.create(newPurchaseOrderDetail);
    return addPurchaseOrderByOrderID;

}

const updatePurchaseOrderDetails = async (req, body) => {

    const OrderID = req.id
    const ProductID = req.pid

    const { Quantity, UnitPrice } = body;

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    const updatedPurchaseOrderDetail = {
        Quantity,
        UnitPrice
    }

    const updatePurchaseOrderDetail = await Purchaseorderdetail.update(updatedPurchaseOrderDetail, { where: { OrderID, ProductID } })
    return updatePurchaseOrderDetail

}

const deletePurchaseOrderDetail = async (params) => {

    const OrderID = params.id
    const ProductID = params.pid

    const checkPurchaseOrderID = await Purchaseorder.findByPk(OrderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const checkProductID = await Product.findByPk(ProductID)
    if (checkProductID == null) {
        return "Invalid Product ID"
    }

    const deletedPurchaseOrderDetail = await Purchaseorderdetail.destroy({ where: { OrderID, ProductID } })
    return deletedPurchaseOrderDetail

}

const deletePurchaseOrderDetailsByOrderID = async(orderID) => {

    const checkPurchaseOrderID = await Purchaseorder.findByPk(orderID)
    if (checkPurchaseOrderID == null) {
        return "Invalid Purchase Order ID"
    }

    const deletedPurchaseOrderDetails = await Purchaseorderdetail.destroy({ where: { OrderID: orderID } })
    return deletedPurchaseOrderDetails

}

module.exports = {
    getPurchaseOrderDetailsByOrderID,
    addPurchaseOrderDetails,
    updatePurchaseOrderDetails,
    deletePurchaseOrderDetail,
    deletePurchaseOrderDetailsByOrderID
}