import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../api";

const initialState = {
  fullName: "",
  idNumber: "",
  accountNumber: "",
  password: "",
  confirmPassword: "",
};

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [feedback, setFeedback] = useState({ tone: "info", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ tone: "info", text: "" });

    if (formData.password !== formData.confirmPassword) {
      setFeedback({ tone: "error", text: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, ...payload } = formData;
      await signup(payload);
      setFormData(initialState);
      setFeedback({
        tone: "success",
        text: "Account created successfully. Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Signup failed:", err);
      const apiMessage = err?.response?.data?.message;
      setFeedback({
        tone: "error",
        text: apiMessage || "Unable to complete signup. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="grid gap-10 rounded-3xl bg-white/95 p-10 shadow-2xl shadow-slate-900/30 w-full max-w-5xl md:grid-cols-2">
        <section className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-bankBlue">EventEase Bank</p>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Create a secure profile</h1>
            <p className="mt-4 text-sm text-slate-500">
              Provide your verified personal and banking details. All information is encrypted at rest and in transit.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Security checklist</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" /> Strong, salted password hashing (bcrypt)
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" /> South African ID validation and input whitelisting
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" /> Enforced HTTPS with HSTS and clickjacking protection
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/80 p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-900">Register</h2>
          <p className="mt-2 text-sm text-slate-500">Fill in your verified banking details.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Full name</span>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                pattern="[A-Za-z\s'-]{3,60}"
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">South African ID number</span>
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                pattern="\\d{13}"
                inputMode="numeric"
                placeholder="13-digit SA ID number"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Account number</span>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                pattern="\\d{8,12}"
                inputMode="numeric"
                placeholder="Your bank account number"
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
                pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,32}"
                minLength={8}
                placeholder="Create a strong password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
              <span className="mt-1 block text-xs text-slate-400">
                Must include upper & lower case letters, a digit, and a special character.
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-600">Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                placeholder="Repeat your password"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                required
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-bankBlue py-3 font-semibold text-white shadow-lg shadow-bankBlue/30 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
            {feedback.text && (
              <p
                className={`text-sm ${
                  feedback.tone === "error" ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {feedback.text}
              </p>
            )}
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-bankBlue hover:underline">
              Log in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
