import React from "react";

const toneOverlays = {
  aurora: "from-bankBlue/45 via-bankLavender/25 to-bankTeal/35",
  mint: "from-bankMint/30 via-teal-400/25 to-bankBlue/30",
  royal: "from-bankLavender/30 via-bankBlue/30 to-slate-900/40",
  coral: "from-bankCoral/35 via-rose-400/25 to-bankLavender/25",
};

export default function GlassPanel({
  as: Component = "section",
  children,
  className = "",
  tone = "aurora",
  border = true,
}) {
  const overlay = toneOverlays[tone] || toneOverlays.aurora;
  const borderClass = border ? "border border-white/10" : "";

  return (
    <Component
      className={`relative overflow-hidden rounded-[28px] ${borderClass} bg-white/5 text-slate-100 shadow-[0_25px_80px_rgba(8,15,35,0.55)] backdrop-blur-2xl ${className}`.trim()}
    >
      <span
        className={`pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-br ${overlay} opacity-70 blur-3xl`}
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-[1px] rounded-[26px] border border-white/5 bg-slate-950/70 mix-blend-soft-light"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </Component>
  );
}
