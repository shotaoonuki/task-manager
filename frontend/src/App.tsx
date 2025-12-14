import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import TaskList from "./components/TaskList";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [isAuthed, setIsAuthed] = React.useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 4000 }}
      />





      <Navbar
        isAuthed={isAuthed}
        setIsAuthed={setIsAuthed}
      />

      <Routes>
        <Route path="/login" element={<Login setIsAuthed={setIsAuthed} />} />
        <Route path="/signup" element={<SignUp setIsAuthed={setIsAuthed} />} />
        <Route path="/" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}
