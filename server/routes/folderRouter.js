const Router = require("express");
const router = new Router();
const folderController = require('../controllers/folderController');
const checkAuth = require("../middlewares/CheckAuth");

/* Directories Endpoints */
router.get("/getall", checkAuth, folderController.getAll);

router.post("/create", checkAuth, folderController.createDir);
router.delete("/delete", checkAuth, folderController.deleteDir);

module.exports = router