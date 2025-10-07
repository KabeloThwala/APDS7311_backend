// src/pages/Signup.js
import React, { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      setOk("Registered successfully — please login.");
      setTimeout(() => nav("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bank-soft px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-bankBlue mb-1">Create account</h2>
        <p className="text-sm text-gray-500 mb-4">Register to start making international payments</p>

        <form onSubmit={submit} className="space-y-3">
          <input name="fullName" value={form.fullName} onChange={change} placeholder="Full name" className="w-full p-3 border rounded-lg" required />
          <input name="idNumber" value={form.idNumber} onChange={change} placeholder="ID number" className="w-full p-3 border rounded-lg" required />
          <input name="accountNumber" value={form.accountNumber} onChange={change} placeholder="Account number" className="w-full p-3 border rounded-lg" required />
          <input name="password" value={form.password} onChange={change} placeholder="Password" type="password" className="w-full p-3 border rounded-lg" required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {ok && <div className="text-green-600 text-sm">{ok}</div>}
          <button className="w-full py-3 bg-bankBlue text-white rounded-lg">Register</button>
        </form>
      </div>
    </div>
  );
}
