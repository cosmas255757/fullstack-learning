import db from "../config/db.js";

/**
 * Saves a new loan application including the reason
 */
export const createLoanRequest = async (userId, amount, location, type, reason) => {
    const [result] = await db.execute(
        "INSERT INTO loans (user_id, amount, living_location, installment_type, loan_reason) VALUES (?, ?, ?, ?, ?)",
        [userId, amount, location, type, reason]
    );
    return result;
};

/**
 * Fetches loans for a specific borrower
 */
export const findLoansByUserId = async (userId) => {
    const [rows] = await db.execute(
        "SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
    );
    return rows;
};

/**
 * Fetches all loans in the system for Admin/SuperAdmin
 */
export const findAllLoans = async () => {
    const [rows] = await db.execute(
        `SELECT loans.*, users.username 
         FROM loans 
         JOIN users ON loans.user_id = users.id 
         ORDER BY loans.created_at DESC`
    );
    return rows;
};

/**
 * Updates a loan status (approved/rejected)
 */
export const updateLoanStatus = async (loanId, status) => {
    const [result] = await db.execute(
        "UPDATE loans SET status = ? WHERE id = ?",
        [status, loanId]
    );
    return result;
};
