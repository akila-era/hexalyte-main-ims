'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Page', {
      PageID: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PageName: {
        type: Sequelize.STRING(60),
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
    await queryInterface.dropTable('Page');
  }
};