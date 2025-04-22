import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function RequireAdmin() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default RequireAdmin;