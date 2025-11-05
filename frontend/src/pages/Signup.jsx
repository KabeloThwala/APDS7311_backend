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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-800/60 bg-bankMidnight/70 shadow-panel backdrop-blur-xl">
        <div className="absolute -left-28 top-8 h-60 w-60 rounded-full bg-bankLavender/20 blur-3xl" aria-hidden />
        <div className="absolute -right-28 bottom-0 h-56 w-56 rounded-full bg-bankBlue/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-12 p-10 text-slate-100 md:grid-cols-[1.05fr_0.95fr] md:p-14">
          <section className="space-y-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                EventEase Bank
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Create your secure international payments identity
              </h1>
              <p className="max-w-xl text-sm text-slate-300 md:text-base">
                Provide verified information to unlock seamless cross-border payments. We apply layered security, salted hashing, and continuous monitoring from the very first login.
              </p>
            </div>

            <div className="space-y-5 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6">
              <h2 className="text-lg font-semibold text-white">Security pillars</h2>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankMint" />
                  Argon2id password hashing with pepper rotation and rate limiting
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankMint" />
                  Regex whitelisting for ID, account, and beneficiary data inputs
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankMint" />
                  Encrypted transport enforced with HSTS and certificate pinning
                </li>
              </ul>
            </div>
          </section>

          <section className="flex flex-col justify-center rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-glow">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Register for international access</h2>
              <p className="text-sm text-slate-400">Complete the secure onboarding form.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  pattern="[A-Za-z\s'-]{3,60}"
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="idNumber">
                  South African ID number
                </label>
                <input
                  id="idNumber"
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  pattern="\\d{13}"
                  inputMode="numeric"
                  placeholder="13-digit SA ID number"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="accountNumber">
                  Account number
                </label>
                <input
                  id="accountNumber"
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  pattern="\\d{8,12}"
                  inputMode="numeric"
                  placeholder="Your bank account number"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,32}"
                  minLength={8}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
                <span className="block text-xs text-slate-500">
                  Use 8-32 characters with uppercase, lowercase, number, and special character.
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Repeat your password"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>

              {feedback.text && (
                <p
                  className={`text-sm ${
                    feedback.tone === "error" ? "text-bankCoral" : "text-bankMint"
                  }`}
                  aria-live="assertive"
                >
                  {feedback.text}
                </p>
              )}
            </form>

            <p className="mt-8 text-sm text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-bankTeal transition hover:text-bankMint">
                Log in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
