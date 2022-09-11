import Router from "express";
import userController from '../controllers/User/UserController';
import checkAuthMiddleware from "../middlewares/checkAuthMiddleware";
import { body } from "express-validator";

const router = Router();

router.post("/signup",
    body("firstname").exists(),
    body("lastname").exists(),
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 30 }),
    userController.signup
);
router.post("/signin",
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 30 }),
    userController.signin
);
router.get("/auth", checkAuthMiddleware, userController.auth); // authentificate with user's token
router.get("/logout", userController.logout);

router.get("/getall", checkAuthMiddleware, userController.getAll); // get all users
router.get("/getone/:id", checkAuthMiddleware, userController.getOne); // get user by id

router.get("/activate/:link", userController.activate); // activate user's email
router.put('/changePassword', checkAuthMiddleware, userController.changePassword); // change user's password
router.put('/uploadAvatar', checkAuthMiddleware, userController.uploadAvatar);
router.put('/deleteAvatar', checkAuthMiddleware, userController.deleteAvatar);

router.delete('/delete', checkAuthMiddleware, userController.delete); // delete user and his files

export default router;