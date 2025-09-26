import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatusAndFilters from "@/components/StatusAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
        }}
      />
      {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto ">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Header Component  */}
          <Header />
          {/* AddTask Component  */}
          <AddTask />
          {/* thống kê và Bộ lọc  */}
          <StatusAndFilters />
          {/* TaskList Component  */}
          <TaskList />
          {/* Phân trang  */}
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <TaskListPagination />
            <DateTimeFilter />
          </div>
          {/* Footer Component  */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
