import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js"; // Import the new routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static("public"));

// routes
app.use("/api", authRoutes);
app.use("/api/loans", loanRoutes); 

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
