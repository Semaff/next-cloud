const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    diskSpace: { type: DataTypes.BIGINT, defaultValue: 1024 ** 3 * 10 },
    usedSpace: { type: DataTypes.BIGINT, defaultValue: 0 },
    avatar: { type: DataTypes.STRING }
});

const File = sequelize.define("file", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    path: { type: DataTypes.STRING },
    parent: { type: DataTypes.INTEGER },
    accessLink: { type: DataTypes.STRING }
});

User.hasMany(File);
File.belongsTo(User);

module.exports = {
    User,
    File
}