import jwt from "jsonwebtoken";

/**
 * Middleware to verify the JWT from the Authorization header
 */
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check if the Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    // 2. Extract the token (Assuming format: "Bearer <token>")
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the decoded user data to the request object
        req.user = decoded;

        // 5. Proceed to the next middleware or controller
        next();
    } catch (error) {
        // 6. Handle expired or tampered tokens
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
