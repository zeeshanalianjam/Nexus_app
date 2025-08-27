import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // expired
    } catch {
      return true;
    }
  };

  if (!accessToken || isTokenExpired(accessToken)) {
     localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;