import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Divider,
  List,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import axios from "axios";

function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showIncomplete, setShowIncomplete] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/");
    } else {
      fetchTasks(userId, token);
    }
  }, [navigate, showIncomplete]);

  const fetchTasks = async (userId, token) => {
    try {
      const response = await axios.get(
        `https://tasks-app-server-pearl.vercel.app/api/tasks/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const navigateToAddTask = () => {
    navigate("/add-task");
  };

  const toggleTaskCompletion = async (taskId, isCompleted) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `https://tasks-app-server-pearl.vercel.app/api/tasks/${taskId}`,
        {
          isCompleted: !isCompleted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://tasks-app-server-pearl.vercel.app/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addComment = async (taskId, newComment) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `https://tasks-app-server-pearl.vercel.app/api/tasks/add-comment/${taskId}`,
        {
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                comments: [...task.comments, newComment],
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleShowIncomplete = () => {
    setShowIncomplete(!showIncomplete);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ maxWidth: 800, margin: "20px auto", padding: 2 }}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" component="div" textAlign="center">
              <strong>Your Tasks</strong>
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={toggleShowIncomplete}
            >
              {showIncomplete ? "Show Incompleted Tasks" : "Show All Tasks"}
            </Button>
          </div>
          <Box textAlign="center" marginTop={2}>
            <Button variant="outlined" onClick={navigateToAddTask}>
              Add Task
            </Button>
          </Box>
          <List>
            {tasks.map((task) => {
              if (showIncomplete || !task.isCompleted) {
                return (
                  <React.Fragment key={task._id}>
                    <Card variant="outlined" sx={{ margin: "10px 0" }}>
                      <CardContent>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="h6" sx={{ mb: 1 }}>
                            {task.taskName}
                          </Typography>
                          <div>
                            <Button
                              variant="outlined"
                              onClick={() =>
                                navigate(`/update-task/${task._id}`)
                              }
                            >
                              Update
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => deleteTask(task._id)}
                              sx={{ color: "red", borderColor: "red", mx: 1 }}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <Typography sx={{ mb: 1 }}>
                          Description: {task.description}
                        </Typography>
                        <br />
                        <Typography sx={{ mb: 1 }}>
                          Due Date:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                        <br />
                        <Typography
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          Status:{" "}
                          {task.isCompleted ? "Completed" : "Not Completed"}
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={task.isCompleted}
                                onChange={() =>
                                  toggleTaskCompletion(
                                    task._id,
                                    task.isCompleted
                                  )
                                }
                                color="primary"
                              />
                            }
                          />
                        </Typography>
                        <br />
                        <Typography sx={{ mb: 1 }}>
                          Comments: {task.comments.join(", ")}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <TextField
                            value={newComment[task._id] || ""}
                            onChange={(e) =>
                              setNewComment((prevComments) => ({
                                ...prevComments,
                                [task._id]: e.target.value,
                              }))
                            }
                            placeholder="Add a new comment"
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                          <Button
                            variant="outlined"
                            onClick={() => {
                              addComment(task._id, newComment[task._id] || "");
                              setNewComment((prevComments) => ({
                                ...prevComments,
                                [task._id]: "",
                              }));
                            }}
                            sx={{
                              mx: 1,
                              fontSize: 15,
                              color: "green",
                              borderColor: "green",
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                    <Divider />
                  </React.Fragment>
                );
              }
              return null;
            })}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default Tasks;
