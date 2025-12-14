import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
  setIsAuthed: (v: boolean) => void;
};


export default function Login({ setIsAuthed }: Props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      setIsAuthed(true);           // ★ 追加
      toast.success("ログイン成功！");
      navigate("/");              // ★ window.location.href を使わない

    } catch (err) {
      toast.error("ログインに失敗しました");
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4">ログイン</h2>

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
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          ログイン
        </button>

        <p
          className="text-blue-600 text-sm mt-3 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          → 初めての方はこちら（新規登録）
        </p>

      </form>
    </div>
  );
}
