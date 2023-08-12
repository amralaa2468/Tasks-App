import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name at max is 50 characters"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(5, "Password must be at least 5 characters"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(5, "Password must be at least 5 characters"),
});

const initialValuesRegister = {
  name: "",
  email: "",
  password: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

function Auth() {
  const navigate = useNavigate();
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      const savedUserResponse = await axios.post(
        "https://tasks-app-server-pearl.vercel.app/api/auth/register",
        values
      );

      if (savedUserResponse.status === 201) {
        toast.success("Signed Up Successfully, Please Login.");
        onSubmitProps.resetForm();
        setPageType("login");
      }
    } catch (error) {
      console.error("Error registering:", error);
      // Handle any error messages here
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await axios.post(
        "https://tasks-app-server-pearl.vercel.app/api/auth/login",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const loggedIn = loggedInResponse.data;
      //console.log(loggedIn);

      localStorage.setItem("token", loggedIn.token);
      localStorage.setItem("userId", loggedIn.user._id);

      onSubmitProps.resetForm();

      if (loggedIn) {
        toast.success("Logged In Successfully.");
        navigate("/tasks");
      }
    } catch (error) {
      toast.error("Invalid email or password.");
      console.error("Error logging in:", error);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "0 auto", px: 10, py: 7 }}>
      {isLogin ? <h1>Login</h1> : <h1>Register</h1>}

      <CardContent>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {isRegister && (
                  <TextField
                    label="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={Boolean(touched.name) && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                )}

                <TextField
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={Boolean(touched.email) && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <Button fullWidth variant="contained" type="submit">
                  {isLogin ? "LOGIN" : "REGISTER"}
                </Button>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}

export default Auth;
