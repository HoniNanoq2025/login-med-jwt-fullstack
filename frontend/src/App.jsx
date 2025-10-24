import {
  Navigate,
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import NavBar from "./components/NavBar/NavBar";

function Layout() {
  const location = useLocation();
  const hideNavBarPaths = ["/login", "/unauthorized"];

  return (
    <>
      {!hideNavBarPaths.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "editor", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute allowedRoles={["editor", "admin"]}>
              <EditorPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
