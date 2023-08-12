import Task from "../models/Task.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

export const getTasks = async (req, res) => {
  const userId = req.params.id;

  try {
    const tasks = await Task.find({ userId }).populate("userId", "name email");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const getTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching task", error: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const addTask = async (req, res) => {
  try {
    const { taskName, userId, description, dueDate } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const user = User.findById(userId);
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const newTask = new Task({
      taskName,
      userId,
      description,
      dueDate,
    });

    await newTask.save();

    const tasks = await Task.find();
    res.status(201).json(tasks);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found." });

    task.isCompleted = !task.isCompleted;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found." });

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id; // Get the task ID from the URL parameters

    const { taskName, description, dueDate, isCompleted } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          taskName,
          description,
          dueDate,
          isCompleted,
        },
      },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task not found." });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//////////////////////////////////////////////////////////////////////
export const addComment = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { comment } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found." });
    }

    task.comments.push(comment);
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
