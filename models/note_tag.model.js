// noinspection JSUnresolvedVariable

'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NoteTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({Note, Tag}) {
            // define association here
        }

        toJSON() {
            return {...this.get()};
        }
    }

    NoteTag.init({
        noteUid: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false,
        },
        tagUid: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: false,
        }
    }, {
        sequelize,
        modelName: 'NoteTag',
        tableName: "note_tag",
    });
    NoteTag.removeAttribute("id");
    return NoteTag;
};