import Router from "express";
import fileController from '../controllers/File/FileController';
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";

const router = Router();

/* File Endpoints */
router.get("/getall/:type?", checkAuthMiddleware, fileController.getAll);
router.get("/getone/:link", fileController.getOne); // get file by it's access link
router.get("/search", checkAuthMiddleware, fileController.search); // search by query
router.get("/downloadFile/:id", fileController.download);

router.post("/createFolder", checkAuthMiddleware, fileController.createFolder);
router.post("/uploadFile", checkAuthMiddleware, fileController.uploadFile);

router.put("/share/:id", checkAuthMiddleware, fileController.share);
router.put("/removeShare/:id", checkAuthMiddleware, fileController.removeShare);

router.put('/move', checkAuthMiddleware, fileController.move); // move fileId to new parentId
router.put('/rename/:id', checkAuthMiddleware, fileController.rename); // rename file
router.delete('/delete/:id', checkAuthMiddleware, fileController.delete); // delete file and his children

export default router;