import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function DashboardAdmin() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 Load JWT for secure requests
  const token = localStorage.getItem("token");
  const api = axios.create({
    baseURL: "https://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // 📦 Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/admin/payments");
        setPayments(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // 🛠️ Update payment status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/payments/${id}`, { status: newStatus });
      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-bankBlue mb-6">Employee Dashboard</h1>

        {loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-500">No payments found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-bankBlue text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Account</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Currency</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="py-3 px-4">{p.user?.fullName || "Unknown"}</td>
                    <td className="py-3 px-4">{p.user?.accountNumber || "N/A"}</td>
                    <td className="py-3 px-4">${p.amount}</td>
                    <td className="py-3 px-4">{p.currency}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          p.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : p.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      {p.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(p._id, "Processed")}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                          >
                            Process
                          </button>
                          <button
                            onClick={() => updateStatus(p._id, "Rejected")}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {p.status === "Processed" && (
                        <button
                          onClick={() => updateStatus(p._id, "Completed")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
