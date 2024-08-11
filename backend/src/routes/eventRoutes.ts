import { Router } from "express";
import { EventController } from "../controllers/EventController";

const router = Router();

router.get("/events", EventController.getAll);

export default router;

