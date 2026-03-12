import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/userModel.js";

export const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(username, email, hashedPassword, role || "borrower");

        res.json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await findUserByEmail(email);

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        // CREATE TOKEN
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            token: token,
            role: user.role,
            username: user.username
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};
