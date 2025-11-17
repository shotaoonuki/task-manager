import React from "react";
import TaskList from "./components/TaskList";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">CI/CD Test</h1>
      <TaskList />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
