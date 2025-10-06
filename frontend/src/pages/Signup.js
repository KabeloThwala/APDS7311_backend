import React, { useState } from "react";
import api from "../api";

function Signup() {
  const [form, setForm] = useState({ fullname: "", idNumber: "", accountNumber: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/users/signup", form);
      setMessage("Signup successful!");
      console.log("Signup response:", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Signup failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="fullname" placeholder="Full Name" onChange={handleChange} /><br />
        <input name="idNumber" placeholder="ID Number" onChange={handleChange} /><br />
        <input name="accountNumber" placeholder="Account Number" onChange={handleChange} /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} /><br />
        <button type="submit">Signup</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}
export default Signup;
