import React from "react";
import TaskList from "./components/TaskList";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <TaskList />
    </div>
  );
}

