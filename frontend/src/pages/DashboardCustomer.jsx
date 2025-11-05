// src/pages/DashboardCustomer.jsx
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Rocket } from "lucide-react";

import GlassPanel from "../components/GlassPanel";
import Sidebar from "../components/Sidebar";
import { createPayment, fetchPayments } from "../api";
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

  const amountFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

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
    pending: "bg-white/10 text-slate-200",
  };

  const metricCards = useMemo(
    () => [
      {
        label: "Queued",
        value: pendingCount,
        detail: "Awaiting bank verification",
        tone: "royal",
        icon: Clock3,
      },
      {
        label: "Verified",
        value: verifiedCount,
        detail: "Validated by compliance",
        tone: "mint",
        icon: CheckCircle2,
      },
      {
        label: "Submitted",
        value: submittedCount,
        detail: "Dispatched to SWIFT",
        tone: "aurora",
        icon: Rocket,
      },
    ],
    [pendingCount, submittedCount, verifiedCount]
  );

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <GlassPanel as="header" tone="aurora" className="px-8 py-10">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                Customer workspace
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Welcome back, <span className="bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal bg-clip-text text-transparent">{user?.fullName}</span>
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Capture and monitor international transfers with responsive insights, bank-grade security, and transparent status updates across the SWIFT journey.
              </p>
            </div>
          </GlassPanel>

          <section className="grid gap-6 md:grid-cols-3">
            {metricCards.map((card) => {
              const Icon = card.icon;
              return (
                <GlassPanel key={card.label} as="article" tone={card.tone} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-300">{card.label}</p>
                      <p className="text-4xl font-bold text-white">{card.value}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-bankMint">
                      <Icon size={22} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">{card.detail}</p>
                </GlassPanel>
              );
            })}
          </section>

          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <GlassPanel as="section" tone="mint" className="p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Capture a transfer</h2>
                  <p className="text-sm text-slate-400">All fields are validated client- and server-side to safeguard every submission.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
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
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 space-y-10 p-8 md:p-12">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="absolute -right-32 top-6 h-56 w-56 rounded-full bg-bankTeal/10 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-bankLavender/10 blur-3xl" />
          <div className="relative z-10 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
              Customer workspace
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Welcome back, <span className="bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal bg-clip-text text-transparent">{user?.fullName}</span>
            </h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Capture and monitor international transfers with a luxurious, human-centred experience. Each instruction is protected by layered verification before reaching SWIFT.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { label: "Queued", value: pendingCount, tone: "from-bankBlue/30 via-bankLavender/40 to-bankTeal/30", detail: "Awaiting employee verification" },
            { label: "Verified", value: verifiedCount, tone: "from-emerald-400/30 via-emerald-500/30 to-emerald-300/30", detail: "Validated by compliance" },
            { label: "Submitted", value: submittedCount, tone: "from-bankLavender/30 via-bankBlue/30 to-bankAmber/30", detail: "Dispatched to SWIFT" },
          ].map((card) => (
            <article
              key={card.label}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow"
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.tone} opacity-80 blur-3xl`} />
              <div className="relative z-10 space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{card.label}</p>
                <p className="text-4xl font-black">{card.value}</p>
                <p className="text-xs text-white/60">{card.detail}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
            <div className="absolute -right-24 -top-16 h-56 w-56 rounded-full bg-bankBlue/20 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-bankTeal/20 blur-3xl" />
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">Capture a transfer</h2>
                  <p className="text-sm text-white/60">Inputs are whitelisted and validated in real-time.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                  SSL secured
                </span>
              </div>

              <form className="grid gap-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Amount</span>
                    <input
                      type="number"
                      name="amount"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Currency</span>
                    <select
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  </label>
                </div>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Provider</span>
                  <select
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Beneficiary account number</span>
                  <input
                    name="recipientAccount"
                    value={form.recipientAccount}
                    onChange={handleChange}
                    pattern="\\d{8,20}"
                    title="Enter 8-20 digits"
                    placeholder="Digits only, 8-20 characters"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
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
                    title="Enter 8-11 alphanumeric characters"
                    placeholder="e.g. SBZAZAJJ"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500" htmlFor="reference">
                    Reference (optional)
                  </label>
                  <input
                    id="reference"
                    placeholder="Enter the recipient account number"
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    required
                  />
                  <span className="text-xs text-white/50">Digits only, between 8 and 20 characters.</span>
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">SWIFT code</span>
                  <input
                    name="swiftCode"
                    value={form.swiftCode}
                    onChange={handleChange}
                    pattern='[A-Za-z0-9]{8,11}'
                    placeholder="e.g. SBZAZAJJ"
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Reference (optional)</span>
                  <input
                    name="reference"
                    value={form.reference}
                    onChange={handleChange}
                    maxLength={80}
                    placeholder="Purpose of payment"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)] transition hover:translate-y-[-1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50"
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-[1.01]"
                >
                  Pay now
                </button>

                <div className="space-y-2 text-sm" aria-live="assertive">
                  {error && <p className="rounded-2xl border border-bankCoral/40 bg-bankCoral/15 px-4 py-3 text-bankCoral">{error}</p>}
                  {success && <p className="rounded-2xl border border-bankMint/40 bg-bankMint/15 px-4 py-3 text-bankMint">{success}</p>}
                </div>
              </form>
            </GlassPanel>

            <GlassPanel as="section" tone="royal" className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Payment history</h2>
                  <p className="text-sm text-slate-400">Track every instruction from capture to SWIFT submission.</p>
                {error && <p className="text-sm text-rose-300">{error}</p>}
                {success && <p className="text-sm text-emerald-300">{success}</p>}
              </form>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow">
            <div className="absolute -right-24 top-0 h-48 w-48 rounded-full bg-bankTeal/20 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <h2 className="text-2xl font-semibold">Payment history</h2>
                  <p className="text-sm text-white/60">Real-time updates as employees verify your instructions.</p>
                </div>
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                {loading ? (
                  <p className="px-6 py-8 text-slate-400">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="px-6 py-8 text-slate-500">No international payments recorded yet.</p>
                ) : (
                  <table className="min-w-full text-sm text-slate-200">
                    <thead className="sticky top-0 bg-white/10 text-xs uppercase tracking-[0.28em] text-slate-300 backdrop-blur">
                  <p className="px-6 py-8 text-white/60">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <p className="px-6 py-8 text-white/40">No international payments recorded yet.</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead className="sticky top-0 bg-white/10 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur">
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
                        <tr key={payment.id || payment._id} className="border-b border-white/5 bg-white/5">
                          <td className="px-4 py-3 font-semibold text-white">
                            {payment.currency} {amountFormatter.format(Number(payment.amount) || 0)}
                          </td>
                          <td className="px-4 py-3 text-slate-300">{payment.provider}</td>
                          <td className="px-4 py-3 text-slate-300">{payment.recipientAccount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[payment.status] || statusClasses.pending}`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {payment.createdAt ? dateFormatter.format(new Date(payment.createdAt)) : "Pending capture"}
                            {payment.currency} {Number(payment.amount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-white/70">{payment.provider}</td>
                          <td className="px-4 py-3 text-white/70">{payment.recipientAccount}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                payment.status === "submitted"
                                  ? "bg-emerald-400/20 text-emerald-200"
                                  : payment.status === "verified"
                                  ? "bg-amber-400/20 text-amber-200"
                                  : payment.status === "rejected"
                                  ? "bg-rose-400/20 text-rose-200"
                                  : "bg-white/10 text-white/80"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {payment.createdAt
                              ? new Date(payment.createdAt).toLocaleString()
                              : "Pending capture"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </GlassPanel>
          </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
