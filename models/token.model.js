// noinspection JSUnresolvedVariable

'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User}) {
            // define association here
            this.belongsTo(User, {
                as: "user",
                foreignKey: "user_id",
            });
        }
    }

    Token.init({
        id: {
            allowNull: false,
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "tokens",
        modelName: "Token",
    });
    return Token;
};
