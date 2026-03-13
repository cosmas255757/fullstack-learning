// Combined all imports at the top
import { 
    createLoanRequest, 
    findLoansByUserId, 
    findAllLoans, 
    updateLoanStatus 
} from "../models/loanModel.js";

// ==========================================
// 1. BORROWER CONTROLLERS
// ==========================================
export const applyForLoan = async (req, res) => {
    const { amount, living_location, installment_type, loan_reason } = req.body;
    const userId = req.user.id; 
    const userRole = req.user.role;

    try {
        if (userRole !== 'borrower') {
            return res.status(403).json({
                success: false,
                message: "Only borrowers can apply for loans."
            });
        }

        const loanAmount = parseFloat(amount);
        if (loanAmount < 50000 || loanAmount > 200000) {
            return res.status(400).json({
                success: false,
                message: "Amount must be between 50,000 Tsh and 200,000 Tsh."
            });
        }

        if (!living_location || !installment_type || !loan_reason) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        await createLoanRequest(userId, loanAmount, living_location, installment_type, loan_reason);

        res.status(201).json({
            success: true,
            message: "Loan application submitted successfully! It is now pending approval."
        });

    } catch (error) {
        console.error("Loan Application Error:", error);
        res.status(500).json({ success: false, message: "Server error during loan application." });
    }
};

export const getMyLoans = async (req, res) => {
    try {
        const loans = await findLoansByUserId(req.user.id);
        res.json({ success: true, data: loans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching your loans." });
    }
};

// ==========================================
// 2. ADMIN CONTROLLERS
// ==========================================
export const getAllLoans = async (req, res) => {
    try {
        const loans = await findAllLoans();
        res.json({ success: true, data: loans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all loans." });
    }
};

export const processLoan = async (req, res) => {
    const { loanId, status } = req.body; 

    try {
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        await updateLoanStatus(loanId, status);
        res.json({ success: true, message: `Loan ${status} successfully.` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing loan." });
    }
};
