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
    <div className="min-h-screen w-full px-4 py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-6xl gap-10 rounded-[32px] border border-white/10 bg-slate-900/60 p-10 text-white shadow-2xl shadow-black/30 backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
              EventEase Bank
            </span>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              A modern, human-centred international payments hub
            </h1>
            <p className="text-sm text-white/70 md:text-base">
              Log in with your secure credentials to orchestrate cross-border transfers. Biometric anomaly detection and TLS 1.3 keep your funds protected.
            </p>
          </div>

          <dl className="mt-10 grid gap-6 rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-white/70 md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-white/40">Security</dt>
              <dd className="mt-2 font-semibold text-white">Adaptive fraud mitigation with behaviour analytics</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-white/40">Performance</dt>
              <dd className="mt-2 font-semibold text-white">Live SWIFT status updates every 4 seconds</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-white/40">Compliance</dt>
              <dd className="mt-2 font-semibold text-white">Encrypted KYC & AML automation baked in</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.3em] text-white/40">Support</dt>
              <dd className="mt-2 font-semibold text-white">Specialist bankers available 24/7</dd>
            </div>
          </dl>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-bankLavender/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-bankTeal/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold">Sign in to continue</h2>
            <p className="mt-2 text-sm text-white/60">Enter your verified banking credentials.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Account number</span>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  pattern="\\d{8,12}"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="Your 8-12 digit account number"
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
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="Your secure password"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Access portal"}
              </button>
              {message && <p className="text-sm text-rose-300">{message}</p>}
            </form>

            <p className="mt-8 text-sm text-white/60">
              Need an account?{" "}
              <Link to="/signup" className="font-semibold text-bankTeal hover:text-bankAmber">
                Register securely
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
