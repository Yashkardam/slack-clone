import { Router } from "express";
import { listMessages, createMessage } from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.js"; 

const router = Router();
router.get("/", requireAuth, listMessages);
router.post("/", requireAuth, createMessage);

export default router;
