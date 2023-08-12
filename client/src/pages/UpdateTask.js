import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, CardContent, TextField } from "@mui/material";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

function UpdateTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const taskSchema = yup.object().shape({
    taskName: yup.string().required("Required"),
    description: yup.string().required("Required"),
    dueDate: yup.date().required("Required"),
  });

  const [taskData, setTaskData] = useState({
    taskName: "",
    description: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState({
    taskName: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `tasks-app-server-pearl.vercel.app/api/tasks/get-task/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Convert the API response dueDate to a valid format (YYYY-MM-DD)
        const formattedDueDate = response.data.dueDate
          ? new Date(response.data.dueDate).toISOString().split("T")[0]
          : "";

        setTaskData({
          taskName: response.data.taskName,
          description: response.data.description,
          dueDate: formattedDueDate,
        });
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchTaskData();
  }, [taskId]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.patch(
        `tasks-app-server-pearl.vercel.app/api/tasks/${taskId}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/tasks"); // Redirect to the tasks page
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const validateField = async (name, value) => {
    try {
      await yup.reach(taskSchema, name).validate(value);
      setErrors({ ...errors, [name]: "" });
    } catch (error) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleInputChange = (name, value) => {
    setTaskData({ ...taskData, [name]: value });
    validateField(name, value);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "0 auto", px: 10, py: 7 }}>
      <h1>Update Task</h1>
      <CardContent>
        <form onSubmit={handleUpdate}>
          <TextField
            name="taskName"
            label="Task Name"
            fullWidth
            margin="normal"
            value={taskData.taskName}
            onChange={(e) => handleInputChange("taskName", e.target.value)}
            error={!!errors.taskName}
            helperText={errors.taskName}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={taskData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            type="date"
            name="dueDate"
            label="Due Date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={taskData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Update Task
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default UpdateTask;
