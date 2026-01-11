import express from "express";
import { getHomeData, updateHomeData } from "../controllers/home.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getHomeData);
router.put("/", verifyJWT, updateHomeData);

export default router;
