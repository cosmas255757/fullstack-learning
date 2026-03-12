import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/dashboard", verifyToken, (req, res) => {

    res.json({
        message: "Welcome to protected dashboard",
        user: req.user
    });

});

export default router;
