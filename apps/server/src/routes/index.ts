import express from "express";
import userRoutes from "./user";
import jobRoutes from "./job";

const router = express.Router();

// Define API routes
router.use("/user", userRoutes);
router.use("/jobs", jobRoutes);

export default router;
