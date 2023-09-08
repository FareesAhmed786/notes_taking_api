// noinspection JSUnresolvedVariable,JSUnresolvedFunction

'use strict';
const {Model} = require('sequelize');
const PROTECTED_ATTR = ["id"];

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User}) {
            // define association here
            this.belongsToMany(User, {
                as: "users",
                through: "user_roles",
                foreignKey: "role_id",
                otherKey: "user_id",
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

    Role.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "roles",
        modelName: "Role",
    });
    return Role;
};
