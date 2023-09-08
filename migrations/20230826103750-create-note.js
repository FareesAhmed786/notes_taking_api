'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notes', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userUid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                references: {
                    model: {tableName: "users"},
                    key: "id"
                }
            },
            notebookUid: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: {tableName: "notebooks"},
                    key: "id"
                }
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
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
    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('notes');
    }
};
