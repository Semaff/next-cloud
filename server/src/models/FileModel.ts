import { CreationOptional, ForeignKey, DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../db";

/* File Model */
export class File extends Model<InferAttributes<File>, InferCreationAttributes<File>> {
    declare id: CreationOptional<number | string>;
    declare name: string;
    declare type: string;
    declare path: string;
    declare size: CreationOptional<number>;
    declare parent: CreationOptional<number | string>; // every file has a parent, but not the root one
    declare accessLink: CreationOptional<string | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare userId: ForeignKey<number | string>;
}

File.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    path: { type: DataTypes.STRING },
    parent: { type: DataTypes.INTEGER },
    accessLink: { type: DataTypes.STRING },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: "files",
    sequelize
});