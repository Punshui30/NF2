import React from "react";

export default function ShareToPhone() {
  const url = `${window.location.origin}/onboarding`;
  const qr = `https://chart.googleapis.com/chart?cht=qr&chs=120x120&chld=Q|1&chl=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2">
      <img src={qr} width={60} height={60} alt="QR" className="rounded" />
      <div className="text-xs text-white/80">
        Continue on your phone<br />
        <span className="text-white/60">{url}</span>
      </div>
    </div>
  );
}
