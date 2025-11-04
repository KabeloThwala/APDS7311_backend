import React from "react";
import { CreditCard, Home, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navConfig = {
  customer: [
    { label: "Overview", to: "/dashboard", icon: <Home size={18} /> },
    { label: "Payments", to: "/dashboard", icon: <CreditCard size={18} /> },
  ],
  employee: [
    { label: "Overview", to: "/employee", icon: <Home size={18} /> },
    { label: "Queue", to: "/employee", icon: <ShieldCheck size={18} /> },
  ],
  admin: [
    { label: "Overview", to: "/employee", icon: <Home size={18} /> },
    { label: "Queue", to: "/employee", icon: <ShieldCheck size={18} /> },
  ],
};

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role || "customer";
  const items = navConfig[role] || navConfig.customer;

  return (
    <aside className="w-72 bg-white/90 backdrop-blur border-r border-slate-100 min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-400">EventEase Bank</p>
          <h3 className="text-2xl font-extrabold text-bankBlue">International Suite</h3>
        </div>

        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.to)}
              className="flex items-center gap-3 w-full text-left p-3 rounded-xl transition bg-white hover:bg-bankBlue/10"
            >
              <span className="text-bankBlue">{item.icon}</span>
              <span className="font-medium text-slate-700">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500 mb-2">Signed in as</p>
        <p className="font-semibold text-slate-800">{user?.fullName}</p>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="mt-4 flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-700"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
