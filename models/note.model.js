'use strict';
const {
    Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Note extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User,Notebook,Tag}) {
            // define association here
            this.belongsTo(User, {as: "user", foreignKey: "userUid"});
            this.belongsTo(Notebook, {as: "notebook", foreignKey: "notebookUid"});
            this.belongsToMany(Tag, {
                as: "tags",
                through: "NoteTag",
                foreignKey: "noteUid",
                otherKey: "tagUid",
            });
        }

        toJSON() {
            return {...this.get()};
        }
    }

    Note.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userUid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        notebookUid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Note',
        tableName: "notes",
    });
    return Note;
};