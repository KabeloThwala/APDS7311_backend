// frontend/src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(accountNumber, password);
      localStorage.setItem("token", data.token);
      setUser(data.user);

      // Redirect user based on role
      if (data.user.role === "admin") navigate("/admin-dashboard");
      else if (data.user.role === "employee") navigate("/employee-dashboard");
      else navigate("/customer-dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid account number or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bank-soft">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-bankBlue">
          Login
        </h2>

        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-6"
          required
        />

        <button className="w-full bg-bankBlue text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
