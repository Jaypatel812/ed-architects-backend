import express from "express";
import upload from "../middlewares/upload.middleware.js";
import {
  uploadImages,
  deleteImages,
} from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/upload-images", upload.array("images", 12), uploadImages);
router.delete("/delete-images", deleteImages);

export default router;
