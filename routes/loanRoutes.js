import express from "express";
import { 
    applyForLoan, 
    getMyLoans, 
    getAllLoans, 
    processLoan 
} from "../controllers/loanController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// 1. BORROWER ROUTES
// ==========================================

// Apply for a loan
router.post(
    "/apply", 
    verifyToken, 
    authorizeRole("borrower"), 
    applyForLoan
);

// View personal loan history
router.get(
    "/my-loans", 
    verifyToken, 
    authorizeRole("borrower"), 
    getMyLoans
);

// ==========================================
// 2. ADMIN & SUPERADMIN ROUTES
// ==========================================

// View all loan applications in the system
router.get(
    "/all", 
    verifyToken, 
    authorizeRole("admin", "superadmin"), 
    getAllLoans
);

// Approve or Reject a loan
router.patch(
    "/process", 
    verifyToken, 
    authorizeRole("admin", "superadmin"), 
    processLoan
);

export default router;
