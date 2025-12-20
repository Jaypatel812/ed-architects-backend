import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadImages } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload-images", upload.array("images", 12), uploadImages);

export default router;
