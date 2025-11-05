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
    <div className="min-h-screen w-full px-4 py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 rounded-[32px] border border-white/10 bg-slate-900/60 p-10 text-white shadow-2xl shadow-black/30 backdrop-blur-xl md:grid-cols-[1fr_1fr]">
        <section className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
              EventEase Bank
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Create a beautiful, secure profile in minutes
            </h1>
            <p className="text-sm text-white/70 md:text-base">
              Provide your verified personal and banking details to unlock streamlined cross-border payments. We harden your account from the moment you sign up.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Why clients trust EventEase</h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankTeal" />
                Strong, salted password hashing with adaptive rate limiting
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankTeal" />
                Instant ID number validation and device fingerprinting
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-bankTeal" />
                End-to-end encryption with global compliance coverage
              </li>
            </ul>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-bankLavender/20 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-bankBlue/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold">Register for international access</h2>
            <p className="mt-2 text-sm text-white/60">Complete your secure EventEase profile.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Full name</span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  pattern="[A-Za-z\s'-]{3,60}"
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">South African ID number</span>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  pattern="\\d{13}"
                  inputMode="numeric"
                  placeholder="13-digit SA ID number"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Account number</span>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  pattern="\\d{8,12}"
                  inputMode="numeric"
                  placeholder="Your bank account number"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,32}"
                  minLength={8}
                  placeholder="Create a strong password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
                <span className="mt-1 block text-xs text-white/40">
                  Must include upper & lower case letters, a digit, and a special character.
                </span>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={8}
                  placeholder="Repeat your password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>
              {feedback.text && (
                <p
                  className={`text-sm ${
                    feedback.tone === "error" ? "text-rose-300" : "text-emerald-300"
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </form>

            <p className="mt-8 text-sm text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-bankTeal hover:text-bankAmber">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
