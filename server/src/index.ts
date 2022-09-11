require("dotenv").config();
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import sequelize from './db';
import router from './routes/routes';
import errorHandlerMiddleware from './middlewares/errorHanlderMiddleware';

const app = express();
const PORT = process.env.PORT || 5000;

/* Middlewares */
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({}));
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(errorHandlerMiddleware);

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log("Server started on Port", PORT)
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();