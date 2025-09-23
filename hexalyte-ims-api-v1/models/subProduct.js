'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class subProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            subProduct.belongsTo(models.warehouselocation, { foreignKey: 'WarehouseID', targetKey: 'LocationID' })
            subProduct.belongsTo(models.product, { foreignKey: 'ProductID' })
            subProduct.hasMany(models.NewOrderItems, { foreignKey: 'SubProductID', sourceKey: 'ID' })
        }
    }
    subProduct.init({
        ID: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        serialNumber: {
            type: DataTypes.STRING(45)
        },
        soldDate: {
            allowNull: true,
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('AVAILABLE', 'ALLOCATED', 'DEFECTED')
        },
        ProductID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'products',
                key: 'ProductID'
            }
        },
        WarehouseID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'warehouselocations',
                key: 'LocationID'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'subProduct',
    });
    return subProduct;
};