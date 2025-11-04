import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "customer" ? "/dashboard" : "/employee";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
