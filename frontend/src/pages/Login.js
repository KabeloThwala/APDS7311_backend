import React, { useState } from "react";
import api from "../api";

function Login() {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Login successful! Token saved.");
      console.log("Token:", res.data.token);
    } catch (err) {
      console.error(err);
      setMessage("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="accountNumber" placeholder="Account Number" onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
        <button type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}
export default Login;
