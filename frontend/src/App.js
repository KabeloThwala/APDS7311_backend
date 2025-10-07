// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardCustomer from "./pages/DashboardCustomer";
import DashboardAdmin from "./pages/DashboardAdmin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardCustomer />} />
      <Route path="/admin" element={<DashboardAdmin />} />
    </Routes>
  );
}
