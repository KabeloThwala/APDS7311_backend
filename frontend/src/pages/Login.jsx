import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { login as loginRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    accountNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await loginRequest(formData);
      login(response);
      const destination =
        response.user.role === "customer" ? "/dashboard" : "/employee";
      const fromState = location.state?.from?.pathname;
      navigate(fromState || destination, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      const detail = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setMessage(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="grid gap-10 rounded-3xl bg-white/95 p-10 shadow-2xl shadow-slate-900/30 w-full max-w-5xl md:grid-cols-2">
        <section className="flex flex-col justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-bankBlue">EventEase Bank</p>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Secure international payments portal</h1>
            <p className="mt-4 text-sm text-slate-500">
              Log in using your registered account number and password. Every session is encrypted end-to-end.
            </p>
          </div>
          <ul className="mt-10 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              TLS 1.3 enforced with HTTP Strict Transport Security
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Accounts protected against brute-force and hijacking attempts
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Input whitelisting prevents injection and script attacks
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Enter your secure credentials to continue.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Account number</span>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                pattern="\\d{8,12}"
                inputMode="numeric"
                autoComplete="username"
                placeholder="Your 8-12 digit account number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Password</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                autoComplete="current-password"
                placeholder="Your secure password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-bankBlue py-3 font-semibold text-white shadow-lg shadow-bankBlue/30 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Access portal"}
            </button>
            {message && <p className="text-sm text-rose-600">{message}</p>}
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Need an account?{" "}
            <Link to="/signup" className="font-semibold text-bankBlue hover:underline">
              Register securely
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
