'use strict';
const {
    Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
    class Tag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({User,Note}) {
            // define association here
            this.belongsTo(User, {as: "user", foreignKey: "userUid"});
            this.belongsToMany(Note, {
                as: "notes",
                through: "NoteTag",
                foreignKey: "tagUid",
                otherKey: "noteUid",
            });
        }

        toJSON() {
            return {...this.get()};
        }
    }

    Tag.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userUid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Tag',
        tableName: "tags",
    });
    return Tag;
};