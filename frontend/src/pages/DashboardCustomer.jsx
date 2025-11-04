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
      const message = err?.response?.data?.message || "We could not create the payment. Check your details and try again.";
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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-bank-soft to-slate-100">
      <Sidebar />
      <main className="flex-1 p-10 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Customer workspace</p>
          <h1 className="text-4xl font-black text-slate-800">
            Welcome back, <span className="text-bankBlue">{user?.fullName}</span>
          </h1>
          <p className="text-slate-500 max-w-xl">
            Capture and track your international transfers. Every payment is secured with multi-step verification before we hand it off to SWIFT.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Queued</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{pendingCount}</p>
            <p className="text-xs text-slate-400">Awaiting employee verification</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Verified</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{verifiedCount}</p>
            <p className="text-xs text-slate-400">Validated by compliance</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <p className="text-sm text-slate-500">Submitted</p>
            <p className="mt-2 text-3xl font-bold text-bankBlue">{submittedCount}</p>
            <p className="text-xs text-slate-400">Dispatched to SWIFT</p>
          </article>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <section className="rounded-3xl bg-white shadow-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">Capture a transfer</h2>
                <p className="text-sm text-slate-500">Secure inputs with whitelisting and validation.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-bankBlue/10 px-3 py-1 text-xs font-semibold text-bankBlue">
                SSL secured
              </span>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Amount</span>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                    required
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-600">Currency</span>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Provider</span>
                <select
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                >
                  {providers.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Beneficiary account number</span>
                <input
                  name="recipientAccount"
                  value={form.recipientAccount}
                  onChange={handleChange}
                  pattern="\\d{8,20}"
                  placeholder="Enter the recipient account number"
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                  required
                />
                <span className="text-xs text-slate-400">Digits only, between 8 and 20 characters.</span>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">SWIFT code</span>
                <input
                  name="swiftCode"
                  value={form.swiftCode}
                  onChange={handleChange}
                  pattern='[A-Za-z0-9]{8,11}'
                  placeholder="e.g. SBZAZAJJ"
                  className="rounded-xl border border-slate-200 px-4 py-3 uppercase tracking-widest focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-600">Reference (optional)</span>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  maxLength={80}
                  placeholder="Purpose of payment"
                  className="rounded-xl border border-slate-200 px-4 py-3 focus:border-bankBlue focus:outline-none focus:ring-2 focus:ring-bankBlue/40"
                />
              </label>

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-bankBlue px-6 py-3 font-semibold text-white shadow-lg shadow-bankBlue/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Pay now
              </button>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
            </form>
          </section>

          <section className="rounded-3xl bg-white shadow-xl border border-slate-200 p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">Payment history</h2>
                <p className="text-sm text-slate-500">Real-time updates as employees verify your instructions.</p>
              </div>
            </div>
            <div className="max-h-[480px] overflow-y-auto">
              {loading ? (
                <p className="px-6 py-8 text-slate-500">Loading payments...</p>
              ) : payments.length === 0 ? (
                <p className="px-6 py-8 text-slate-400">No international payments recorded yet.</p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-bankBlue text-white">
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
                      <tr key={payment.id || payment._id} className="border-b border-slate-100 odd:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {payment.currency} {Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-slate-500">{payment.provider}</td>
                        <td className="px-4 py-3 text-slate-500">{payment.recipientAccount}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              payment.status === "submitted"
                                ? "bg-emerald-100 text-emerald-700"
                                : payment.status === "verified"
                                ? "bg-amber-100 text-amber-700"
                                : payment.status === "rejected"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
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
          </section>
        </div>
      </main>
    </div>
  );
}
