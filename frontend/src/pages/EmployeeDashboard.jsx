import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Rocket, ShieldAlert } from "lucide-react";

import GlassPanel from "../components/GlassPanel";
import Sidebar from "../components/Sidebar";
import {
  fetchAdminMetrics,
  fetchPayments,
  rejectPayment,
  submitPayment,
  verifyPayment,
} from "../api";
import { useAuth } from "../context/AuthContext";

const statusBadge = {
  pending: "bg-slate-700/40 text-slate-200",
  verified: "bg-bankBlue/20 text-bankTeal",
  submitted: "bg-bankMint/15 text-bankMint",
  rejected: "bg-bankCoral/15 text-bankCoral",
  pending: "bg-amber-400/20 text-amber-200",
  verified: "bg-bankBlue/20 text-bankTeal",
  submitted: "bg-emerald-400/20 text-emerald-200",
  rejected: "bg-rose-400/20 text-rose-200",
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [metrics, setMetrics] = useState({ pending: 0, verified: 0, submitted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

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

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [paymentsResponse, metricsResponse] = await Promise.all([
        fetchPayments(),
        fetchAdminMetrics(),
      ]);
      setPayments(paymentsResponse);
      setMetrics(
        metricsResponse?.metrics || {
          pending: 0,
          verified: 0,
          submitted: 0,
          rejected: 0,
        }
      );
    } catch (err) {
      console.error("Failed to load employee data", err);
      setError("Unable to load the verification queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const queue = useMemo(
    () =>
      payments
        .filter((payment) => payment.status !== "submitted")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [payments]
  );

  const handleAction = async (id, action) => {
    try {
      if (action === "verify") await verifyPayment(id);
      if (action === "submit") await submitPayment(id);
      if (action === "reject") await rejectPayment(id);
      await loadData();
      setError("");
      setActionMessage(
        action === "verify"
          ? "Payment marked as verified."
          : action === "submit"
          ? "Payment submitted to SWIFT."
          : "Payment rejected and customer notified."
      );
    } catch (err) {
      console.error(`Failed to ${action} payment`, err);
      const message =
        err?.response?.data?.message || `Could not ${action} this payment. Please retry.`;
      setError(message);
      setActionMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-6 py-10 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <GlassPanel as="header" tone="aurora" className="px-8 py-10">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-300">
                Employee control room
              </p>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Hello {user?.fullName}, manage the international payments pipeline
              </h1>
              <p className="max-w-2xl text-sm text-slate-300 md:text-base">
                Review queued payments, verify beneficiary details, and coordinate SWIFT submissions with confidence backed by audit trails.
              </p>
            </div>
          </GlassPanel>

          <section className="grid gap-6 md:grid-cols-4">
            {[
              { key: "pending", label: "Pending", icon: Clock3 },
              { key: "verified", label: "Verified", icon: CheckCircle2 },
              { key: "submitted", label: "Submitted", icon: Rocket },
              { key: "rejected", label: "Rejected", icon: ShieldAlert },
            ].map(({ key, label, icon: Icon }) => {
              const toneMap = { pending: "royal", verified: "mint", submitted: "aurora", rejected: "coral" };
              return (
                <GlassPanel key={key} as="article" tone={toneMap[key]} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.32em] text-slate-300">{label}</p>
                      <p className="text-4xl font-bold text-white">{metrics[key]}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-bankMint">
                      <Icon size={22} />
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-slate-400">Payments marked as {label.toLowerCase()}.</p>
                </GlassPanel>
              );
            })}
          </section>

          <div className="space-y-2 text-sm" aria-live="assertive">
            {error && <p className="rounded-2xl border border-bankCoral/40 bg-bankCoral/15 px-4 py-3 text-bankCoral">{error}</p>}
            {actionMessage && <p className="rounded-2xl border border-bankMint/40 bg-bankMint/15 px-4 py-3 text-bankMint">{actionMessage}</p>}
          </div>

          <GlassPanel as="section" tone="royal" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold text-white">Verification queue</h2>
                <p className="text-sm text-slate-400">Validate customer submissions and dispatch trusted payments to SWIFT.</p>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-300 lg:inline-flex">
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 space-y-10 p-8 md:p-12">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
          <div className="absolute -right-28 top-8 h-56 w-56 rounded-full bg-bankBlue/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-bankTeal/20 blur-3xl" />
          <div className="relative z-10 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-white/70">
              Employee control room
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Hello {user?.fullName}, orchestrate the international payments queue
            </h1>
            <p className="max-w-2xl text-sm text-white/70 md:text-base">
              Review pending instructions, verify compliance, and dispatch cleared transfers securely to our SWIFT partner network.
            </p>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          {Object.entries(metrics).map(([key, value]) => (
            <article
              key={key}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-white/10 to-white/5 blur-2xl" />
              <div className="relative z-10 space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{key}</p>
                <p className="text-4xl font-black">{value}</p>
                <p className="text-xs text-white/60">Payments marked as {key}</p>
              </div>
            </article>
          ))}
        </section>

        {error && <p className="text-sm text-rose-300">{error}</p>}
        {actionMessage && <p className="text-sm text-emerald-300">{actionMessage}</p>}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow">
          <div className="absolute -right-24 top-0 h-48 w-48 rounded-full bg-bankLavender/20 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold">Verification queue</h2>
                <p className="text-sm text-white/60">Review pending customer transfers and fast-track valid instructions.</p>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/60 lg:inline-flex">
                Live sync
              </span>
            </div>

            {loading ? (
              <p className="px-6 py-8 text-slate-400">Loading queue...</p>
            ) : queue.length === 0 ? (
              <p className="px-6 py-8 text-slate-500">All caught up! There are no payments waiting for action.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-slate-200">
                  <thead className="bg-white/10 text-xs uppercase tracking-[0.28em] text-slate-300 backdrop-blur">
              <p className="px-6 py-8 text-white/60">Loading queue...</p>
            ) : queue.length === 0 ? (
              <p className="px-6 py-8 text-white/40">All caught up! There are no payments waiting for action.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/10 text-xs uppercase tracking-[0.3em] text-white/70 backdrop-blur">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Customer</th>
                      <th className="px-4 py-3 text-left font-semibold">Account</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Provider</th>
                      <th className="px-4 py-3 text-left font-semibold">SWIFT</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Captured</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((payment) => (
                      <tr key={payment.id || payment._id} className="border-b border-white/5 bg-white/5">
                        <td className="px-4 py-3 text-white">{payment.userId?.fullName || "Customer"}</td>
                        <td className="px-4 py-3 text-slate-300">{payment.userId?.accountNumber || "-"}</td>
                        <td className="px-4 py-3 font-semibold text-white">
                          {payment.currency} {amountFormatter.format(Number(payment.amount) || 0)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{payment.provider}</td>
                        <td className="px-4 py-3 text-slate-300">{payment.swiftCode}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[payment.status] || statusBadge.pending}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {payment.createdAt ? dateFormatter.format(new Date(payment.createdAt)) : "Pending capture"}
                        </td>
                        <td className="px-4 py-3 text-white/70">{payment.userId?.accountNumber || "-"}</td>
                        <td className="px-4 py-3 font-semibold text-white">
                          {payment.currency} {Number(payment.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-white/70">{payment.provider}</td>
                        <td className="px-4 py-3 text-white/70">{payment.swiftCode}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[payment.status] || "bg-white/10 text-white/80"}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {payment.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAction(payment.id || payment._id, "verify")}
                                  className="rounded-xl border border-bankMint/40 bg-bankMint/15 px-3 py-2 text-xs font-semibold text-bankMint transition hover:border-bankMint/60 hover:bg-bankMint/20"
                                  className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-200 hover:bg-emerald-500/30"
                                >
                                  Verify
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAction(payment.id || payment._id, "reject")}
                                  className="rounded-xl border border-bankCoral/40 bg-bankCoral/15 px-3 py-2 text-xs font-semibold text-bankCoral transition hover:border-bankCoral/60 hover:bg-bankCoral/20"
                                  className="rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-200 hover:bg-rose-500/30"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {payment.status === "verified" && (
                              <button
                                type="button"
                                onClick={() => handleAction(payment.id || payment._id, "submit")}
                                className="rounded-xl border border-bankBlue/40 bg-bankBlue/30 px-3 py-2 text-xs font-semibold text-white transition hover:border-bankTeal/60 hover:bg-bankBlue/40"
                                className="rounded-lg border border-bankBlue/40 bg-bankBlue/30 px-3 py-2 text-xs font-semibold text-white transition hover:border-bankTeal hover:bg-bankBlue/40"
                              >
                                Submit to SWIFT
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </div>
          </div>
        </section>
      </main>
    </div>
  );
}
