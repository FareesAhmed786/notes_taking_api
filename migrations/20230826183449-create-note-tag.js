'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('note_tag', {
            noteUid: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: false,
                references: {
                    model: {tableName: "notes"},
                    key: "id"
                }
            },
            tagUid: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: false,
                references: {
                    model: {tableName: "tags"},
                    key: "id"
                }
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
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('note_tag');
    }
};