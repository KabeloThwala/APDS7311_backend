import React, { useEffect, useMemo, useState } from "react";

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
  pending: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  submitted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [metrics, setMetrics] = useState({ pending: 0, verified: 0, submitted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-bank-soft to-slate-100">
      <Sidebar />
      <main className="flex-1 p-10 space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Employee control room</p>
          <h1 className="text-4xl font-black text-slate-800">
            Hello {user?.fullName}, here is the international payments queue
          </h1>
          <p className="text-slate-500 max-w-2xl">
            Verify account details, confirm SWIFT codes, and dispatch cleared transfers securely to our SWIFT partner network.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-4">
          {["pending", "verified", "submitted", "rejected"].map((key) => (
            <article
              key={key}
              className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500 uppercase">{key}</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{metrics[key]}</p>
              <p className="text-xs text-slate-400">Payments marked as {key}</p>
            </article>
          ))}
        </section>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {actionMessage && <p className="text-sm text-emerald-600">{actionMessage}</p>}

        <section className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">Verification queue</h2>
              <p className="text-sm text-slate-500">Review pending customer transfers and fast-track valid instructions.</p>
            </div>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-slate-500">Loading queue...</p>
          ) : queue.length === 0 ? (
            <p className="px-6 py-8 text-slate-400">All caught up! There are no payments waiting for action.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-bankBlue text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold">Account</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold">SWIFT</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((payment) => (
                    <tr key={payment.id || payment._id} className="border-b border-slate-100 bg-white">
                      <td className="px-4 py-3 text-slate-700">{payment.userId?.fullName || "Customer"}</td>
                      <td className="px-4 py-3 text-slate-500">{payment.userId?.accountNumber || "-"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {payment.currency} {Number(payment.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{payment.provider}</td>
                      <td className="px-4 py-3 text-slate-500">{payment.swiftCode}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            statusBadge[payment.status] || "bg-slate-200 text-slate-700"
                          }`}
                        >
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
                                className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAction(payment.id || payment._id, "reject")}
                                className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {payment.status === "verified" && (
                            <button
                              type="button"
                              onClick={() => handleAction(payment.id || payment._id, "submit")}
                              className="rounded-lg bg-bankBlue px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
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
        </section>
      </main>
    </div>
  );
}
