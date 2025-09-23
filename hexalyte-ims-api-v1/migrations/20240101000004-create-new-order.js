'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NewOrder', {
      NewOrderID: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PaymentMode: {
        type: Sequelize.ENUM('COD', 'Card', 'Bank Transfer'),
        allowNull: true
      },
      CustomerName: {
        type: Sequelize.STRING(60),
        allowNull: true
      },
      OrderReference: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      CustomerAddress: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      OrderDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      PrimaryPhone: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      SecondaryPhone: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      CityName: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      District: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      DeliveryFee: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      Remark: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      PageID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Page',
          key: 'PageID'
        }
      },
      OrderSourceID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'OrderSource',
          key: 'OrderSourceID'
        }
      },
      DeliveryPartnerID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'DeliveryPartner',
          key: 'DeliveryPartnerID'
        }
      },
      TrackingNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('NewOrder');
  }
};