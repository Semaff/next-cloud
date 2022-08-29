const Router = require("express");
const router = new Router();
const fileController = require('../controllers/fileController');
const checkAuthMiddleware = require("../middlewares/checkAuthMiddleware");

/* File Endpoints */
router.get("/getall", checkAuthMiddleware, fileController.getAll);
router.get("/getone/:id", checkAuthMiddleware, fileController.getOne);

router.post("/createFolder", checkAuthMiddleware, fileController.createFolder);
router.post("/uploadFile", checkAuthMiddleware, fileController.uploadFile);
router.put('/update/:id', checkAuthMiddleware, fileController.update);
router.delete('/delete/:id', checkAuthMiddleware, fileController.delete);

module.exports = router