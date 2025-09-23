
const db = require('../models');
const PurchaseOrder = db.purchaseorder
const Inventory = db.inventorytransaction
const PurchaseOrderDetails = db.purchaseorderdetail
const OrderStatuses = db.orderstatushistory
const Products = db.product

const addNewPurchaseOrder = async (params) => {

    const { OrderDate, TotalAmount, Status, Discount, NetAmount } = params;

    const row = await PurchaseOrder.create({ OrderDate, TotalAmount, Status, Discount, NetAmount })

    return row;

}

const getAllPurchaseOrders = async (filter, options) => {
    const PurchaseOrders = await PurchaseOrder.findAll();
    return PurchaseOrders
}

const getPurchaseOrderByID = async (poID) => {
    const PurchaseOrders = await PurchaseOrder.findOne({ where: { OrderID: poID } })
    return PurchaseOrders
}

const updatePurchaseOrderByID = async (poID, updateBody) => {
    const { OrderDate, TotalAmount, Status } = updateBody
    const purchaseOrder = {
        OrderDate,
        TotalAmount,
        Status
    }
    const row = await PurchaseOrder.update(purchaseOrder, { where: { OrderID: poID } })
    return row
}

const deletePurchaseOrderByID = async (poID) => {

    const purchaseOrderItems = await PurchaseOrderDetails.findAll({ where: { OrderID: poID } })
    const inventoryTransactions = await Inventory.findAll({ where: { PurchaseOrderID: poID } })
    const orderStatusHistories = await OrderStatuses.findAll({ where: { purchaseorderOrderID: poID } })

    if (purchaseOrderItems.length !== 0) {

        let shouldTerminate = false
        let pID;

        for (const poItem of purchaseOrderItems) {
            const productQuantity = await Products.findOne({ where: { ProductID: poItem.ProductID } });

            const newQuantity = Number(productQuantity.QuantityInStock) - Number(poItem.Quantity);

            if (newQuantity < 0) {
                pID = poItem.ProductID
                shouldTerminate = true;
                break;
            }
        }

        if (!shouldTerminate) {
            for (const poItem of purchaseOrderItems) {
                const productQuantity = await Products.findOne({ where: { ProductID: poItem.ProductID } });

                const newQuantity = Number(productQuantity.QuantityInStock) - Number(poItem.Quantity);

                await Products.update(
                    { QuantityInStock: newQuantity },
                    { where: { ProductID: poItem.ProductID } }
                );
            }

            await PurchaseOrderDetails.destroy({ where: { OrderID: poID } });
        } else {
            return `Not enough quantity in Product: #${pID}`
        }

    }

    if (inventoryTransactions.length !== 0) {
        await Inventory.destroy({ where: { PurchaseOrderID: poID } })
    }

    if (orderStatusHistories.length !== 0) {
        await OrderStatuses.destroy({ where: { purchaseorderOrderID: poID } })
    }

    const row = await PurchaseOrder.destroy({ where: { OrderID: poID } })
    return row

    // return purchaseOrderItems

}

module.exports = {
    getAllPurchaseOrders,
    addNewPurchaseOrder,
    getPurchaseOrderByID,
    updatePurchaseOrderByID,
    deletePurchaseOrderByID
}