import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
  setIsAuthed: (v: boolean) => void;
};

export default function SignUp({ setIsAuthed }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", { email, password });

      localStorage.setItem("token", res.data.token);
      setIsAuthed(true); // ★ ここで state 更新

      toast.success("登録が完了しました！");
      navigate("/");
    } catch (err) {
      toast.error("登録に失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">新規登録</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          登録
        </button>

        <p
          className="text-blue-600 text-sm mt-3 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          → ログインはこちら
        </p>
      </form>
    </div>
  );
}
