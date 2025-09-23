const db = require('../models')
const OrderSource = db.OrderSource

const addOrderSource = async (orderSourceData) => {
    try {
        const newOrderSource = await OrderSource.create(orderSourceData)
        return newOrderSource
    } catch (error) {
        throw error
    }
}

const getOrderSourceByID = async (orderSourceId) => {
    try {
        const orderSource = await OrderSource.findByPk(orderSourceId, {
            include: [{
                model: db.NewOrder,
                required: false
            }]
        })
        return orderSource
    } catch (error) {
        throw error
    }
}

const updateOrderSourceById = async (orderSourceId, updateData) => {
    try {
        const orderSource = await OrderSource.findByPk(orderSourceId)
        if (!orderSource) {
            return "no order source found"
        }
        
        await orderSource.update(updateData)
        return orderSource
    } catch (error) {
        throw error
    }
}

const deleteOrderSourceById = async (orderSourceId) => {
    try {
        const deletedOrderSource = await OrderSource.destroy({
            where: { OrderSourceID: orderSourceId }
        })
        return deletedOrderSource
    } catch (error) {
        throw error
    }
}

const toggleOrderSourceStatus = async (orderSourceId) => {
    try {
        const orderSource = await OrderSource.findByPk(orderSourceId)
        if (!orderSource) {
            return "no order source found"
        }
        
        await orderSource.update({ isActive: !orderSource.isActive })
        return orderSource
    } catch (error) {
        throw error
    }
}

module.exports = {
    addOrderSource,
    getOrderSourceByID,
    updateOrderSourceById,
    deleteOrderSourceById,
    toggleOrderSourceStatus
}