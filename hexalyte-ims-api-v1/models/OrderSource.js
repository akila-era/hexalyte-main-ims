'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class OrderSource extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            OrderSource.hasMany(models.NewOrder, {
                foreignKey: 'OrderSourceID'
            });
        }
    }
    OrderSource.init({
        OrderSourceID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        OrderSourceName: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        isActive: {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'OrderSource',
        tableName: 'OrderSource',
        paranoid: true
    });
    return OrderSource;
};