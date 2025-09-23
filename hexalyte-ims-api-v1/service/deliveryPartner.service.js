const db = require('../models')
const DeliveryPartner = db.DeliveryPartner

const addDeliveryPartner = async (deliveryPartnerData) => {
    try {
        const newDeliveryPartner = await DeliveryPartner.create(deliveryPartnerData)
        return newDeliveryPartner
    } catch (error) {
        throw error
    }
}

const getDeliveryPartnerByID = async (deliveryPartnerId) => {
    try {
        const deliveryPartner = await DeliveryPartner.findByPk(deliveryPartnerId, {
            include: [{
                model: db.NewOrder,
                required: false
            }]
        })
        return deliveryPartner
    } catch (error) {
        throw error
    }
}

const updateDeliveryPartnerById = async (deliveryPartnerId, updateData) => {
    try {
        const deliveryPartner = await DeliveryPartner.findByPk(deliveryPartnerId)
        if (!deliveryPartner) {
            return "no delivery partner found"
        }
        
        await deliveryPartner.update(updateData)
        return deliveryPartner
    } catch (error) {
        throw error
    }
}

const deleteDeliveryPartnerById = async (deliveryPartnerId) => {
    try {
        const deletedDeliveryPartner = await DeliveryPartner.destroy({
            where: { DeliverPartnerID: deliveryPartnerId }
        })
        return deletedDeliveryPartner
    } catch (error) {
        throw error
    }
}

const toggleDeliveryPartnerStatus = async (deliveryPartnerId) => {
    try {
        const deliveryPartner = await DeliveryPartner.findByPk(deliveryPartnerId)
        if (!deliveryPartner) {
            return "no delivery partner found"
        }
        
        await deliveryPartner.update({ isActive: !deliveryPartner.isActive })
        return deliveryPartner
    } catch (error) {
        throw error
    }
}

const assignDeliveryPartner = async (orders) => {

    // [
    //   {
    //     "orderId": 1,
    //     "deliveryPartnerId": "1",
    //     "trackingNumber": "DHL3922328466",
    //     "deliveryDate": "2025-08-17",
    //     "timeSlot": "9:00 AM - 12:00 PM",
    //     "priority": "normal",
    //     "notes": ""
    //   },
    //   {
    //     "orderId": 2,
    //     "deliveryPartnerId": "1",
    //     "trackingNumber": "DHL9662078610",
    //     "deliveryDate": "2025-08-17",
    //     "timeSlot": "9:00 AM - 12:00 PM",
    //     "priority": "normal",
    //     "notes": ""
    //   }
    // ]

}

module.exports = {
    addDeliveryPartner,
    getDeliveryPartnerByID,
    updateDeliveryPartnerById,
    deleteDeliveryPartnerById,
    toggleDeliveryPartnerStatus,
    assignDeliveryPartner,
}