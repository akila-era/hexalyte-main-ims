'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class trackingNumber extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            trackingNumber.belongsTo(models.DeliveryPartner, { foreignKey: 'DeliveryPartnerID' })
        }
    }
    trackingNumber.init({
        ID: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        minimum: {
            type: DataTypes.INTEGER
        },
        maximum: {
            type: DataTypes.INTEGER
        },
        currentValue: {
            type: DataTypes.INTEGER
        },
        remaining: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.ENUM('ENABLE', 'DISABLED')
        },
        DeliveryPartnerID: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DeliveryPartner',
                key: 'DeliveryPartnerID'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'trackingNumber',
    });
    return trackingNumber;
};