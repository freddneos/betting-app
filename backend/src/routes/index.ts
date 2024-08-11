import { Router } from "express";
import eventRoutes from "./eventRoutes";

const router = Router();

router.use("/api", eventRoutes);

export default router;

