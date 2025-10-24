import { useLocalStorage } from "@uidotdev/usehooks";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setToken] = useLocalStorage("token", null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login succesfuld");
        setToken(data.token);

        const user = jwtDecode(data.token);
        if (user.role === "admin") navigate("/admin");
        else if (user.role === "editor") navigate("/editor");
        else navigate("/profile");
      } else toast.error(data.message || "Ugyldigt login");
    } catch (err) {
      console.error(err);
      toast.error("Noget gik galt ved login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className={styles.loginBtn}>
          {loading ? "Logger ind..." : "Log ind"}{" "}
        </button>
      </form>
      <ToastContainer position="top-center" auto-Close={2500} />
    </div>
  );
}
