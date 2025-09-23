'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Page extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Page.hasMany(models.NewOrder, {
                foreignKey: 'PageID'
            });
        }
    }
    Page.init({
        PageID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        PageName: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        isActive: {
            type: DataTypes.TINYINT,
            allowNull: true,
            defaultValue: 1
        }
    }, {
        sequelize,
        modelName: 'Page',
        tableName: 'Page',
        paranoid: true
    });
    return Page;
};