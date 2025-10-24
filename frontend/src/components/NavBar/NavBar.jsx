import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "react-toastify";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const [, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    toast.info("Du er nu logget ud");
    navigate("/login");
  };
  return (
    <nav className={styles.nav}>
      <Link to="/profile" className={styles.link}>
        Profil
      </Link>
      <Link to="/editor" className={styles.link}>
        Editor
      </Link>
      <Link to="/admin" className={styles.link}>
        Admin
      </Link>
      <button onClick={handleLogout} className={styles.logout}>
        Log ud
      </button>
    </nav>
  );
}
