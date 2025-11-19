import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import TaskList from "./components/TaskList";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";

export default function App() {
  const token = localStorage.getItem("token");
  const isAuthed = !!token;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Navbar isAuthed={isAuthed} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}
