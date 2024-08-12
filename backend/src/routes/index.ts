import { Router } from "express";
import { SportController } from "../controllers/SportController";
import { UserController } from "../controllers/UserController";
import { EventController } from "../controllers/EventController";
import { authenticateJWT } from "../middlewares/auth";
import AuthController from "src/controllers/AuthController";

const router = Router();

// Sport routes
router.get('/sports', SportController.getAllSports);
router.get('/sports/:sport_id/events', SportController.getEventsBySport);

// Auth routes
router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);


// User routes
router.get('/my-bets', authenticateJWT, UserController.getMyBets);
router.post('/place-bet', authenticateJWT, UserController.placeBet);

// Events
router.get("/events", EventController.getAll);

export default router;
