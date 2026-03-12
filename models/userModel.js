import db from "../config/db.js";

export const createUser = async (username, email, password, role) => {
    const [result] = await db.execute(
        "INSERT INTO users (username,email,password,role) VALUES (?,?,?,?)",
        [username, email, password, role]
    );
    return result;
};

export const findUserByEmail = async (email) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};
