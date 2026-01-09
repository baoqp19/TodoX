import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ); // 2025-08-24 00:00
      break;
    }
    case "week": {
      const mondayDate =
        now.getDate() -
        (now.getDay() - 1) -
        (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        mondayDate
      );
      break;
    }
    case "month": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};
  console.log("filter:", filter);
  console.log("query:", query);

  try {
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [
            { $match: { status: "active" } },
            { $count: "count" },
          ],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi tạo nhiệm vụ:", error);
    res.status(500).json({ message: "Lỗi khi tạo nhiệm vụ." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, status, completed },
      { new: true } // trả về bản mới sau update
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Nhiệm vụ không tìm thấy." });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi cập nhật nhiệm vụ:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật nhiệm vụ." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Nhiệm vụ không tìm thấy." });
    }
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi khi xóa nhiệm vụ:", error);
    res.status(500).json({ message: "Lỗi khi xóa nhiệm vụ." });
  }
};
