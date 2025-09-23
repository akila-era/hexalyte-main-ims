const db = require('../models');
const warehousetransfers = db.warehousetransfers;
const WarehouseStock = db.productstorage;
const sequelize = db.sequelize;
const Warehouse = db.warehouselocation;
const Product = db.product;


const transferStock = async ({
    ProductID,
    sourceWarehouseId,
    targetWarehouseId,
    quantity,
    transferBy,
    notes
}) => {
    if (sourceWarehouseId === targetWarehouseId) {
        return { message: 'Source and target warehouses must be different.' };
    }

    const [sourceWarehouse, targetWarehouse, product] = await Promise.all([
        Warehouse.findByPk(sourceWarehouseId),
        Warehouse.findByPk(targetWarehouseId),
        Product.findByPk(ProductID),
    ]);

    if (!product) {
        return { message: `Product does not exist.` };
    }

    if (!sourceWarehouse) {
        return {
            message: `Source warehouse does not exist.`
        };
    }

    if (!targetWarehouse) {
        return {
            message: `target Warehouse does not exist.`
        };
    }

    const t = await sequelize.transaction();

    try {
        const sourceStock = await WarehouseStock.findOne({
            where: { ProductID, LocationID: sourceWarehouseId },
            transaction: t
        });

        if (!sourceStock || sourceStock.Quantity < quantity) {
            return { message: 'Insufficient stock in the source warehouse.' };
        }

        sourceStock.Quantity -= quantity;
        await sourceStock.save({ transaction: t });

        const targetStock = await WarehouseStock.findOne({
            where: { ProductID, LocationID: targetWarehouseId },
            transaction: t
        });

        if (targetStock) {
            targetStock.Quantity += quantity;
            targetStock.LastUpdated = new Date();
            await targetStock.save({ transaction: t });
        } else {
            await WarehouseStock.create({
                ProductID,
                LocationID: targetWarehouseId, 
                Quantity: quantity,
                LastUpdated: new Date()
            }, { transaction: t });
        }

        const transferRecord = await warehousetransfers.create({
            ProductID,
            sourceWarehouseId,
            targetWarehouseId,
            quantity,
            transferBy,
            notes,
            transferDate: new Date()
        }, { transaction: t });

        await t.commit();
        return {
            success: true,
            message: 'Transfer completed successfully.',
            transfer: transferRecord
        };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

const getAllTransfers = async () => {
  const transfers = await warehousetransfers.findAll({
    include: [
      {
        model: Product,
        attributes: ['ProductID', 'Name']
      },
      {
        model: Warehouse,
        as: 'sourceWarehouse',
        attributes: ['LocationID', 'WarehouseName']
      },
      {
        model: Warehouse,
        as: 'targetWarehouse',
        attributes: ['LocationID', 'WarehouseName']
      },
    ],
    order: [['transferDate', 'DESC']]
  });

  return transfers;
};

module.exports = {
    transferStock,
    getAllTransfers
};
