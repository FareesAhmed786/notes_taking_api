// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedGlobalSymbols

'use strict';
const {Model} = require('sequelize');
const {passwordGen, createJWTToken} = require("../utils/common.utils");
const PROTECTED_ATTR = ["password"];

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Notebook, Note, Tag,Role,Token}) {
            this.hasMany(Notebook, {as: "notebooks",foreignKey:"userUid"})
            this.hasMany(Note, {as: "notes",foreignKey:"userUid"})
            this.hasMany(Tag, {as: "tags",foreignKey:"userUid"})
            this.belongsToMany(Role, {
                as: "roles",
                through: "user_roles",
                foreignKey: "user_id",
                otherKey: "role_id",
            });

            this.hasMany(Token, {
                foreignKey: "user_id",
                as: "tokens",
            });
        }

        toJSON() {
            const attributes = {...this.get()};
            for (const a of PROTECTED_ATTR) {
                delete attributes[a];
            }
            return attributes;
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: "users",
        hooks: {
            beforeCreate: passwordGen,
            beforeUpdate: passwordGen,
        },
    });

    //Method to generate token
    User.prototype.tokenGen = async function () {
        const user = this;
        const payload = {id: user.id};
        const token = createJWTToken(payload);

        //One:Many relation with Token table
        return await user.createToken({
            token,
        });
    };
    return User;
};