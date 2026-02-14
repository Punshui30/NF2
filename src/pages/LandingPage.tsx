import React from "react";

export default function LandingPage({ onEnterApp }: { onEnterApp: () => void }) {
  return (
    <div style={{ padding: "50px", backgroundColor: "#111", color: "#0f0", fontFamily: "monospace", minHeight: "100vh" }}>
      <h1>EMERGENCY RESET: APP ALIVE</h1>
      <p>If you see this, the app works. The previous black screen was a component crash.</p>
      <button
        onClick={onEnterApp}
        style={{ padding: "10px 20px", marginTop: "20px", fontSize: "16px", cursor: "pointer" }}
      >
        Enter App
      </button>
    </div>
  );
}
