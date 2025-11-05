import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GlassPanel from "../components/GlassPanel";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,0.24),transparent_55%)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(37,99,235,0.24),transparent_60%)]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <GlassPanel as="section" tone="aurora" className="space-y-10 p-10 md:p-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                EventEase Bank
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Create your secure international payments identity
              </h1>
              <p className="max-w-xl text-sm text-slate-300 md:text-base">
                Provide verified information to unlock seamless cross-border payments. We apply layered security, salted hashing,
                and continuous monitoring from the very first login.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["Argon2id hashing with pepper", "Regex whitelisting on every field", "TLS 1.3 with HSTS & pinning", "Continuous anomaly detection"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-200 shadow-[0_12px_30px_rgba(8,15,35,0.35)]"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </GlassPanel>

          <GlassPanel as="section" tone="mint" className="flex flex-col justify-center p-8 md:p-10">
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
                  title="Enter 3-60 alphabetic characters"
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                  title="Enter your 13-digit South African ID"
                  inputMode="numeric"
                  placeholder="13-digit SA ID number"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                  title="Enter an 8-12 digit account number"
                  inputMode="numeric"
                  placeholder="Your bank account number"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                  title="Use 8-32 characters with upper, lower, number, and special"
                  minLength={8}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </button>

              {feedback.text && (
                <p
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    feedback.tone === "error"
                      ? "border-bankCoral/40 bg-bankCoral/15 text-bankCoral"
                      : "border-bankMint/40 bg-bankMint/15 text-bankMint"
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
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
