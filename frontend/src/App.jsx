import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import DashboardCustomer from "./pages/DashboardCustomer";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "customer" ? "/dashboard" : "/employee"} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <DashboardCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["employee", "admin"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
