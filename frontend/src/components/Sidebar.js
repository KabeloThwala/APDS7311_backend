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
    <aside className="flex min-h-screen w-72 flex-col justify-between border-r border-slate-800/60 bg-bankMidnight/90 px-7 py-8 text-slate-100 shadow-panel backdrop-blur-xl">
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-800/60 bg-gradient-to-br from-bankBlue/25 via-bankLavender/20 to-bankTeal/30 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/80 text-bankMint shadow-inner shadow-black/30">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">EventEase Bank</p>
              <h3 className="text-lg font-semibold text-white">International Suite</h3>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Every transaction is shielded with adaptive security, TLS 1.3, and zero-trust monitoring.
          </p>
        </div>

        <nav className="space-y-2" aria-label="Primary navigation">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.to)}
                className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bankTeal/50 ${
                  isActive
                    ? "border-bankTeal/50 bg-slate-900/80 text-white shadow-glow"
                    : "border-transparent bg-slate-900/40 text-slate-300 hover:border-bankTeal/30 hover:bg-slate-900/60 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-bankTeal/20 text-bankMint"
                      : "bg-slate-800/80 text-bankTeal group-hover:bg-bankTeal/15 group-hover:text-bankMint"
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
                    {isActive ? "Active view" : "Switch view"}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-5 text-sm shadow-inner shadow-black/30">
        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Signed in</p>
        <p className="mt-2 text-lg font-semibold text-white">{user?.fullName}</p>
        <p className="text-xs text-slate-500">Role: {user?.role}</p>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-500/20"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
