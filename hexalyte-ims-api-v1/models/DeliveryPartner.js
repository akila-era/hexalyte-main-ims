'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryPartner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeliveryPartner.hasMany(models.NewOrder, {
        foreignKey: 'DeliveryPartnerID'
      });

      DeliveryPartner.hasMany(models.trackingNumber, {
        foreignKey: 'DeliveryPartnerID'
      })

    }
  }
  DeliveryPartner.init({
    DeliveryPartnerID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    DeliveryPartnerName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    isActive: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    paranoid: true,
    timestamps: true,
    modelName: 'DeliveryPartner',
    tableName: 'DeliveryPartner',
  });
  return DeliveryPartner;
};