// noinspection JSCheckFunctionSignatures

const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const {verifyToken, authRole} = require("../middlewares/auth");
const {ROLE_ADMIN} = require("../utils/constants");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.put(
    "/update/:id",
    [verifyToken, authRole([ROLE_ADMIN])],
    authController.update
);

router.get("/check", [verifyToken], authController.checkAuth);

router.get("/logout", [verifyToken], authController.logout);

router.get(
    "/users",
    [verifyToken, authRole([ROLE_ADMIN])],
    authController.getUsers
);

router.delete(
    "/user/:id",
    [verifyToken, authRole([ROLE_ADMIN])],
    authController.deleteUser
);

module.exports = router;
