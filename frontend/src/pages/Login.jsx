import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import GlassPanel from "../components/GlassPanel";
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_55%)]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(52,211,153,0.2),transparent_60%)]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
          <GlassPanel as="section" tone="royal" className="space-y-10 p-10 md:p-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                EventEase Bank
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Welcome to your international payments cockpit
              </h1>
              <p className="max-w-xl text-sm text-slate-300 md:text-base">
                Authenticate with hardened credentials to coordinate global transfers. We enforce salted hashing, adaptive rate
                limiting, and end-to-end TLS 1.3 for every session.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {["Salted hashing & device trust", "Multi-region 99.99% uptime", "POPIA & PSD2 compliant", "24/7 SWIFT desk"].map(
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
              <h2 className="text-2xl font-semibold text-white">Sign in to continue</h2>
              <p className="text-sm text-slate-400">Enter your verified account credentials.</p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
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
                  autoComplete="username"
                  placeholder="8-12 digit account number"
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
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="Your secure password"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Access portal"}
              </button>

              <p className="text-sm text-slate-400" aria-live="assertive">
                {message && <span className="font-semibold text-bankCoral">{message}</span>}
              </p>
            </form>

            <p className="mt-8 text-sm text-slate-400">
              Need an account?{" "}
              <Link to="/signup" className="font-semibold text-bankTeal transition hover:text-bankMint">
                Register securely
              </Link>
            </p>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
