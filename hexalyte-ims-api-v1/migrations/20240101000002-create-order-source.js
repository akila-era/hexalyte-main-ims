'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderSource', {
      OrderSourceID: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      OrderSourceName: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      isActive: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: 1
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
    await queryInterface.dropTable('OrderSource');
  }
};