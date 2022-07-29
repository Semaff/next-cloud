require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const sequelize = require('./db');
const router = require('./routes/routes');
const cors = require("cors");
const path = require("path");
const ErrorHandler = require('./middlewares/ErrorHandler');

const app = express();
const PORT =  process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(ErrorHandler);

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log("Server started on Port", PORT)
        })
    } catch (err) {
        console.log(err);
    }
}

startServer();