import { useState } from "react";
import UnifiedApp from "./BetterHuman_App_Unified.jsx";
import WearableUI from "./BetterHuman_F002_WearableUI 1.jsx";
import AIClinician from "./BetterHuman_F007_AIClinician_UI.jsx";
import HealthProfile from "./BetterHuman_HealthProfile_UI 1.jsx";

const TABS = [
  { id: "unified",   label: "🏠 Unified App",       component: UnifiedApp },
  { id: "profile",   label: "👤 Health Profile",     component: HealthProfile },
  { id: "wearable",  label: "⌚ Wearable UI",         component: WearableUI },
  { id: "clinician", label: "🤖 AI Clinician",        component: AIClinician },
];

const tabBarStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "8px 16px",
  background: "rgba(10,10,20,0.92)",
  backdropFilter: "blur(14px)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 2px 20px rgba(0,0,0,0.5)",
};

function App() {
  const [active, setActive] = useState("unified");
  const ActiveComponent = TABS.find((t) => t.id === active).component;

  return (
    <>
      {/* Tab navigation bar */}
      <div style={tabBarStyle}>
        <span style={{
          fontFamily: "'Sora', system-ui, sans-serif",
          fontWeight: 800,
          fontSize: 13,
          color: "white",
          letterSpacing: "-.01em",
          marginRight: 8,
          whiteSpace: "nowrap",
        }}>
          Better<span style={{ color: "#A78BFA" }}>Human</span>
        </span>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", marginRight: 4 }} />
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              transition: "all 0.18s",
              background: active === tab.id
                ? "linear-gradient(135deg,#7C6CF6,#6B5CE7)"
                : "rgba(255,255,255,0.06)",
              color: active === tab.id ? "white" : "rgba(255,255,255,0.5)",
              boxShadow: active === tab.id ? "0 2px 12px rgba(124,108,246,0.4)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Offset content below fixed tab bar */}
      <div style={{ paddingTop: 52 }}>
        <ActiveComponent />
      </div>
    </>
  );
}

export default App;
