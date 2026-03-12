import { useState, useEffect, useRef } from "react";

// ─── Color System (matches BetterHuman brand from F-001 UI) ───────────────
// Primary: #7C6CF6 (logo purple), Dark: #1A1A2E (navy), Accent: #A78BFA
// Vital SDK brand: #5C34A4

const SCREENS = [
  "connect_hub",
  "vital_link",
  "sync_progress",
  "dashboard",
  "trend_charts",
  "data_sources",
  "disconnect",
];

const SCREEN_LABELS = {
  connect_hub:  "Connect Wearables",
  vital_link:   "Vital Link Widget",
  sync_progress:"Sync Progress",
  dashboard:    "Live Metrics Dashboard",
  trend_charts: "90-Day Trend Charts",
  data_sources: "Data Sources & Priority",
  disconnect:   "Disconnect Provider",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --p50:  #F5F3FF;
    --p100: #EDE9FE;
    --p200: #DDD6FE;
    --p300: #C4B5FD;
    --p400: #A78BFA;
    --p500: #8B5CF6;
    --p600: #7C6CF6;
    --p700: #6B5CE7;
    --p800: #5B4FD6;
    --p900: #4338CA;
    --navy:    #1A1A2E;
    --navy2:   #16213E;
    --navy3:   #0F172A;
    --surface: #F8F7FF;
    --white:   #FFFFFF;
    --text1:   #1A1A2E;
    --text2:   #4B4B6B;
    --text3:   #8B8BAD;
    --success: #10B981;
    --warning: #F59E0B;
    --danger:  #EF4444;
    --border:  #E8E4FF;
    --vital:   #5C34A4;
    --vital-light: #F0EBFF;
    --shadow:    0 4px 24px rgba(124,108,246,0.12);
    --shadow-lg: 0 12px 48px rgba(124,108,246,0.2);
    --radius:    16px;
    --radius-sm: 10px;
    --radius-lg: 24px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--text1); }
  .sora { font-family: 'Sora', sans-serif; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--p300); border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes spin     { to { transform: rotate(360deg); } }
  @keyframes pulse    { 0%,100%{ opacity:1; } 50%{ opacity:.4; } }
  @keyframes ping     { 0%{ transform:scale(1); opacity:.8; } 100%{ transform:scale(2.2); opacity:0; } }
  @keyframes progressFill { from { width:0%; } to { width:var(--pct); } }
  @keyframes syncPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(124,108,246,0.4); } 50%{ box-shadow:0 0 0 8px rgba(124,108,246,0); } }
  @keyframes waveform { 0%,100%{ height:4px; } 50%{ height:18px; } }
  @keyframes float    { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-6px); } }

  .fade-up  { animation: fadeUp  .45s cubic-bezier(.22,1,.36,1) both; }
  .fade-in  { animation: fadeIn  .35s ease both; }
  .slide-in { animation: slideIn .35s cubic-bezier(.22,1,.36,1) both; }

  /* Scrollable inner areas */
  .scroll-y { overflow-y:auto; overflow-x:hidden; }
  .scroll-y::-webkit-scrollbar { width:3px; }

  /* Shared card */
  .card {
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }

  /* Pill badge */
  .badge {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 10px; border-radius:999px;
    font-size:11px; font-weight:600; letter-spacing:.3px;
  }
  .badge-connected { background:#D1FAE5; color:#065F46; }
  .badge-syncing   { background:#FEF3C7; color:#92400E; }
  .badge-error     { background:#FEE2E2; color:#991B1B; }
  .badge-never     { background:#F3F4F6; color:#6B7280; }
  .badge-vital     { background:var(--vital-light); color:var(--vital); }

  /* Button styles */
  .btn-primary {
    background: linear-gradient(135deg, var(--p600), var(--p800));
    color: white; border:none; border-radius: var(--radius-sm);
    padding:12px 24px; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer;
    transition: all .2s; box-shadow: 0 4px 14px rgba(124,108,246,0.35);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(124,108,246,0.45); }

  .btn-vital {
    background: linear-gradient(135deg, var(--vital), #7B4FC4);
    color: white; border:none; border-radius: var(--radius-sm);
    padding:12px 24px; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer;
    transition: all .2s; box-shadow: 0 4px 14px rgba(92,52,164,0.35);
  }
  .btn-vital:hover { transform:translateY(-1px); }

  .btn-outline {
    background: transparent; color:var(--p600);
    border:1.5px solid var(--p300); border-radius:var(--radius-sm);
    padding:11px 24px; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer; transition:all .2s;
  }
  .btn-outline:hover { background:var(--p50); }

  .btn-ghost {
    background:transparent; color:var(--text2); border:none;
    padding:8px 16px; font-family:'DM Sans',sans-serif;
    font-size:13px; cursor:pointer; border-radius:var(--radius-sm);
    transition:all .15s;
  }
  .btn-ghost:hover { background:var(--p50); color:var(--p700); }

  /* Toggle switch */
  .toggle-track {
    width:44px; height:24px; border-radius:999px;
    transition:background .2s; cursor:pointer; position:relative;
  }
  .toggle-thumb {
    position:absolute; top:3px; width:18px; height:18px;
    border-radius:50%; background:white;
    box-shadow:0 1px 4px rgba(0,0,0,.2);
    transition:transform .2s; left:3px;
  }
  .toggle-on .toggle-track { background:var(--p600); }
  .toggle-on .toggle-thumb { transform:translateX(20px); }
  .toggle-off .toggle-track { background:#D1D5DB; }

  /* Wearable brand colors */
  .w-apple  { --wc:#1C1C1E; --wbg:#F2F2F7; }
  .w-oura   { --wc:#3D1C6E; --wbg:#F0E6FF; }
  .w-whoop  { --wc:#1B5E20; --wbg:#E8F5E9; }
  .w-garmin { --wc:#005EB8; --wbg:#E3F0FF; }
  .w-fitbit { --wc:#00B0B9; --wbg:#E0FAFA; }

  /* Sparkline bars */
  .spark-bar {
    width:4px; border-radius:2px; background:var(--p300);
    transition:height .3s ease;
  }

  /* Metric card accent line */
  .metric-accent { width:3px; border-radius:3px; flex-shrink:0; }

  /* Waveform animation for active sync */
  .wave-bar {
    width:3px; border-radius:2px; background:var(--p600);
    animation: waveform .8s ease-in-out infinite;
  }
  .wave-bar:nth-child(2) { animation-delay:.1s; }
  .wave-bar:nth-child(3) { animation-delay:.2s; }
  .wave-bar:nth-child(4) { animation-delay:.3s; }
  .wave-bar:nth-child(5) { animation-delay:.2s; }

  /* Progress bar */
  .progress-bar {
    height:6px; border-radius:3px; background:var(--p100); overflow:hidden;
  }
  .progress-fill {
    height:100%; border-radius:3px;
    background:linear-gradient(90deg, var(--p600), var(--p400));
    transition:width .6s cubic-bezier(.22,1,.36,1);
  }

  /* Chart grid */
  .chart-grid line { stroke:#E8E4FF; stroke-width:1; }
`;

// ─── Wearable Data ─────────────────────────────────────────────────────────
const WEARABLES = [
  { id:"apple",  name:"Apple Health",   emoji:"🍎", cls:"w-apple",  type:"sdk",   status:"connected", lastSync:"2 min ago",  progress:100 },
  { id:"oura",   name:"Oura Ring",      emoji:"💍", cls:"w-oura",   type:"oauth", status:"connected", lastSync:"8 min ago",  progress:100 },
  { id:"whoop",  name:"WHOOP",          emoji:"💪", cls:"w-whoop",  type:"oauth", status:"syncing",   lastSync:"Syncing...", progress:67  },
  { id:"garmin", name:"Garmin Connect", emoji:"⌚", cls:"w-garmin", type:"oauth", status:"never",     lastSync:"—",          progress:0   },
  { id:"fitbit", name:"Fitbit",         emoji:"🏃", cls:"w-fitbit", type:"oauth", status:"never",     lastSync:"—",          progress:0   },
];

const METRICS = [
  { id:"hrv",      label:"HRV",          value:"62",  unit:"ms",      delta:"+8%",  positive:true,  color:"#7C6CF6", data:[44,51,49,55,58,60,62] },
  { id:"steps",    label:"Steps",        value:"9,247",unit:"today",   delta:"+12%", positive:true,  color:"#10B981", data:[7200,8100,6900,9500,8800,7600,9247] },
  { id:"rhr",      label:"Resting HR",   value:"58",  unit:"bpm",     delta:"-3%",  positive:true,  color:"#EF4444", data:[63,61,60,59,59,58,58] },
  { id:"sleep",    label:"Sleep",        value:"7h 24m",unit:"last night",delta:"+18m",positive:true,color:"#3B82F6", data:[6.1,6.8,7.0,6.5,7.2,6.9,7.4] },
  { id:"calories", label:"Active Cal",  value:"487",  unit:"kcal",    delta:"+5%",  positive:true,  color:"#F59E0B", data:[320,410,380,450,420,390,487] },
  { id:"spo2",     label:"Blood O₂",    value:"98",   unit:"%",       delta:"0%",   positive:true,  color:"#06B6D4", data:[97,98,97,98,98,98,98] },
];

const TREND_DATA = {
  hrv:     { values:[44,51,49,55,58,53,60,57,62,59,64,61,66,62,65,60,63,67,64,62,65,68,63,66,62,65,62,65,60,62], label:"HRV (rMSSD)", unit:"ms",   color:"#7C6CF6" },
  steps:   { values:[7200,8100,6900,9500,8800,7600,9200,8400,10100,7800,9300,8600,9800,8200,9100,7500,8800,9400,8100,9600,7900,8700,9200,8500,9100,7700,9300,8800,9100,9247], label:"Daily Steps", unit:"steps", color:"#10B981" },
  rhr:     { values:[65,64,63,62,62,63,61,60,60,59,59,60,59,58,59,58,59,58,58,57,58,58,57,58,58,57,58,57,58,58], label:"Resting HR", unit:"bpm",   color:"#EF4444" },
  sleep:   { values:[6.1,6.8,7.0,6.5,7.2,6.9,7.4,6.8,7.1,6.6,7.3,7.0,6.7,7.2,6.9,7.4,6.8,7.1,7.3,6.9,7.2,7.0,7.5,6.8,7.1,7.3,7.0,6.9,7.2,7.4], label:"Sleep Duration", unit:"hrs", color:"#3B82F6" },
};

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icon = ({ name, size=16, color="currentColor" }) => {
  const icons = {
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    wifi: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill={color}/></svg>,
    arrow_right: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    arrow_left: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    trending_up: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    trending_down: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    activity: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    droplet: <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
    drag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="9" cy="5" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="9" cy="19" r="1" fill={color}/><circle cx="15" cy="5" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="15" cy="19" r="1" fill={color}/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    external: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    grip: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  };
  return icons[name] || null;
};

// ─── Sparkline ─────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, height=28 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 56, h = height;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - ((v-min)/range)*h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={`${pts} ${w},${h} 0,${h}`} fill={`url(#sg-${color.replace("#","")})`} stroke="none"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)/(data.length-1)*w} cy={h - ((data[data.length-1]-min)/range)*h} r="3" fill={color}/>
    </svg>
  );
};

// ─── Mini line chart for trend page ────────────────────────────────────────
const TrendChart = ({ data, color, label, unit, range }) => {
  const slice = range === 7 ? data.slice(-7) : range === 30 ? data.slice(-30) : data;
  const max = Math.max(...slice), min = Math.min(...slice);
  const rng = max - min || 1;
  const W=560, H=120;
  // rolling 7-day avg
  const avg = slice.map((_, i, arr) => {
    const window = arr.slice(Math.max(0,i-6), i+1);
    return window.reduce((s,v)=>s+v,0)/window.length;
  });
  const pts = slice.map((v, i) => `${(i/(slice.length-1))*W},${H - ((v-min)/rng)*(H-10)+5}`).join(" ");
  const avgPts = avg.map((v, i) => `${(i/(slice.length-1))*W},${H - ((v-min)/rng)*(H-10)+5}`).join(" ");
  const gridYs = [0, 0.25, 0.5, 0.75, 1].map(f => H - f*(H-10)+5);
  return (
    <div style={{ padding:"0 4px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, alignItems:"center" }}>
        {gridYs.map((y,i) => (
          <span key={i} style={{ position:"absolute", display:"none" }}>{(min + (1-(i/4))*rng).toFixed(1)}</span>
        ))}
        <div style={{ display:"flex", gap:16 }}>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#8B8BAD" }}>
            <span style={{ width:16, height:2, background:color, borderRadius:2, display:"inline-block" }}/>Actual
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#8B8BAD" }}>
            <span style={{ width:16, height:2, background:"#C4B5FD", borderRadius:2, display:"inline-block", opacity:.7 }}/>7-day avg
          </span>
        </div>
        <span style={{ fontSize:12, color:"#8B8BAD" }}>Last {slice.length} days</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
        <defs>
          <linearGradient id={`tg-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity=".18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {gridYs.map((y,i) => <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#E8E4FF" strokeWidth="1"/>)}
        <polyline points={`${pts} ${W},${H} 0,${H}`} fill={`url(#tg-${label})`} stroke="none"/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points={avgPts} fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
      </svg>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
        <span style={{ fontSize:11, color:"#8B8BAD" }}>{slice.length} days ago</span>
        <span style={{ fontSize:11, color:"#8B8BAD" }}>Today</span>
      </div>
    </div>
  );
};

// ─── Status Dot ────────────────────────────────────────────────────────────
const StatusDot = ({ status }) => {
  const map = {
    connected: { color:"#10B981", label:"Connected", badge:"badge-connected" },
    syncing:   { color:"#F59E0B", label:"Syncing",   badge:"badge-syncing"   },
    error:     { color:"#EF4444", label:"Error",     badge:"badge-error"     },
    never:     { color:"#9CA3AF", label:"Not Connected", badge:"badge-never" },
  };
  const { color, label, badge } = map[status] || map.never;
  return (
    <span className={`badge ${badge}`} style={{ fontSize:11 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:color, display:"inline-block", ...(status==="syncing"?{animation:"pulse 1.2s ease infinite"}:{}) }}/>
      {label}
    </span>
  );
};

// ─── Toggle ────────────────────────────────────────────────────────────────
const Toggle = ({ on, onChange }) => (
  <div className={`toggle-on-state ${on ? "toggle-on" : "toggle-off"}`} style={{ cursor:"pointer" }} onClick={()=>onChange(!on)}>
    <div className="toggle-track" style={{ background: on ? "#7C6CF6" : "#D1D5DB" }}>
      <div className="toggle-thumb" style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}/>
    </div>
  </div>
);

// ─── Vital SDK Badge ────────────────────────────────────────────────────────
const VitalBadge = () => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:999, background:"#F0EBFF", fontSize:11, fontWeight:600, color:"#5C34A4" }}>
    <span style={{ width:6, height:6, borderRadius:"50%", background:"#5C34A4", display:"inline-block" }}/>
    Vital SDK
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Screen 1: Connect Wearables Hub ──────────────────────────────────────
const ConnectHubScreen = ({ isMobile, onConnect }) => {
  const [hoveredId, setHoveredId] = useState(null);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--surface)" }}>
      {/* Header */}
      <div style={{ background:"var(--navy)", padding: isMobile ? "20px 20px 28px" : "28px 40px 36px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:"rgba(124,108,246,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="wifi" size={20} color="#A78BFA"/>
          </div>
          <div>
            <div className="sora" style={{ fontSize: isMobile?16:20, fontWeight:700, color:"white" }}>Connect Wearables</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:1 }}>via Vital SDK · link.tryvital.io</div>
          </div>
          <VitalBadge/>
        </div>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginTop:8 }}>
          Connect your health devices to unlock personalized AI insights, biological age tracking, and real-time biometric trends.
        </p>
      </div>

      {/* Already connected banner */}
      <div style={{ background:"#D1FAE5", borderBottom:"1px solid #A7F3D0", padding:"10px 20px", display:"flex", alignItems:"center", gap:8 }}>
        <Icon name="check" size={14} color="#065F46"/>
        <span style={{ fontSize:12, color:"#065F46", fontWeight:500 }}>2 devices connected · Last sync 2 min ago</span>
      </div>

      {/* Wearable cards */}
      <div className="scroll-y" style={{ flex:1, padding: isMobile?"16px":"24px 40px", display:"flex", flexDirection:"column", gap:12 }}>
        {WEARABLES.map((w, i) => (
          <div
            key={w.id}
            className="card fade-up"
            style={{
              padding:isMobile?"14px 16px":"16px 20px",
              animationDelay:`${i*0.07}s`,
              cursor:"pointer",
              transition:"transform .2s, box-shadow .2s",
              transform: hoveredId===w.id ? "translateY(-1px)" : "none",
              boxShadow: hoveredId===w.id ? "var(--shadow-lg)" : "var(--shadow)",
              border: w.status==="connected" ? "1.5px solid #A7F3D0" : w.status==="syncing" ? "1.5px solid #FDE68A" : "1px solid var(--border)",
            }}
            onMouseEnter={()=>setHoveredId(w.id)}
            onMouseLeave={()=>setHoveredId(null)}
          >
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Icon */}
              <div className={w.cls} style={{
                width:44, height:44, borderRadius:12, background:"var(--wbg)", 
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0,
                border:"1px solid rgba(0,0,0,0.06)",
              }}>
                {w.emoji}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span className="sora" style={{ fontSize:14, fontWeight:600, color:"var(--navy)" }}>{w.name}</span>
                  {w.type==="sdk" && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:"#E0E7FF", color:"#3730A3", fontWeight:600 }}>SDK</span>}
                  {w.type==="oauth" && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:"var(--vital-light)", color:"var(--vital)", fontWeight:600 }}>OAuth</span>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <StatusDot status={w.status}/>
                  {w.status!=="never" && (
                    <span style={{ fontSize:11, color:"var(--text3)" }}>
                      {w.status==="syncing"
                        ? <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <div style={{ display:"flex", gap:2, alignItems:"flex-end", height:16 }}>
                              {[0,1,2,3,4].map(j=><div key={j} className="wave-bar" style={{ animationDelay:`${j*0.1}s`, height:4 }}/>)}
                            </div>
                            Importing data...
                          </span>
                        : `Last sync: ${w.lastSync}`
                      }
                    </span>
                  )}
                </div>
                {/* Progress bar for syncing */}
                {w.status==="syncing" && (
                  <div style={{ marginTop:8 }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width:`${w.progress}%` }}/>
                    </div>
                    <span style={{ fontSize:10, color:"var(--text3)", marginTop:2, display:"block" }}>{w.progress}% of historical data imported</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div style={{ flexShrink:0 }}>
                {w.status==="connected" || w.status==="syncing" ? (
                  <button className="btn-outline" style={{ padding:"7px 14px", fontSize:12 }}>Manage</button>
                ) : (
                  <button className="btn-vital" style={{ padding:"8px 16px", fontSize:12 }} onClick={()=>onConnect(w)}>
                    <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <Icon name="link" size={13} color="white"/>
                      Connect
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Vital SDK info box */}
        <div style={{ background:"var(--vital-light)", borderRadius:12, padding:"14px 16px", border:"1px solid #D8C4FF", marginTop:4 }}>
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"var(--vital)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name="shield" size={16} color="white"/>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--vital)", marginBottom:3 }}>Powered by Vital SDK</div>
              <div style={{ fontSize:11, color:"#6B4FA8", lineHeight:1.5 }}>OAuth flows, token management, and data normalisation are handled by Vital (link.tryvital.io). Better Human never stores your provider credentials.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 2: Vital Link Widget ───────────────────────────────────────────
const VitalLinkScreen = ({ isMobile }) => {
  const [step, setStep] = useState("loading"); // loading | consent | success
  useEffect(() => {
    const t1 = setTimeout(() => setStep("consent"), 900);
    return () => clearTimeout(t1);
  }, []);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#F7F7F7" }}>
      {/* Browser/modal chrome */}
      <div style={{ background:"#2D2D2D", padding:"10px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", gap:6 }}>
          {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} style={{ width:10, height:10, borderRadius:"50%", background:c }}/>)}
        </div>
        <div style={{ flex:1, background:"#1A1A1A", borderRadius:6, padding:"4px 12px", fontSize:11, color:"#9CA3AF", fontFamily:"monospace" }}>
          🔒 link.tryvital.io/link/connect?token=lnk_9xK2m...
        </div>
        <VitalBadge/>
      </div>

      {/* Widget content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24 }}>
        {step==="loading" ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
            <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #E8E4FF", borderTopColor:"var(--vital)", animation:"spin 0.8s linear infinite" }}/>
            <span style={{ fontSize:13, color:"#6B7280" }}>Loading Vital Link...</span>
          </div>
        ) : step==="success" ? (
          <div className="fade-up" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#D1FAE5", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="check" size={28} color="#10B981"/>
            </div>
            <div className="sora" style={{ fontSize:20, fontWeight:700, color:"var(--navy)" }}>Garmin Connected!</div>
            <p style={{ fontSize:13, color:"#6B7280" }}>Your data will sync automatically. Redirecting back to Better Human...</p>
          </div>
        ) : (
          <div className="fade-up card" style={{ width:"100%", maxWidth:380, padding:28 }}>
            {/* Vital header */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"var(--vital)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <Icon name="link" size={22} color="white"/>
              </div>
              <div className="sora" style={{ fontSize:18, fontWeight:700, color:"var(--navy)", marginBottom:4 }}>Connect Garmin</div>
              <p style={{ fontSize:12, color:"#6B7280" }}>Better Human is requesting access to your Garmin Connect data via Vital</p>
            </div>

            {/* Permissions list */}
            <div style={{ background:"#F9FAFB", borderRadius:10, padding:"12px 14px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:10, textTransform:"uppercase", letterSpacing:.5 }}>Data Access Requested</div>
              {["Steps & Activity","Heart Rate & HRV","Sleep Analysis","Body Battery","VO2 Max","Calorie Burn"].map(item => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid #E5E7EB" }}>
                  <Icon name="check" size={12} color="#10B981"/>
                  <span style={{ fontSize:12, color:"#374151" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Provider logos */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:20 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#E3F0FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, margin:"0 auto 4px" }}>⌚</div>
                <span style={{ fontSize:10, color:"#6B7280" }}>Garmin</span>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2].map(j=><div key={j} style={{ width:4, height:4, borderRadius:"50%", background:"#D1D5DB" }}/>)}
              </div>
              <div style={{ width:32, height:32, borderRadius:8, background:"var(--vital)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Icon name="link" size={14} color="white"/>
              </div>
              <div style={{ display:"flex", gap:4 }}>
                {[0,1,2].map(j=><div key={j} style={{ width:4, height:4, borderRadius:"50%", background:"#D1D5DB" }}/>)}
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"var(--p100)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, margin:"0 auto 4px" }}>🏃</div>
                <span style={{ fontSize:10, color:"#6B7280" }}>Better Human</span>
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-outline" style={{ flex:1, padding:"11px" }} onClick={()=>{}}>Cancel</button>
              <button className="btn-vital" style={{ flex:2, padding:"11px" }} onClick={()=>setStep("success")}>
                Authorize Access →
              </button>
            </div>
            <p style={{ fontSize:10, color:"#9CA3AF", textAlign:"center", marginTop:12, lineHeight:1.5 }}>
              By connecting, you agree to Vital's Terms. Your credentials are never shared with Better Human.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Screen 3: Sync Progress ───────────────────────────────────────────────
const SyncProgressScreen = ({ isMobile }) => {
  const [progs, setProgs] = useState({ apple:100, oura:100, whoop:67, garmin:12, fitbit:0 });
  useEffect(() => {
    const t = setInterval(() => {
      setProgs(p => ({
        ...p,
        garmin: Math.min(100, p.garmin + 4),
      }));
    }, 400);
    return () => clearInterval(t);
  }, []);

  const providers = [
    { id:"apple",  name:"Apple Health", emoji:"🍎", status:"complete", days:"90 days" },
    { id:"oura",   name:"Oura Ring",    emoji:"💍", status:"complete", days:"90 days" },
    { id:"whoop",  name:"WHOOP",        emoji:"💪", status:"syncing",  days:"67 / 90 days" },
    { id:"garmin", name:"Garmin",       emoji:"⌚", status:"syncing",  days:`${Math.round(progs.garmin * 0.9)} / 90 days` },
    { id:"fitbit", name:"Fitbit",       emoji:"🏃", status:"queued",   days:"Queued" },
  ];

  const totalPct = Math.round(Object.values(progs).reduce((s,v)=>s+v,0) / 5);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--surface)" }}>
      <div style={{ background:"var(--navy)", padding: isMobile?"20px":"28px 40px" }}>
        <div className="sora" style={{ fontSize: isMobile?16:20, fontWeight:700, color:"white", marginBottom:6 }}>
          Historical Data Import
        </div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Vital is importing up to 90 days of historical data from each provider</p>
        <div style={{ marginTop:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>Overall Progress</span>
            <span style={{ fontSize:13, fontWeight:700, color:"white" }}>{totalPct}%</span>
          </div>
          <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${totalPct}%`, background:"linear-gradient(90deg,#7C6CF6,#A78BFA)", borderRadius:4, transition:"width .5s" }}/>
          </div>
        </div>
      </div>

      <div className="scroll-y" style={{ flex:1, padding: isMobile?"16px":"24px 40px", display:"flex", flexDirection:"column", gap:12 }}>
        {providers.map(p => (
          <div key={p.id} className="card" style={{ padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: p.status!=="queued"?10:0 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"#F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {p.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className="sora" style={{ fontSize:14, fontWeight:600 }}>{p.name}</span>
                  {p.status==="complete" && <span className="badge badge-connected"><Icon name="check" size={10} color="#065F46"/>Complete</span>}
                  {p.status==="syncing" && <span className="badge badge-syncing" style={{ animation:"syncPulse 1.5s infinite" }}>Syncing</span>}
                  {p.status==="queued" && <span className="badge badge-never">Queued</span>}
                </div>
                <span style={{ fontSize:11, color:"var(--text3)" }}>{p.days}</span>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color: p.status==="complete"?"#10B981":p.status==="queued"?"#9CA3AF":"var(--p600)" }}>
                {progs[p.id]}%
              </span>
            </div>
            {p.status!=="queued" && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${progs[p.id]}%`, background: p.status==="complete"?"#10B981":"linear-gradient(90deg,#7C6CF6,#A78BFA)" }}/>
              </div>
            )}
          </div>
        ))}

        <div style={{ background:"var(--vital-light)", borderRadius:12, padding:"12px 16px", border:"1px solid #D8C4FF", display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="info" size={16} color="var(--vital)"/>
          <span style={{ fontSize:12, color:"#6B4FA8", lineHeight:1.5 }}>
            Historical import runs in the background. You can close this page — your dashboard will populate automatically as data arrives via Vital webhooks.
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Screen 4: Live Metrics Dashboard ─────────────────────────────────────
const DashboardScreen = ({ isMobile }) => {
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(()=>setRefreshing(false), 1400);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--surface)" }}>
      {/* Header */}
      <div style={{ background:"var(--navy)", padding: isMobile?"18px 20px":"24px 40px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div className="sora" style={{ fontSize: isMobile?15:18, fontWeight:700, color:"white" }}>Live Metrics</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:2 }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#10B981", display:"inline-block", animation:"pulse 1.5s ease infinite" }}/>
              Real-time sync · 5 sources
            </span>
          </div>
        </div>
        <button className="btn-ghost" style={{ color:"white", display:"flex", alignItems:"center", gap:6, fontSize:12 }} onClick={handleRefresh}>
          <div style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}>
            <Icon name="refresh" size={14} color="white"/>
          </div>
          Refresh
        </button>
      </div>

      {/* Stale warning */}
      <div style={{ background:"#FEF9C3", padding:"8px 20px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid #FDE68A" }}>
        <Icon name="alert" size={13} color="#92400E"/>
        <span style={{ fontSize:11, color:"#92400E" }}>Fitbit last synced 18 min ago · Some readings may be stale</span>
      </div>

      {/* Metric cards grid */}
      <div className="scroll-y" style={{ flex:1, padding: isMobile?"14px":"24px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"repeat(3,1fr)", gap: isMobile?10:14 }}>
          {METRICS.map((m, i) => (
            <div key={m.id} className="card fade-up" style={{ padding: isMobile?"12px 14px":"16px 18px", animationDelay:`${i*0.06}s`, cursor:"pointer", transition:"transform .15s", }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:11, color:"var(--text3)", fontWeight:500, marginBottom:4 }}>{m.label}</div>
                  <div className="sora" style={{ fontSize: isMobile?18:22, fontWeight:700, color:"var(--navy)" }}>
                    {m.value}
                    <span style={{ fontSize:11, fontWeight:400, color:"var(--text3)", marginLeft:3 }}>{m.unit}</span>
                  </div>
                </div>
                <div style={{ width:32, height:32, borderRadius:8, background:`${m.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {m.id==="hrv" && <Icon name="activity" size={14} color={m.color}/>}
                  {m.id==="steps" && <Icon name="zap" size={14} color={m.color}/>}
                  {m.id==="rhr" && <Icon name="heart" size={14} color={m.color}/>}
                  {m.id==="sleep" && <Icon name="moon" size={14} color={m.color}/>}
                  {m.id==="calories" && <Icon name="zap" size={14} color={m.color}/>}
                  {m.id==="spo2" && <Icon name="droplet" size={14} color={m.color}/>}
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {m.positive ? <Icon name="trending_up" size={12} color="#10B981"/> : <Icon name="trending_down" size={12} color="#EF4444"/>}
                  <span style={{ fontSize:11, color: m.positive?"#10B981":"#EF4444", fontWeight:600 }}>{m.delta}</span>
                  <span style={{ fontSize:10, color:"var(--text3)" }}>7d</span>
                </div>
                <Sparkline data={m.data} color={m.color}/>
              </div>
            </div>
          ))}
        </div>

        {/* Source attribution */}
        <div className="card" style={{ marginTop:14, padding:"14px 18px" }}>
          <div style={{ fontSize:11, fontWeight:700, color:"var(--text2)", marginBottom:10, textTransform:"uppercase", letterSpacing:.5 }}>Data Sources Active</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {WEARABLES.filter(w=>w.status!=="never").map(w=>(
              <div key={w.id} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 10px", borderRadius:8, background:"#F9FAFB", border:"1px solid var(--border)" }}>
                <span style={{ fontSize:14 }}>{w.emoji}</span>
                <span style={{ fontSize:11, fontWeight:500, color:"var(--text2)" }}>{w.name}</span>
                <StatusDot status={w.status}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 5: Trend Charts ─────────────────────────────────────────────────
const TrendChartsScreen = ({ isMobile }) => {
  const [activeMetric, setActiveMetric] = useState("hrv");
  const [range, setRange] = useState(30);
  const current = TREND_DATA[activeMetric];
  const metricTabs = [
    { id:"hrv",   label:"HRV",    color:"#7C6CF6" },
    { id:"steps", label:"Steps",  color:"#10B981" },
    { id:"rhr",   label:"Heart",  color:"#EF4444" },
    { id:"sleep", label:"Sleep",  color:"#3B82F6" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--surface)" }}>
      <div style={{ background:"var(--navy)", padding: isMobile?"18px 20px":"24px 40px" }}>
        <div className="sora" style={{ fontSize: isMobile?16:20, fontWeight:700, color:"white", marginBottom:4 }}>90-Day Trends</div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Historical data pulled via Vital SDK · Oura + Apple Health</p>
      </div>

      {/* Metric selector */}
      <div style={{ background:"white", borderBottom:"1px solid var(--border)", padding:"0 20px", display:"flex", gap:0 }}>
        {metricTabs.map(m => (
          <button key={m.id} onClick={()=>setActiveMetric(m.id)} style={{
            padding:"12px 16px", border:"none", background:"none", cursor:"pointer",
            fontSize:13, fontWeight:600,
            color: activeMetric===m.id ? m.color : "var(--text3)",
            borderBottom: activeMetric===m.id ? `2.5px solid ${m.color}` : "2.5px solid transparent",
            transition:"all .2s", fontFamily:"'DM Sans',sans-serif",
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="scroll-y" style={{ flex:1, padding: isMobile?"16px":"24px 40px" }}>
        {/* Summary stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Current", val: current.values[current.values.length-1].toFixed(1), unit: current.unit },
            { label:"7-Day Avg", val: (current.values.slice(-7).reduce((s,v)=>s+v,0)/7).toFixed(1), unit: current.unit },
            { label:"30-Day Avg", val: (current.values.slice(-30).reduce((s,v)=>s+v,0)/30).toFixed(1), unit: current.unit },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding:"14px 16px", textAlign:"center" }}>
              <div style={{ fontSize:10, color:"var(--text3)", fontWeight:600, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>{s.label}</div>
              <div className="sora" style={{ fontSize:20, fontWeight:700, color:current.color }}>{s.val}</div>
              <div style={{ fontSize:10, color:"var(--text3)" }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="card" style={{ padding:"20px 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <div className="sora" style={{ fontSize:15, fontWeight:700, color:"var(--navy)" }}>{current.label}</div>
              <div style={{ fontSize:11, color:"var(--text3)" }}>Rolling 7-day average overlay</div>
            </div>
            {/* Range selector */}
            <div style={{ display:"flex", gap:2, background:"#F3F4F6", borderRadius:8, padding:2 }}>
              {[7,30,90].map(r => (
                <button key={r} onClick={()=>setRange(r)} style={{
                  padding:"5px 12px", border:"none", cursor:"pointer", borderRadius:6,
                  fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  background: range===r ? "white" : "transparent",
                  color: range===r ? current.color : "var(--text3)",
                  boxShadow: range===r ? "0 1px 4px rgba(0,0,0,.1)" : "none",
                  transition:"all .15s",
                }}>
                  {r}d
                </button>
              ))}
            </div>
          </div>
          <TrendChart data={current.values} color={current.color} label={current.label} unit={current.unit} range={range}/>
        </div>

        {/* Data quality info */}
        <div style={{ marginTop:14, display:"flex", gap:8, alignItems:"flex-start", padding:"12px 14px", background:"var(--p50)", borderRadius:12, border:"1px solid var(--border)" }}>
          <Icon name="info" size={14} color="var(--p600)"/>
          <span style={{ fontSize:11, color:"var(--text2)", lineHeight:1.5 }}>
            Conflict resolution active: When both Oura and Apple Health report HRV, Oura takes priority. Raw data from all sources is preserved. Change priority in Data Sources settings.
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Screen 6: Data Sources & Priority ────────────────────────────────────
const DataSourcesScreen = ({ isMobile }) => {
  const [priorities, setPriorities] = useState(["oura","whoop","garmin","fitbit","apple"]);
  const [perMetric, setPerMetric] = useState({
    hrv: true, steps: true, sleep: true, heart_rate: true, calories: false, spo2: true
  });
  const [dragging, setDragging] = useState(null);

  const moveUp = (i) => {
    if (i===0) return;
    const arr = [...priorities];
    [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
    setPriorities(arr);
  };

  const wearableInfo = { oura:"💍", whoop:"💪", garmin:"⌚", fitbit:"🏃", apple:"🍎" };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"var(--surface)" }}>
      <div style={{ background:"var(--navy)", padding: isMobile?"18px 20px":"24px 40px" }}>
        <div className="sora" style={{ fontSize: isMobile?16:20, fontWeight:700, color:"white", marginBottom:4 }}>Data Sources & Priority</div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Control how conflicting data from multiple sources is resolved</p>
      </div>

      <div className="scroll-y" style={{ flex:1, padding: isMobile?"16px":"24px 40px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* Priority order */}
        <div>
          <h3 className="sora" style={{ fontSize:14, fontWeight:700, marginBottom:4, color:"var(--navy)" }}>Global Source Priority</h3>
          <p style={{ fontSize:12, color:"var(--text3)", marginBottom:14 }}>When multiple sources report the same metric, higher priority wins. Drag to reorder.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {priorities.map((pid, i) => (
              <div key={pid} className="card slide-in" style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, animationDelay:`${i*0.04}s`, cursor:"grab", userSelect:"none" }}>
                <div style={{ width:26, height:26, borderRadius:8, background:"linear-gradient(135deg,var(--p600),var(--p800))", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:11, fontWeight:800, color:"white" }}>{i+1}</span>
                </div>
                <span style={{ fontSize:18 }}>{wearableInfo[pid]}</span>
                <span style={{ fontWeight:600, fontSize:13, color:"var(--navy)", flex:1, textTransform:"capitalize" }}>{pid === "apple" ? "Apple Health" : pid === "whoop" ? "WHOOP" : pid.charAt(0).toUpperCase()+pid.slice(1)}</span>
                {i===0 && <span className="badge badge-connected" style={{ fontSize:10 }}>Priority 1</span>}
                <div style={{ display:"flex", gap:4 }}>
                  <button className="btn-ghost" style={{ padding:"4px 8px" }} onClick={()=>moveUp(i)} disabled={i===0}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i===0?"#D1D5DB":"var(--p600)"} strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                  </button>
                  <button className="btn-ghost" style={{ padding:"4px 8px" }}>
                    <Icon name="drag" size={12} color="var(--text3)"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-datatype toggles */}
        <div>
          <h3 className="sora" style={{ fontSize:14, fontWeight:700, marginBottom:4, color:"var(--navy)" }}>Data Type Permissions</h3>
          <p style={{ fontSize:12, color:"var(--text3)", marginBottom:14 }}>Control which data types Better Human receives from all connected providers</p>
          <div className="card" style={{ overflow:"hidden" }}>
            {Object.entries(perMetric).map(([key, val], i) => (
              <div key={key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", borderBottom: i < Object.keys(perMetric).length-1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:"var(--p50)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {key==="hrv" && <Icon name="activity" size={13} color="var(--p600)"/>}
                    {key==="steps" && <Icon name="zap" size={13} color="var(--p600)"/>}
                    {key==="sleep" && <Icon name="moon" size={13} color="var(--p600)"/>}
                    {key==="heart_rate" && <Icon name="heart" size={13} color="var(--p600)"/>}
                    {key==="calories" && <Icon name="zap" size={13} color="var(--p600)"/>}
                    {key==="spo2" && <Icon name="droplet" size={13} color="var(--p600)"/>}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--navy)", textTransform:"capitalize" }}>{key.replace("_"," ")}</div>
                    <div style={{ fontSize:11, color:"var(--text3)" }}>{val ? "Syncing from all sources" : "Paused"}</div>
                  </div>
                </div>
                <Toggle on={val} onChange={v=>setPerMetric(p=>({...p,[key]:v}))}/>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-primary" style={{ alignSelf:"flex-start" }}>Save Settings</button>
      </div>
    </div>
  );
};

// ── Screen 7: Disconnect Modal ────────────────────────────────────────────
const DisconnectScreen = ({ isMobile }) => {
  const [step, setStep] = useState("confirm"); // confirm | disconnecting | done
  useEffect(() => {
    if (step==="disconnecting") {
      const t = setTimeout(()=>setStep("done"), 1600);
      return () => clearTimeout(t);
    }
  }, [step]);
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"rgba(0,0,0,0.4)", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div className="card fade-up" style={{ width:"100%", maxWidth:380, padding:28 }}>
        {step==="confirm" ? (
          <>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <Icon name="alert" size={22} color="#EF4444"/>
            </div>
            <div className="sora" style={{ fontSize:18, fontWeight:700, textAlign:"center", marginBottom:8, color:"var(--navy)" }}>Disconnect WHOOP?</div>
            <p style={{ fontSize:13, color:"var(--text2)", textAlign:"center", lineHeight:1.6, marginBottom:4 }}>
              This will stop syncing data from WHOOP. Vital will revoke OAuth access on your behalf.
            </p>
            <div style={{ background:"#D1FAE5", borderRadius:10, padding:"10px 14px", margin:"16px 0", display:"flex", gap:8, alignItems:"flex-start" }}>
              <Icon name="check" size={14} color="#065F46"/>
              <span style={{ fontSize:12, color:"#065F46", lineHeight:1.5 }}>Your historical WHOOP data (90 days) will be preserved in Better Human. You can reconnect at any time.</span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-outline" style={{ flex:1 }}>Keep Connected</button>
              <button style={{ flex:1, background:"#EF4444", color:"white", border:"none", borderRadius:"var(--radius-sm)", padding:"11px", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setStep("disconnecting")}>
                Disconnect
              </button>
            </div>
          </>
        ) : step==="disconnecting" ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid var(--p100)", borderTopColor:"var(--p600)", animation:"spin .8s linear infinite", margin:"0 auto 16px" }}/>
            <div className="sora" style={{ fontSize:15, fontWeight:600, color:"var(--navy)", marginBottom:6 }}>Disconnecting WHOOP...</div>
            <p style={{ fontSize:12, color:"var(--text3)" }}>Revoking OAuth token via Vital API</p>
          </div>
        ) : (
          <div className="fade-in" style={{ textAlign:"center", padding:"10px 0" }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"#D1FAE5", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <Icon name="check" size={22} color="#10B981"/>
            </div>
            <div className="sora" style={{ fontSize:18, fontWeight:700, marginBottom:8, color:"var(--navy)" }}>WHOOP Disconnected</div>
            <p style={{ fontSize:12, color:"var(--text3)", lineHeight:1.6, marginBottom:20 }}>Vital has revoked access. No new data will sync. Your historical data is safe.</p>
            <button className="btn-primary" style={{ width:"100%" }}>Back to Connections</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Web Sidebar ────────────────────────────────────────────────────────────
const WebSidebar = ({ current, onChange }) => {
  const navItems = [
    { id:"connect_hub",  label:"Connect",  icon:"wifi" },
    { id:"sync_progress",label:"Import",   icon:"refresh" },
    { id:"dashboard",    label:"Metrics",  icon:"activity" },
    { id:"trend_charts", label:"Trends",   icon:"chart" },
    { id:"data_sources", label:"Sources",  icon:"settings" },
    { id:"disconnect",   label:"Manage",   icon:"user" },
  ];
  return (
    <div style={{ width:220, background:"var(--navy)", display:"flex", flexDirection:"column", padding:"24px 12px", gap:4, flexShrink:0 }}>
      <div style={{ padding:"8px 12px 20px" }}>
        <div className="sora" style={{ fontSize:16, fontWeight:800, color:"white" }}>Better<span style={{ color:"#A78BFA" }}>Human</span></div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginTop:2 }}>Wearable Integration</div>
      </div>
      {navItems.map(item => (
        <button key={item.id} onClick={()=>onChange(item.id)} style={{
          display:"flex", alignItems:"center", gap:10, padding:"10px 12px",
          borderRadius:10, border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          background: current===item.id ? "rgba(124,108,246,0.2)" : "transparent",
          color: current===item.id ? "#A78BFA" : "rgba(255,255,255,0.5)",
          fontSize:13, fontWeight: current===item.id ? 600 : 400,
          transition:"all .15s", width:"100%", textAlign:"left",
        }}>
          <Icon name={item.icon} size={16} color={current===item.id?"#A78BFA":"rgba(255,255,255,0.4)"}/>
          {item.label}
          {item.id==="dashboard" && (
            <span style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%", background:"#10B981", animation:"pulse 1.5s ease infinite" }}/>
          )}
        </button>
      ))}
      <div style={{ marginTop:"auto" }}>
        <div style={{ padding:"12px", borderTop:"1px solid rgba(255,255,255,0.08)", marginTop:8 }}>
          <VitalBadge/>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:6 }}>link.tryvital.io</div>
        </div>
      </div>
    </div>
  );
};

// ─── Mobile Tab Bar ─────────────────────────────────────────────────────────
const MobileTabBar = ({ current, onChange }) => {
  const tabs = [
    { id:"connect_hub", label:"Connect", icon:"wifi" },
    { id:"dashboard",   label:"Metrics", icon:"activity" },
    { id:"trend_charts",label:"Trends",  icon:"chart" },
    { id:"data_sources",label:"Sources", icon:"settings" },
  ];
  return (
    <div style={{ background:"white", borderTop:"1px solid var(--border)", display:"flex", padding:"8px 0 4px" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={()=>onChange(tab.id)} style={{
          flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          border:"none", background:"none", cursor:"pointer", padding:"4px 0",
        }}>
          <Icon name={tab.icon} size={18} color={current===tab.id?"#7C6CF6":"#9CA3AF"}/>
          <span style={{ fontSize:10, color:current===tab.id?"#7C6CF6":"#9CA3AF", fontFamily:"'DM Sans',sans-serif", fontWeight: current===tab.id?600:400 }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [viewMode, setViewMode] = useState("web");
  const [currentScreen, setCurrentScreen] = useState("connect_hub");
  const [connectingTo, setConnectingTo] = useState(null);
  const isMobile = viewMode === "mobile";

  const handleConnect = (wearable) => {
    setConnectingTo(wearable);
    setCurrentScreen("vital_link");
  };

  const renderScreen = () => {
    switch(currentScreen) {
      case "connect_hub":   return <ConnectHubScreen isMobile={isMobile} onConnect={handleConnect}/>;
      case "vital_link":    return <VitalLinkScreen isMobile={isMobile}/>;
      case "sync_progress": return <SyncProgressScreen isMobile={isMobile}/>;
      case "dashboard":     return <DashboardScreen isMobile={isMobile}/>;
      case "trend_charts":  return <TrendChartsScreen isMobile={isMobile}/>;
      case "data_sources":  return <DataSourcesScreen isMobile={isMobile}/>;
      case "disconnect":    return <DisconnectScreen isMobile={isMobile}/>;
      default:              return <ConnectHubScreen isMobile={isMobile} onConnect={handleConnect}/>;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight:"100vh", background:"#E8E4FF", display:"flex", flexDirection:"column", fontFamily:"'DM Sans',sans-serif" }}>
        {/* Control Bar */}
        <div style={{ background:"var(--navy)", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span className="sora" style={{ color:"white", fontWeight:800, fontSize:16 }}>Better<span style={{ color:"#A78BFA" }}>Human</span></span>
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>·</span>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>F-002 Multi-Wearable UI · Vital SDK</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            {/* View toggle */}
            <div style={{ display:"flex", gap:2, background:"rgba(255,255,255,0.08)", borderRadius:8, padding:3 }}>
              {["web","mobile"].map(v=>(
                <button key={v} onClick={()=>setViewMode(v)} style={{
                  padding:"5px 14px", border:"none", borderRadius:6, cursor:"pointer",
                  background: viewMode===v ? "var(--p600)" : "transparent",
                  color: viewMode===v ? "white" : "rgba(255,255,255,0.5)",
                  fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif", transition:"all .15s",
                }}>
                  {v==="web"?"🖥 Web":"📱 Mobile"}
                </button>
              ))}
            </div>
            {/* Screen selector */}
            <select value={currentScreen} onChange={e=>setCurrentScreen(e.target.value)} style={{
              padding:"6px 10px", borderRadius:8, border:"1px solid rgba(255,255,255,0.15)",
              background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.85)",
              fontSize:12, fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
            }}>
              {SCREENS.map(s=><option key={s} value={s} style={{ background:"#1A1A2E" }}>{SCREEN_LABELS[s]}</option>)}
            </select>
          </div>
        </div>

        {/* Device Frame */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px" }}>
          {isMobile ? (
            // ─── Mobile frame
            <div style={{
              width:390, borderRadius:44, overflow:"hidden",
              boxShadow:"0 32px 80px rgba(26,26,46,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
              background:"white", display:"flex", flexDirection:"column",
            }}>
              {/* Status bar */}
              <div style={{ background:"var(--navy)", padding:"14px 24px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontWeight:600, color:"white" }}>9:41</span>
                <div style={{ width:110, height:26, borderRadius:14, background:"black", position:"relative" }}/>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <Icon name="wifi" size={14} color="white"/>
                  <span style={{ fontSize:12, color:"white" }}>●●●</span>
                </div>
              </div>
              {/* Screen content */}
              <div style={{ flex:1, overflowY:"hidden", display:"flex", flexDirection:"column", minHeight:620 }}>
                {renderScreen()}
              </div>
              {/* Tab bar */}
              <MobileTabBar current={currentScreen} onChange={setCurrentScreen}/>
              {/* Home bar */}
              <div style={{ background:"white", padding:"10px 0 16px", display:"flex", justifyContent:"center" }}>
                <div style={{ width:120, height:4, borderRadius:2, background:"#D1D5DB" }}/>
              </div>
            </div>
          ) : (
            // ─── Web frame
            <div style={{
              width:"min(1200px, 100%)", height:680,
              borderRadius:16, overflow:"hidden",
              boxShadow:"0 32px 80px rgba(26,26,46,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
              display:"flex", flexDirection:"column",
              background:"white",
            }}>
              {/* Browser chrome */}
              <div style={{ background:"#2D2D2D", padding:"10px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <div style={{ display:"flex", gap:6 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} style={{ width:12,height:12,borderRadius:"50%",background:c }}/>)}
                </div>
                <div style={{ flex:1, background:"#1A1A1A", borderRadius:6, padding:"5px 14px", fontSize:12, color:"#9CA3AF", display:"flex", alignItems:"center", gap:8 }}>
                  <Icon name="shield" size={12} color="#10B981"/>
                  app.betterhumans.com/wearables
                </div>
              </div>
              {/* App layout */}
              <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
                <WebSidebar current={currentScreen} onChange={setCurrentScreen}/>
                <div style={{ flex:1, overflowY:"auto" }}>
                  {renderScreen()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Screen legend */}
        <div style={{ padding:"16px 24px", display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          {SCREENS.map(s=>(
            <button key={s} onClick={()=>setCurrentScreen(s)} style={{
              padding:"5px 12px", borderRadius:999, border:"none", cursor:"pointer",
              background: currentScreen===s ? "var(--p600)" : "rgba(255,255,255,0.6)",
              color: currentScreen===s ? "white" : "var(--text2)",
              fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
              transition:"all .15s", boxShadow: currentScreen===s?"0 2px 8px rgba(124,108,246,0.4)":"none",
            }}>
              {SCREEN_LABELS[s]}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
