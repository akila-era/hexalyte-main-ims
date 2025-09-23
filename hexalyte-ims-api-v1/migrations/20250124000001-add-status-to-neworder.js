'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('NewOrder', 'Status', {
      type: Sequelize.ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('NewOrder', 'Status');
  }
};
