'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('subProducts', {
            ID: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            serialNumber: {
                type: Sequelize.STRING(45)
            },
            soldDate: {
                allowNull: true,
                type: Sequelize.DATE
            },
            status: {
                type: Sequelize.ENUM('AVAILABLE', 'ALLOCATED', 'DEFECTED')
            },
            ProductID: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'products',
                    key: 'ProductID'
                }
            },
            WarehouseID: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'warehouselocations',
                    key: 'LocationID'
                }
            },
            isActive: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('subProducts');
    }
};