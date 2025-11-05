// src/pages/DashboardCustomer.jsx
import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import {
  createPayment,
  fetchPayments,
} from "../api";
import { useAuth } from "../context/AuthContext";

const currencyOptions = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
  { value: "ZAR", label: "South African Rand" },
];

const providers = [
  { value: "SWIFT", label: "SWIFT" },
  { value: "TransferWise", label: "TransferWise" },
  { value: "WesternUnion", label: "Western Union" },
];

const initialFormState = {
  amount: "",
  currency: "USD",
  provider: "SWIFT",
  recipientAccount: "",
  swiftCode: "",
  reference: "",
};

export default function DashboardCustomer() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialFormState);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const data = await fetchPayments();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading payments", err);
        setError("Unable to load your payment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      const payment = await createPayment(payload);
      setPayments((prev) => [payment, ...(prev || [])]);
      setForm(initialFormState);
      setSuccess("Payment captured successfully and queued for verification.");
    } catch (err) {
      console.error("Payment creation failed", err);
      const message =
        err?.response?.data?.message || "We could not create the payment. Check your details and try again.";
      setError(message);
    }
  };

  const pendingCount = useMemo(
    () => payments.filter((p) => p.status === "pending").length,
    [payments]
  );

  const verifiedCount = useMemo(
    () => payments.filter((p) => p.status === "verified").length,
    [payments]
  );

  const submittedCount = useMemo(
    () => payments.filter((p) => p.status === "submitted").length,
    [payments]
  );

  const statusClasses = {
    submitted: "bg-bankMint/15 text-bankMint",
    verified: "bg-bankBlue/15 text-bankTeal",
    rejected: "bg-bankCoral/15 text-bankCoral",
    pending: "bg-slate-700/40 text-slate-200",
  };

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <header className="relative overflow-hidden rounded-[28px] border border-slate-800/60 bg-bankMidnight/70 px-8 py-10 shadow-panel">
            <div className="absolute -right-32 top-8 h-56 w-56 rounded-full bg-bankMint/15 blur-3xl" aria-hidden />
            <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-bankBlue/15 blur-3xl" aria-hidden />
            <div className="relative space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-800/60 bg-slate-900/60 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-400">
                Customer workspace
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal bg-clip-text text-transparent">{user?.fullName}</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Capture and monitor international transfers with responsive insights, bank-grade security, and transparent status updates across the SWIFT journey.
              </p>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Queued", value: pendingCount, tone: "from-bankBlue/30 via-bankLavender/30 to-bankTeal/30", detail: "Awaiting bank verification" },
              { label: "Verified", value: verifiedCount, tone: "from-bankMint/25 via-emerald-500/20 to-bankTeal/25", detail: "Validated by compliance" },
              { label: "Submitted", value: submittedCount, tone: "from-bankLavender/25 via-bankBlue/25 to-bankAmber/25", detail: "Dispatched to SWIFT" },
            ].map((card) => (
              <article
                key={card.label}
                className="relative overflow-hidden rounded-[26px] border border-slate-800/60 bg-slate-950/60 p-6 shadow-glow"
              >
                <div className={`pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-br ${card.tone} opacity-80 blur-3xl`} />
                <div className="relative z-10 space-y-2">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{card.label}</p>
                  <p className="text-4xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-slate-400">{card.detail}</p>
                </div>
              </article>
            ))}
          </section>

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[28px] border border-slate-800/60 bg-slate-950/70 p-8 shadow-panel">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Capture a transfer</h2>
                  <p className="text-sm text-slate-400">All fields are validated client- and server-side to safeguard every submission.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  TLS 1.3 active
                </span>
              </div>

              <form className="mt-8 grid gap-6" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="amount">
                      Amount
                    </label>
                    <input
                      id="amount"
                      type="number"
                      name="amount"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="currency">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    >
                      {currencyOptions.map((currency) => (
                        <option key={currency.value} value={currency.value} className="text-slate-900">
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="provider">
                    Provider
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  >
                    {providers.map((provider) => (
                      <option key={provider.value} value={provider.value} className="text-slate-900">
                        {provider.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="recipientAccount">
                    Beneficiary account number
                  </label>
                  <input
                    id="recipientAccount"
                    name="recipientAccount"
                    value={form.recipientAccount}
                    onChange={handleChange}
                    pattern="\\d{8,20}"
                    placeholder="Digits only, 8-20 characters"
                    className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    required
                  />
                  <span className="text-xs text-slate-500">We whitelist numeric inputs to eliminate injection attempts.</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="swiftCode">
                    SWIFT code
                  </label>
                  <input
                    id="swiftCode"
                    name="swiftCode"
                    value={form.swiftCode}
                    onChange={handleChange}
                    pattern="[A-Za-z0-9]{8,11}"
                    placeholder="e.g. SBZAZAJJ"
                    className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="reference">
                    Reference (optional)
                  </label>
                  <input
                    id="reference"
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    maxLength={80}
                    placeholder="Purpose of payment"
                    className="w-full rounded-2xl border border-slate-800/70 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50"
                >
                  Pay now
                </button>

                <div className="space-y-2 text-sm" aria-live="assertive">
                  {error && <p className="rounded-xl border border-bankCoral/30 bg-bankCoral/10 px-4 py-2 text-bankCoral">{error}</p>}
                  {success && <p className="rounded-xl border border-bankMint/30 bg-bankMint/10 px-4 py-2 text-bankMint">{success}</p>}
                </div>
              </form>
            </section>

            <section className="rounded-[28px] border border-slate-800/60 bg-slate-950/70 shadow-panel">
              <div className="flex items-center justify-between border-b border-slate-800/70 px-6 py-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Payment history</h2>
                  <p className="text-sm text-slate-400">Track every instruction from capture to SWIFT submission.</p>
                </div>
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                {loading ? (
                  <p className="px-6 py-8 text-slate-400">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="px-6 py-8 text-slate-500">No international payments recorded yet.</p>
                ) : (
                  <table className="min-w-full text-sm text-slate-200">
                    <thead className="sticky top-0 bg-slate-900/80 text-xs uppercase tracking-[0.28em] text-slate-400 backdrop-blur">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Amount</th>
                        <th className="px-4 py-3 text-left font-semibold">Provider</th>
                        <th className="px-4 py-3 text-left font-semibold">Beneficiary</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Captured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id || payment._id} className="border-b border-slate-800/60 bg-slate-900/40">
                          <td className="px-4 py-3 font-semibold text-white">
                            {payment.currency} {Number(payment.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-slate-300">{payment.provider}</td>
                          <td className="px-4 py-3 text-slate-300">{payment.recipientAccount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[payment.status] || statusClasses.pending}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "Pending capture"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
