import React from "react";
import { CreditCard, Home, LogOut, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const { user, logout } = useAuth();
  const role = user?.role || "customer";
  const items = navConfig[role] || navConfig.customer;

  return (
    <aside className="relative w-72 border-r border-white/10 bg-slate-900/60 backdrop-blur-xl min-h-screen p-8 flex flex-col justify-between text-white">
      <div className="space-y-8">
        <div className="rounded-2xl bg-gradient-to-br from-bankBlue/80 via-bankLavender/80 to-bankTeal/80 p-[1px] shadow-glow">
          <div className="rounded-[calc(theme(borderRadius.2xl)-1px)] bg-slate-950/90 px-5 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">EventEase</p>
            <h3 className="mt-3 text-2xl font-bold text-white">Global Payments Suite</h3>
            <p className="mt-2 text-xs text-slate-400">Secure, intuitive tools for cross-border banking.</p>
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.to)}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-white/15 text-white shadow-lg shadow-bankBlue/20"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                    isActive
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 bg-white/5 text-bankTeal group-hover:border-white/20"
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                    {isActive ? "In progress" : "Navigate"}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Signed in</p>
        <p className="mt-2 text-lg font-semibold text-white">{user?.fullName}</p>
        <p className="text-xs text-white/40">Role: {user?.role}</p>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 font-semibold text-rose-200 transition hover:border-rose-200/40 hover:bg-rose-500/20"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
