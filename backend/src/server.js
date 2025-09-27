import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

// middlewares
app.use(express.json()); // middleware để parse json
app.use(cors({ origin: "http://localhost:5173" })); // cho phép truy cập từ frontend

app.use("/api/tasks", taskRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server bất đầu trên cổng 5001");
  });
});
