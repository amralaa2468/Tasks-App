import React from "react";
import { Button, Card, CardContent, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const taskSchema = yup.object().shape({
  taskName: yup.string().required("Required"),
  description: yup.string().required("Required"),
  dueDate: yup.date().required("Required"),
});

const initialValues = {
  taskName: "",
  description: "",
  dueDate: "",
};

function AddTask() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/");
        return;
      }

      const newTask = {
        ...values,
        userId,
      };

      await axios.post("tasks-app-server-pearl.vercel.app
/api/tasks", newTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Task added successfully.");
      navigate("/tasks");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "0 auto", px: 10, py: 7 }}>
      <h1>Add Task</h1>

      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={taskSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Task Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.taskName}
                name="taskName"
                error={Boolean(touched.taskName) && Boolean(errors.taskName)}
                helperText={touched.taskName && errors.taskName}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={
                  Boolean(touched.description) && Boolean(errors.description)
                }
                helperText={touched.description && errors.description}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Due Date"
                type="date"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dueDate}
                name="dueDate"
                error={Boolean(touched.dueDate) && Boolean(errors.dueDate)}
                helperText={touched.dueDate && errors.dueDate}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Button fullWidth variant="contained" type="submit">
                Add Task
              </Button>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default AddTask;
