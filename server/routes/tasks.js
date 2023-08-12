import express from "express";
import { check } from "express-validator";
import {
  getTasks,
  getTask,
  addTask,
  completeTask,
  deleteTask,
  updateTask,
  addComment,
} from "../controllers/tasks.js";

const router = express.Router();

const addOrUpdateTaskValidation = [
  check("taskName", "Task name is required").not().isEmpty(),
  check(
    "taskName",
    "Task name should be atleast 2 characters or at max 5o characters"
  ).isLength({ min: 2, max: 50 }),
  check("description", "Description at max is 50 characters").isLength({
    max: 500,
  }),
  check("dueDate", "Date is required").not().isEmpty(),
];

router.get("/:id", getTasks);
router.get("/get-task/:taskId", getTask);
router.post("/", addOrUpdateTaskValidation, addTask);
router.put("/:id", completeTask);
router.delete("/:id", deleteTask);
router.patch("/:id", addOrUpdateTaskValidation, updateTask);
router.patch("/add-comment/:id", addComment);

export default router;
