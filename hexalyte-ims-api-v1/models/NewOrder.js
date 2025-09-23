'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewOrder.belongsTo(models.Page, {
        foreignKey: 'PageID',
        onDelete: 'SET NULL'
      });
      NewOrder.belongsTo(models.OrderSource, {
        foreignKey: 'OrderSourceID',
        onDelete: 'SET NULL'
      });
      NewOrder.belongsTo(models.DeliveryPartner, {
        foreignKey: 'DeliveryPartnerID',
        onDelete: 'SET NULL'
      });
      NewOrder.hasMany(models.NewOrderItems, {
        foreignKey: 'NewOrderID',
        sourceKey: 'NewOrderID'
      });
    }
  }
  NewOrder.init({
    NewOrderID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    PaymentMode: {
      type: DataTypes.ENUM('COD', 'Card', 'Bank Transfer'),
      allowNull: true
    },
    CustomerName: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    OrderReference: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CustomerAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    OrderDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PrimaryPhone: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    SecondaryPhone: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CityName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    District: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    DeliveryFee: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    PageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Page',
        key: 'PageID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    OrderSourceID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'OrderSource',
        key: 'OrderSourceID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    DeliveryPartnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DeliveryPartner',
        key: 'DeliveryPartnerID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    TrackingNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'NewOrder',
    tableName: 'NewOrder',
    paranoid: true
  });
  return NewOrder;
};