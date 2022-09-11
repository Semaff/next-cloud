import { CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import sequelize from "../db";

/* User Model */
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number | string>;
    declare firstname: string;
    declare lastname: string;
    declare email: string;
    declare password: string;
    declare activationLink: string;
    declare diskSpace: CreationOptional<bigint>;
    declare usedSpace: CreationOptional<bigint>;
    declare isActivated: CreationOptional<boolean>;
    declare avatar: CreationOptional<string | null>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    diskSpace: { type: DataTypes.BIGINT, defaultValue: 1024 ** 3 * 10 },
    usedSpace: { type: DataTypes.BIGINT, defaultValue: 0 },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING },
    avatar: { type: DataTypes.STRING },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
}, {
    tableName: "users",
    sequelize
});