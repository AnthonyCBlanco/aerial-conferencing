const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/connection');

class ResetToken extends Model {}

ResetToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.CHAR
        },
        token: {
            type: DataTypes.CHAR,
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'reset_token',
    }
)
module.exports = ResetToken;