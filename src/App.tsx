import React from "react";
import TaskList from "./components/TaskList";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <TaskList />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
