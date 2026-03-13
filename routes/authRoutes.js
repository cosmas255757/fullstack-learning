import express from "express";
import { registerUser, loginUser, getDashboardData } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ==========================================
// 2. PROTECTED ROUTES (Generic)
// ==========================================
// All logged-in users can access this; logic inside controller handles role-specific data
router.get("/dashboard-data", verifyToken, getDashboardData);

// ==========================================
// 3. ROLE-SPECIFIC ROUTES (Shared & Exclusive)
// ==========================================

// SHARED: Only SuperAdmin and Admin can access reports
router.get("/admin/reports",
    verifyToken,
    authorizeRole("superadmin", "admin"),
    (req, res) => {
        res.json({ message: "This is a shared report for Admins and SuperAdmins" });
    }
);

// EXCLUSIVE: Only SuperAdmin can reset the system
router.delete("/admin/system-reset",
    verifyToken,
    authorizeRole("superadmin"),
    (req, res) => {
        res.json({ message: "System resetting... (SuperAdmin Only)" });
    }
);

export default router;
