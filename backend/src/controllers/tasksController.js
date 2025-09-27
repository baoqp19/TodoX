import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  try {
    // const tasks = await Task.find().sort({ createdAt: -1 }); // -1 replace "asc" or "desc" sắp xếp từ dưới lên trên
    const result = await Task.aggregate([
      // { $match: query },

      // cho chạy nhiều pipeline song song trả về 1 document
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
    console.error("Lỗi khi lấy tất cả nhiệm vụ:", error);
    res.status(500).json({ message: "Lỗi khi lấy tất cả nhiệm vụ." });
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
