'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('user_roles', {
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: "users",
                    },
                    key: "id",
                },
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: "roles",
                    },
                    key: "id",
                },
                primaryKey: true,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        });
    },
    async down(queryInterface, _DataTypes) {
        await queryInterface.dropTable('user_roles');
    }
};