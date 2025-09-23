'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NewOrderItems', {
      NewOrderRowID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      NewOrderID: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: {
          model: 'NewOrder',
          key: 'NewOrderID'
        }
      },
      SubProductID: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        allowNull: false,
        references: {
          model: 'subProducts',
          key: 'ID'
        }
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      UnitPrice: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      DiscountType: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Discount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NewOrderItems');
  }
};