'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewOrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NewOrderItems.belongsTo(models.NewOrder, {
        foreignKey: 'NewOrderID',
        onDelete: 'CASCADE'
      });
      NewOrderItems.belongsTo(models.subProduct, {
        foreignKey: 'SubProductID',
        targetKey: 'ID',
        onDelete: 'SET NULL'
      })
    }
  }
  NewOrderItems.init({
    NewOrderRowID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NewOrderID: {
      type: DataTypes.INTEGER,
      primaryKey: false,
      allowNull: false,
      references: {
        model: 'NewOrder',
        key: 'NewOrderID'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    SubProductID: {
      type: DataTypes.INTEGER,
      primaryKey: false,
      allowNull: false,
      references: {
        model: 'subProducts',
        key: 'ID'
      }
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UnitPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    DiscountType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Discount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'NewOrderItems',
    tableName: 'NewOrderItems',
    paranoid: true
  });
  return NewOrderItems;
};