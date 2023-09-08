'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('tokens', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: "users",
                    },
                    key: "id",
                },
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
        await queryInterface.dropTable('tokens');
    }
};
