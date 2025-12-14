import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
  isAuthed: boolean;
  setIsAuthed: (v: boolean) => void;
};

export default function Navbar({ isAuthed, setIsAuthed }: Props) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthed(false);
    toast.success("ログアウトしました");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow h-20 flex justify-between items-center px-6 z-50">
      <h1
        className="text-xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        📝 タスク管理アプリ
      </h1>

      <div className="flex gap-3">
        {!isAuthed && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold"
            >
              ログイン
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="text-green-600 font-semibold"
            >
              新規登録
            </button>
          </>
        )}

        {isAuthed && (
          <button
            onClick={logout}
            className="text-red-500 font-semibold"
          >
            ログアウト
          </button>
        )}
      </div>
    </div>
  );
}
