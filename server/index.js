import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

import authRoutes from "./routes/auth.js";
import tasksRoutes from "./routes/tasks.js";
import { verifyToken } from "./middleware/auth.js";

// Configurations
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", verifyToken, tasksRoutes);

// Mongoose setup
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server and Database are up and running on port: ${PORT}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
