import { File } from "./FileModel";
import { User } from "./UserModel";

User.hasMany(File, { as: "files", foreignKey: "userId" });
File.belongsTo(User, { as: "user", foreignKey: "userId" });

export {
    File,
    User
}