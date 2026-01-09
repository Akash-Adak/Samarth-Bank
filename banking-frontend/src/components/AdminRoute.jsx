import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token } = useAuth();

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const username = localStorage.getItem("username");
  const role = username
    ? localStorage.getItem(`${username}-role`)
    : null;

  // Not admin OR role missing
  if (!role || !role.includes("ADMIN")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
