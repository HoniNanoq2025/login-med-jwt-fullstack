import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
      <Link to="/profile" className="link">
        Profil
      </Link>
      <Link to="/editor" className="link">
        Editor
      </Link>
      <Link to="/admin" className="link">
        Admin
      </Link>
      <Link to="/login" className="link">
        Log ud
      </Link>
    </nav>
  );
}
