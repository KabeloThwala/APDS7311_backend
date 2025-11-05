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
    <aside className="relative flex min-h-screen w-72 flex-col justify-between border-r border-white/10 bg-white/5 px-7 py-8 text-slate-100 shadow-[0_25px_80px_rgba(8,15,35,0.55)] backdrop-blur-3xl">
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bankBlue/20 via-bankLavender/10 to-transparent opacity-70 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.25),transparent_60%)]"
        aria-hidden
      />
      <div className="relative z-10 space-y-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_18px_45px_rgba(8,15,35,0.45)]">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/70 text-bankMint shadow-inner shadow-black/30">
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
                    ? "border-bankTeal/60 bg-white/10 text-white shadow-[0_18px_40px_rgba(14,165,233,0.25)]"
                    : "border-white/5 bg-white/5 text-slate-300 hover:border-bankTeal/40 hover:bg-white/10 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-bankTeal/20 text-bankMint"
                      : "bg-slate-900/70 text-bankTeal group-hover:bg-bankTeal/15 group-hover:text-bankMint"
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

      <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm shadow-[0_18px_45px_rgba(8,15,35,0.45)]">
        <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Signed in</p>
        <p className="mt-2 text-lg font-semibold text-white">{user?.fullName}</p>
        <p className="text-xs text-slate-500">Role: {user?.role}</p>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/25"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
