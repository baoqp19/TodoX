import express from "express";
import taskRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();
console.log(__dirname);

const app = express();

// đi qua phải json and convert sang object 
app.use(express.json()); // 

if (process.env.NODE_ENV !== "development") { // trong env là production nên chạy local thì nó chạy vào 
  app.use(cors({ origin: "http://localhost:5173" })); // cho phép truy cập từ frontend{
}

app.use("/api/tasks", taskRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // phục vụ các tệp tĩnh từ thư mục dist của frontend

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html")); // trả về tệp index.html cho mọi yêu cầu không khớp với API
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("server bất đầu trên cổng 5001");
  });
});
