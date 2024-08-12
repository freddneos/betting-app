import { Router, Request } from "express";
import { SportController } from "../controllers/SportController";
import { UserController } from "../controllers/UserController";
import { EventController } from "../controllers/EventController";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

// Sport routes
router.get('/sports', SportController.getAllSports);
router.get('/sports/:sport_id/events', SportController.getEventsBySport);

// User routes
router.post('/auth/signup', UserController.createAccount);
router.post('/auth/login', UserController.login);
router.get('/my-bets', authenticateJWT, UserController.getMyBets);
router.post('/place-bet', authenticateJWT, UserController.placeBet);

// Events
router.get("/events", EventController.getAll);

export default router;
