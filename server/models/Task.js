import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  taskName: { type: String, required: true, min: 2, max: 50 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, max: 500 },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  comments: { type: [String], default: [] },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
