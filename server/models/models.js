const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING }
});

const Folder = sequelize.define("folder", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, defaultValue: "folder" }
})

const File = sequelize.define("file", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    path: { type: DataTypes.STRING, defaultValue: '' },
    cover: { type: DataTypes.STRING, defaultValue: "placeholder.png" },
    accessLink: { type: DataTypes.STRING }
});

User.hasMany(Folder);
Folder.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

Folder.hasMany(Folder, { foreignKey: { allowNull: true } });
Folder.belongsTo(Folder);

Folder.hasMany(File);
File.belongsTo(Folder);

module.exports = {
    User,
    Folder,
    File
}