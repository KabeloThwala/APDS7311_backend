// frontend/src/components/Sidebar.js
import React from "react";
import { Home, CreditCard, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role = "customer", onLogout }) {
  const nav = useNavigate();

  const items = [
    { label: "Home", to: "/", icon: <Home size={18} /> },
    { label: "Dashboard", to: role === "customer" ? "/dashboard" : "/admin", icon: <CreditCard size={18} /> },
  ];

  if (role === "admin" || role === "employee") {
    items.push({ label: "Payments (Admin)", to: "/admin", icon: <Users size={18} /> });
  }

  return (
    <aside className="w-72 bg-white border-r min-h-screen p-6">
      <div className="mb-8">
        <h3 className="text-xl font-bold text-bankBlue">EventEase Bank</h3>
        <p className="text-sm text-gray-500">International Payments</p>
      </div>

      <nav className="space-y-2">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => nav(it.to)}
            className="flex items-center gap-3 w-full text-left p-3 rounded hover:bg-gray-50"
          >
            {it.icon}
            <span>{it.label}</span>
          </button>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            if (onLogout) onLogout();
            nav("/");
          }}
          className="flex items-center gap-3 w-full text-left p-3 rounded mt-6 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
