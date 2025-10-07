// src/pages/DashboardCustomer.js
import React, { useState, useEffect } from "react";
import api, { setAuthToken } from "../api";
import Sidebar from "../components/Sidebar";

export default function DashboardCustomer() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    recipientAccount: "",
    swiftCode: "",
    reference: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  if (token) setAuthToken(token);

  // Load existing payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Handle input changes
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Submit new payment
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/payments", form);
      setPayments((prev) => [...prev, res.data]);
      setForm({
        amount: "",
        currency: "USD",
        recipientAccount: "",
        swiftCode: "",
        reference: "",
      });
      alert("✅ Payment created successfully!");
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Failed to create payment. Ensure all fields are filled.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-bank-soft to-gray-100 text-gray-800">
      <Sidebar role="customer" />
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-extrabold text-bankBlue mb-8 tracking-tight">
          Customer Dashboard
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* ---------- New Payment Form ---------- */}
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              💸 New Payment
            </h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Amount
                </label>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={change}
                  placeholder="Enter amount"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bankBlue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={change}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bankBlue outline-none"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>ZAR</option>
                  <option>GBP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Recipient Account
                </label>
                <input
                  name="recipientAccount"
                  value={form.recipientAccount}
                  onChange={change}
                  placeholder="e.g. 1234567890"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bankBlue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  SWIFT Code
                </label>
                <input
                  name="swiftCode"
                  value={form.swiftCode}
                  onChange={change}
                  placeholder="e.g. ABCDEF12"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bankBlue outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Reference (Optional)
                </label>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={change}
                  placeholder="e.g. Tuition Payment"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-bankBlue outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-bankBlue text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Send Payment
              </button>
            </form>
          </div>

          {/* ---------- Payment History ---------- */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📜 Payment History
            </h2>
            {loading ? (
              <p className="text-gray-500">Loading payments...</p>
            ) : payments.length === 0 ? (
              <p className="text-gray-500 italic">
                You haven’t made any payments yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-bankBlue text-white">
                    <tr>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Currency</th>
                      <th className="p-3 text-left">Recipient</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3">${p.amount}</td>
                        <td className="p-3">{p.currency}</td>
                        <td className="p-3">{p.recipientAccount}</td>
                        <td
                          className={`p-3 font-medium ${
                            p.status === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {p.status}
                        </td>
                        <td className="p-3">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
