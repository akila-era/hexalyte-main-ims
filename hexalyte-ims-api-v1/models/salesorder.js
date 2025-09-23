'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class salesorder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      salesorder.hasMany(models.deliverydetails, { foreignKey: 'OrderID' })
      salesorder.hasMany(models.orderstatushistory)
      salesorder.belongsToMany(models.product, {
        through: models.salesorderdetail,
        foreignKey: 'OrderId'
      })
      salesorder.belongsTo(models.warehouselocation, { foreignKey: 'LocationID' })
      salesorder.belongsTo(models.customer, { foreignKey: "CustomerID" });
    }
  }
  salesorder.init({
    OrderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      references: {
        model: "customers",
        key: "CustomerID",
      },
    },
    OrderDate: DataTypes.DATE,
    TotalAmount: DataTypes.DECIMAL,
    Status: DataTypes.STRING,
    Discount: DataTypes.DECIMAL,
    PaymentStatus: DataTypes.ENUM('UNPAID', 'PAID'),
    DiscountID: {
        type: DataTypes.INTEGER,
        references: {
          model: 'discounts',
          key: 'DiscountID'
        }
      },
  }, {
    sequelize,
    modelName: 'salesorder',
  });
  return salesorder;
};