'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('NewOrder', 'CallStatus', {
      type: Sequelize.ENUM('Not Called', 'Called', 'Answered', 'No Answer', 'Busy', 'Wrong Number', 'Callback Requested'),
      allowNull: false,
      defaultValue: 'Not Called'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('NewOrder', 'CallStatus');
  }
};
