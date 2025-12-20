import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", verifyJWT, createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", verifyJWT, updateCategory);
router.delete("/:id", verifyJWT, deleteCategory);

export default router;
