const Router = require("express");
const router = new Router();
const userController = require('../controllers/userController');
const checkAuth = require("../middlewares/CheckAuth");

router.post("/signup", userController.signup); // user registration
router.post("/signin", userController.signin); // user login
router.get("/check", checkAuth, userController.checkAuth); // check user auth

router.get("/getall", checkAuth, userController.getAll); // get all users
router.get("/getone/:id", checkAuth, userController.getOne); // check user auth
router.put('/update/:id', checkAuth, userController.updateOne); // update a user
router.delete('/delete/:id', checkAuth, userController.deleteOne); // delete a user

module.exports = router