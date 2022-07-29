const Router = require("express");
const router = new Router();
const fileController = require('../controllers/fileController');
const checkAuth = require("../middlewares/CheckAuth");

router.get("/getall", checkAuth, fileController.getAll);
router.get("/getone/:id", checkAuth, fileController.getOne);

router.post("/create", checkAuth, fileController.create);
router.put('/update/:id', checkAuth, fileController.updateOne);
router.delete('/delete/:id', checkAuth, fileController.deleteOne);

module.exports = router