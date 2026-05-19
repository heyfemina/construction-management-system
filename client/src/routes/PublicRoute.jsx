import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  return !isAuthenticated ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}

export default PublicRoute;
