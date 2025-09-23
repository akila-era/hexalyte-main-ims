'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('trackingNumbers', {
            ID: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            minimum: {
                type: Sequelize.INTEGER
            },
            maximum: {
                type: Sequelize.INTEGER
            },
            currentValue: {
                type: Sequelize.INTEGER
            },
            remaining: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.ENUM('ENABLE', 'DISABLED')
            },
            isActive: {
                type: Sequelize.BOOLEAN
            },
            DeliveryPartnerID: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'DeliveryPartner',
                    key: 'DeliveryPartnerID'
                }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('trackingNumbers');
    }
};