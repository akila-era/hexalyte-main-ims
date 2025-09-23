const db = require('../models')
const NewOrderItems = db.NewOrderItems
const NewOrder = db.NewOrder
const Product = db.product

const addNewOrderItem = async (orderItemData) => {
    try {
        // Validate Order exists
        const order = await NewOrder.findByPk(orderItemData.NewOrderID)
        if (!order) {
            return "no order found"
        }

        // Validate Product exists
        const product = await Product.findByPk(orderItemData.ProductID)
        if (!product) {
            return "no product found"
        }

        // Check if item already exists
        const existingItem = await NewOrderItems.findOne({
            where: {
                NewOrderID: orderItemData.NewOrderID,
                ProductID: orderItemData.ProductID
            }
        })
        if (existingItem) {
            return "item already exists"
        }

        const newOrderItem = await NewOrderItems.create(orderItemData)
        return newOrderItem
    } catch (error) {
        throw error
    }
}

const getNewOrderItemsByOrderID = async (orderId) => {
    try {
        const orderItems = await NewOrderItems.findAll({
            where: { NewOrderID: orderId },
            include: [{
                model: db.NewOrder,
                required: true
            }, {
                model: db.product,
                required: false
            }]
        })
        return orderItems
    } catch (error) {
        throw error
    }
}

const updateNewOrderItemById = async (orderId, productId, updateData) => {
    try {
        const orderItem = await NewOrderItems.findOne({
            where: {
                NewOrderID: orderId,
                ProductID: productId
            }
        })
        if (!orderItem) {
            return "no order item found"
        }

        // Validate Product if being updated
        if (updateData.ProductID && updateData.ProductID !== productId) {
            const product = await Product.findByPk(updateData.ProductID)
            if (!product) {
                return "no product found"
            }
        }
        
        await orderItem.update(updateData)
        return orderItem
    } catch (error) {
        throw error
    }
}

const deleteNewOrderItemById = async (orderId, productId) => {
    try {
        const deletedOrderItem = await NewOrderItems.destroy({
            where: {
                NewOrderID: orderId,
                ProductID: productId
            }
        })
        return deletedOrderItem
    } catch (error) {
        throw error
    }
}

const calculateItemTotal = async (orderId, productId) => {
    try {
        const orderItem = await NewOrderItems.findOne({
            where: {
                NewOrderID: orderId,
                ProductID: productId
            }
        })
        
        if (!orderItem) {
            return "no order item found"
        }

        const itemTotal = orderItem.Quantity * orderItem.UnitPrice
        const discountAmount = orderItem.DiscountType === 1 
            ? (itemTotal * orderItem.Discount / 100) // Percentage discount
            : (orderItem.Discount || 0) // Fixed discount
        
        const total = itemTotal - discountAmount
        return total
    } catch (error) {
        throw error
    }
}

module.exports = {
    addNewOrderItem,
    getNewOrderItemsByOrderID,
    updateNewOrderItemById,
    deleteNewOrderItemById,
    calculateItemTotal
}