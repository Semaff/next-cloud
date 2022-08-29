const AppError = require("../error/AppError")

const ErrorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        console.log(err.message);
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: `${err}` });
}

module.exports = ErrorHandler;