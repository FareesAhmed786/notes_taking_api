'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, DataTypes) {
        await queryInterface.createTable('roles', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                autoGenerate: true,
                defaultType: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.ENUM("user", "admin"),
                allowNull: false,
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
        await queryInterface.dropTable('roles');
    }
};
