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

  return (
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
                </label>

                <label className="grid gap-2 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Beneficiary account number</span>
                  <input
                    name="recipientAccount"
                    value={form.recipientAccount}
                    onChange={handleChange}
                    pattern="\\d{8,20}"
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
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white placeholder:text-white/30 focus:border-bankTeal focus:outline-none focus:ring-2 focus:ring-bankTeal/40"
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-bankBlue via-bankLavender to-bankTeal px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-glow transition hover:scale-[1.01]"
                >
                  Pay now
                </button>

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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
