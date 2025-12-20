import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", verifyJWT, updateProject);
router.delete("/:id", verifyJWT, deleteProject);

export default router;
