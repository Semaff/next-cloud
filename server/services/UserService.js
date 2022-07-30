const jwt = require("jsonwebtoken");

class UserService {
    generateJWT(id, username) {
        return jwt.sign(
            { id, username },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )
    }
}

module.exports = new UserService();