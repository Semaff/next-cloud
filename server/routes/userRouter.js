const Router = require("express");
const router = new Router();
const userController = require('../controllers/userController');
const checkAuthMiddleware = require("../middlewares/checkAuthMiddleware");

router.post("/signup", userController.signup); // user registration
router.post("/signin", userController.signin); // user login
router.get("/auth", checkAuthMiddleware, userController.auth); // check user auth

router.get("/getall", checkAuthMiddleware, userController.getAll); // get all users
router.get("/getone/:id", checkAuthMiddleware, userController.getOne); // check user auth
router.put('/update/:id', checkAuthMiddleware, userController.update); // update a user
router.delete('/delete/:id', checkAuthMiddleware, userController.delete); // delete a user

module.exports = router