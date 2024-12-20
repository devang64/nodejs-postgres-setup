import express from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser,
    updateUser,
} from "../controllers/userController";
import { uploadSingle } from "../middlewares/multerConfig";
const { verifyToken } = require("../middlewares/authMiddleware");
const { validateUser } = require("../middlewares/InputValidator");

const router = express.Router();

router.post("/register", validateUser, createUser);
router.get("/list", getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);
// router.post("/upload", verifyToken, uploadSingle, demoUpload);


export default router;