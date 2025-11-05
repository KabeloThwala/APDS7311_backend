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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-800/60 bg-bankMidnight/70 shadow-panel backdrop-blur-xl">
        <div className="absolute -left-32 top-10 h-60 w-60 rounded-full bg-bankBlue/20 blur-3xl" aria-hidden />
        <div className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-bankMint/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-12 p-10 text-slate-100 md:grid-cols-[1.05fr_0.95fr] md:p-14">
          <section className="space-y-10">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/70 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                EventEase Bank
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Welcome to your international payments cockpit
              </h1>
              <p className="max-w-xl text-sm text-slate-300 md:text-base">
                Authenticate with your secure credentials to coordinate global transfers. All interactions are encrypted with TLS 1.3 and monitored by adaptive fraud analytics.
              </p>
            </div>

            <dl className="grid gap-5 rounded-3xl border border-slate-800/70 bg-slate-900/60 p-6 text-sm text-slate-300 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Security posture</dt>
                <dd className="mt-2 font-semibold text-white">Salted hashing, device trust scoring, and SSO support</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Availability</dt>
                <dd className="mt-2 font-semibold text-white">Resilient multi-region platform with 99.99% uptime</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Compliance</dt>
                <dd className="mt-2 font-semibold text-white">Aligned with POPIA, PSD2, PCI DSS &amp; ISO 27001</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.28em] text-slate-500">Support</dt>
                <dd className="mt-2 font-semibold text-white">24/7 specialists with escalation direct to SWIFT desk</dd>
              </div>
            </dl>
          </section>

          <section className="flex flex-col justify-center rounded-3xl border border-slate-800/70 bg-slate-950/70 p-8 shadow-glow">
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
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="8-12 digit account number"
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
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="Your secure password"
                  className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50 disabled:cursor-not-allowed disabled:opacity-60"
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
          </section>
        </div>
      </div>
    </div>
  );
}
