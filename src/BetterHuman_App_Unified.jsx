import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// BETTER HUMAN — Unified Application
// Feature F-001: User Health Identity Profile
// Feature F-002: Multi-Wearable Integration Engine (Vital SDK)
// ══════════════════════════════════════════════════════════════════════════════

// ─── Design Tokens ───────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --p50:  #F5F3FF; --p100: #EDE9FE; --p200: #DDD6FE; --p300: #C4B5FD;
    --p400: #A78BFA; --p500: #8B5CF6; --p600: #7C6CF6; --p700: #6B5CE7;
    --p800: #5B4FD6; --p900: #4338CA;
    --navy: #1A1A2E; --navy2: #16213E; --navy3: #0F172A;
    --surface: #F8F7FF; --white: #FFFFFF;
    --text1: #1A1A2E; --text2: #4B4B6B; --text3: #8B8BAD;
    --success: #10B981; --warning: #F59E0B; --danger: #EF4444;
    --border: #E8E4FF;
    --vital: #5C34A4; --vital-light: #F0EBFF;
    --shadow:    0 4px 24px rgba(124,108,246,0.12);
    --shadow-lg: 0 12px 48px rgba(124,108,246,0.22);
    --radius: 16px; --radius-sm: 10px; --radius-lg: 24px;
  }

  body { font-family:'DM Sans',sans-serif; background:var(--surface); color:var(--text1); }
  .sora { font-family:'Sora',sans-serif; }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:var(--p300); border-radius:4px; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideR   { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin     { to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes waveform { 0%,100%{height:4px} 50%{height:16px} }
  @keyframes ping     { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2);opacity:0} }

  .fu  { animation:fadeUp  .45s cubic-bezier(.22,1,.36,1) both; }
  .fu1 { animation:fadeUp  .45s .08s cubic-bezier(.22,1,.36,1) both; }
  .fu2 { animation:fadeUp  .45s .16s cubic-bezier(.22,1,.36,1) both; }
  .fu3 { animation:fadeUp  .45s .24s cubic-bezier(.22,1,.36,1) both; }
  .fu4 { animation:fadeUp  .45s .32s cubic-bezier(.22,1,.36,1) both; }
  .sr  { animation:slideR  .4s  cubic-bezier(.22,1,.36,1) both; }
  .fi  { animation:fadeIn  .3s  ease both; }

  .scroll { overflow-y:auto; overflow-x:hidden; }
  .scroll::-webkit-scrollbar { width:3px; }

  .card {
    background:white; border-radius:var(--radius);
    border:1px solid var(--border); box-shadow:var(--shadow);
  }

  .input {
    width:100%; padding:12px 16px 12px 42px;
    border:1.5px solid var(--border); border-radius:var(--radius-sm);
    font-family:'DM Sans',sans-serif; font-size:14px;
    color:var(--text1); background:white;
    transition:all .2s; outline:none;
  }
  .input:focus { border-color:var(--p600); box-shadow:0 0 0 3px rgba(124,108,246,.12); }
  .input::placeholder { color:var(--text3); }
  .input.plain { padding-left:16px; }

  .btn-p {
    background:linear-gradient(135deg,var(--p600),var(--p800));
    color:white; border:none; border-radius:var(--radius-sm);
    padding:13px 24px; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer;
    transition:all .2s; box-shadow:0 4px 14px rgba(124,108,246,.35);
    width:100%;
  }
  .btn-p:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(124,108,246,.45); }

  .btn-o {
    background:transparent; color:var(--p600);
    border:1.5px solid var(--p300); border-radius:var(--radius-sm);
    padding:12px 24px; font-family:'DM Sans',sans-serif;
    font-size:14px; font-weight:600; cursor:pointer;
    transition:all .2s; width:100%;
  }
  .btn-o:hover { background:var(--p50); }

  .btn-v {
    background:linear-gradient(135deg,var(--vital),#7B4FC4);
    color:white; border:none; border-radius:var(--radius-sm);
    padding:12px 20px; font-family:'DM Sans',sans-serif;
    font-size:13px; font-weight:600; cursor:pointer;
    transition:all .2s; box-shadow:0 4px 14px rgba(92,52,164,.3);
  }
  .btn-v:hover { transform:translateY(-1px); }

  .btn-g {
    background:transparent; border:none; cursor:pointer;
    font-family:'DM Sans',sans-serif; padding:7px 12px;
    border-radius:var(--radius-sm); transition:all .15s;
    color:var(--text2); font-size:13px;
  }
  .btn-g:hover { background:var(--p50); color:var(--p700); }

  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:999px; font-size:11px; font-weight:600; }
  .b-green  { background:#D1FAE5; color:#065F46; }
  .b-amber  { background:#FEF3C7; color:#92400E; }
  .b-red    { background:#FEE2E2; color:#991B1B; }
  .b-gray   { background:#F3F4F6; color:#6B7280; }
  .b-purple { background:var(--p100); color:var(--p700); }
  .b-vital  { background:var(--vital-light); color:var(--vital); }

  .progress-bar { height:6px; border-radius:3px; background:var(--p100); overflow:hidden; }
  .progress-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--p600),var(--p400)); transition:width .6s cubic-bezier(.22,1,.36,1); }

  .tog-track { width:42px; height:23px; border-radius:999px; cursor:pointer; position:relative; transition:background .2s; }
  .tog-thumb { position:absolute; top:2.5px; width:18px; height:18px; border-radius:50%; background:white; box-shadow:0 1px 4px rgba(0,0,0,.2); transition:transform .2s; left:2.5px; }
  .tog-on  .tog-track { background:var(--p600); }
  .tog-on  .tog-thumb { transform:translateX(19px); }
  .tog-off .tog-track { background:#D1D5DB; }

  .wave-bar { width:3px; border-radius:2px; background:var(--p600); animation:waveform .8s ease-in-out infinite; }
  .wave-bar:nth-child(2){animation-delay:.1s} .wave-bar:nth-child(3){animation-delay:.2s}
  .wave-bar:nth-child(4){animation-delay:.3s} .wave-bar:nth-child(5){animation-delay:.2s}

  .nav-item {
    display:flex; align-items:center; gap:10px; padding:9px 12px;
    border-radius:10px; border:none; cursor:pointer; width:100%;
    font-family:'DM Sans',sans-serif; font-size:13px; text-align:left;
    transition:all .15s; background:transparent;
  }
  .nav-item:hover { background:rgba(124,108,246,.1); }
  .nav-item.active { background:rgba(124,108,246,.2); }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Logo = ({ size=36, text=true }) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="13" fill="url(#lg)"/>
      <rect x="18" y="10" width="12" height="12" rx="3" fill="white"/>
      <rect x="26" y="10" width="12" height="12" rx="3" fill="white" opacity=".7"/>
      <path d="M14 28Q12 24 16 22Q18 21 20 23L24 28L28 23Q30 21 32 22Q36 24 34 28L24 38Z" fill="white" opacity=".95"/>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#8B6CF6"/><stop offset="1" stopColor="#6B5CE7"/></linearGradient></defs>
    </svg>
    {text && <span className="sora" style={{fontSize:16,fontWeight:800,color:"white",letterSpacing:"-.01em"}}>Better<span style={{color:"#A78BFA"}}>Human</span></span>}
  </div>
);

const Toggle = ({ on, onChange }) => (
  <div className={`tog-on-state ${on?"tog-on":"tog-off"}`} onClick={()=>onChange(!on)}>
    <div className="tog-track"><div className="tog-thumb"/></div>
  </div>
);

const Spark = ({ data, color, h=26 }) => {
  const mx=Math.max(...data), mn=Math.min(...data), r=mx-mn||1;
  const W=52;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*W},${h-((v-mn)/r)*(h-4)+2}`).join(" ");
  const id=`sp${color.replace("#","")}`;
  return (
    <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} style={{overflow:"visible"}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor={color} stopOpacity=".22"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polyline points={`${pts} ${W},${h} 0,${h}`} fill={`url(#${id})`} stroke="none"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)/(data.length-1)*W} cy={h-((data[data.length-1]-mn)/r)*(h-4)+2} r="2.5" fill={color}/>
    </svg>
  );
};

const TrendLine = ({ data, color, range }) => {
  const sl = range===7?data.slice(-7):range===30?data.slice(-30):data;
  const mx=Math.max(...sl),mn=Math.min(...sl),r=mx-mn||1;
  const W=520,H=110;
  const avg=sl.map((_,i,a)=>{const w=a.slice(Math.max(0,i-6),i+1);return w.reduce((s,v)=>s+v,0)/w.length;});
  const pts=sl.map((v,i)=>`${(i/(sl.length-1))*W},${H-((v-mn)/r)*(H-12)+6}`).join(" ");
  const ap=avg.map((v,i)=>`${(i/(sl.length-1))*W},${H-((v-mn)/r)*(H-12)+6}`).join(" ");
  const gy=[0,.25,.5,.75,1].map(f=>H-f*(H-12)+6);
  const id=`tl${color.replace("#","")}`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",display:"block"}}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop stopColor={color} stopOpacity=".18"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {gy.map((y,i)=><line key={i} x1="0" y1={y} x2={W} y2={y} stroke="#E8E4FF" strokeWidth="1"/>)}
      <polyline points={`${pts} ${W},${H} 0,${H}`} fill={`url(#${id})`} stroke="none"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points={ap} fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
    </svg>
  );
};

const StatusDot = ({status}) => {
  const m={connected:{c:"#10B981",l:"Connected",b:"b-green"},syncing:{c:"#F59E0B",l:"Syncing",b:"b-amber"},error:{c:"#EF4444",l:"Error",b:"b-red"},never:{c:"#9CA3AF",l:"Not Connected",b:"b-gray"}};
  const {c,l,b}=m[status]||m.never;
  return <span className={`badge ${b}`}><span style={{width:6,height:6,borderRadius:"50%",background:c,display:"inline-block",...(status==="syncing"?{animation:"pulse 1.2s ease infinite"}:{})}}/>{l}</span>;
};

const VitalBadge = () => (
  <span className="badge b-vital">
    <span style={{width:5,height:5,borderRadius:"50%",background:"var(--vital)",display:"inline-block"}}/>
    Vital SDK
  </span>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const WEARABLES = [
  {id:"apple",  name:"Apple Health",   emoji:"🍎", status:"connected", type:"sdk",   lastSync:"2 min ago", prog:100},
  {id:"oura",   name:"Oura Ring",      emoji:"💍", status:"connected", type:"oauth", lastSync:"8 min ago", prog:100},
  {id:"whoop",  name:"WHOOP",          emoji:"💪", status:"syncing",   type:"oauth", lastSync:"Syncing",   prog:67},
  {id:"garmin", name:"Garmin Connect", emoji:"⌚", status:"never",     type:"oauth", lastSync:"—",         prog:0},
  {id:"fitbit", name:"Fitbit",         emoji:"🏃", status:"never",     type:"oauth", lastSync:"—",         prog:0},
];
const METRICS = [
  {id:"hrv",     label:"HRV",        value:"62",    unit:"ms",      delta:"+8%", pos:true,  color:"#7C6CF6", data:[44,51,49,55,58,60,62]},
  {id:"steps",   label:"Steps",      value:"9,247", unit:"today",   delta:"+12%",pos:true,  color:"#10B981", data:[7200,8100,6900,9500,8800,7600,9247]},
  {id:"rhr",     label:"Resting HR", value:"58",    unit:"bpm",     delta:"-3%", pos:true,  color:"#EF4444", data:[63,61,60,59,59,58,58]},
  {id:"sleep",   label:"Sleep",      value:"7h 24m",unit:"last night",delta:"+18m",pos:true,color:"#3B82F6", data:[6.1,6.8,7.0,6.5,7.2,6.9,7.4]},
  {id:"calories",label:"Active Cal", value:"487",   unit:"kcal",    delta:"+5%", pos:true,  color:"#F59E0B", data:[320,410,380,450,420,390,487]},
  {id:"spo2",    label:"Blood O₂",   value:"98",    unit:"%",       delta:"0%",  pos:true,  color:"#06B6D4", data:[97,98,97,98,98,98,98]},
];
const TREND = {
  hrv:  {v:[44,51,49,55,58,53,60,57,62,59,64,61,66,62,65,60,63,67,64,62,65,68,63,66,62,65,62,65,60,62],label:"HRV (rMSSD)",unit:"ms",  color:"#7C6CF6"},
  steps:{v:[7200,8100,6900,9500,8800,7600,9200,8400,10100,7800,9300,8600,9800,8200,9100,7500,8800,9400,8100,9600,7900,8700,9200,8500,9100,7700,9300,8800,9100,9247],label:"Daily Steps",unit:"steps",color:"#10B981"},
  rhr:  {v:[65,64,63,62,62,63,61,60,60,59,59,60,59,58,59,58,59,58,58,57,58,58,57,58,58,57,58,57,58,58],label:"Resting HR",unit:"bpm", color:"#EF4444"},
  sleep:{v:[6.1,6.8,7.0,6.5,7.2,6.9,7.4,6.8,7.1,6.6,7.3,7.0,6.7,7.2,6.9,7.4,6.8,7.1,7.3,6.9,7.2,7.0,7.5,6.8,7.1,7.3,7.0,6.9,7.2,7.4],label:"Sleep Duration",unit:"hrs",color:"#3B82F6"},
};
const GOALS_DATA = [
  {icon:"😴",label:"Improve Sleep",progress:65,color:"#6B5CE7",target:"7h 30m avg",date:"Apr 2025",status:"active"},
  {icon:"⚡",label:"Optimize Energy",progress:40,color:"#F59E0B",target:"Energy score > 80",date:"Jun 2025",status:"active"},
  {icon:"🧘",label:"Reduce Stress",progress:100,color:"#10B981",target:"Cortisol normal",date:"Mar 2025",status:"achieved"},
  {icon:"⚖️",label:"Lose Weight",progress:22,color:"#EF4444",target:"Target: 155 lbs",date:"Dec 2025",status:"active"},
];
const TIMELINE_DATA = [
  {date:"Mar 8, 2025",title:"Biomarker Panel Completed",summary:"13 markers · 9 optimal, 3 normal, 1 attention needed",icon:"🔬",color:"#7C6CF6",tag:"Lab Result"},
  {date:"Mar 5, 2025",title:"Apple Health + Oura Connected",summary:"Vital SDK sync active · 90 days of historical data imported",icon:"📡",color:"#5C34A4",tag:"Wearable"},
  {date:"Mar 1, 2025",title:"Goal Achieved: Reduce Stress",summary:"Cortisol levels returned to normal range — HRV improved 18%",icon:"🎯",color:"#10B981",tag:"Achievement"},
  {date:"Feb 25, 2025",title:"7-Day Sleep Streak",summary:"Avg 7h 45m · WHOOP recovery score 88% avg",icon:"😴",color:"#6B5CE7",tag:"Milestone"},
  {date:"Feb 20, 2025",title:"Health Note",summary:"Started intermittent fasting protocol (16:8)",icon:"📝",color:"#F59E0B",tag:"Note"},
  {date:"Jan 15, 2025",title:"Baseline Panel Completed",summary:"First biomarker assessment established on the platform",icon:"🔬",color:"#7C6CF6",tag:"Lab Result"},
];

// ══════════════════════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════════════════════

// ── Login ─────────────────────────────────────────────────────────────────────
const LoginScreen = ({nav}) => {
  const [sp, setSp] = useState(false);
  return (
    <div style={{minHeight:780,background:"linear-gradient(160deg,#F5F3FF,#EDE9FE 40%,#F8F7FF)",padding:"52px 26px 40px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div className="fu" style={{marginBottom:8,animation:"float 3s ease-in-out infinite"}}>
        <svg width={52} height={52} viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="13" fill="url(#lgi)"/><rect x="18" y="10" width="12" height="12" rx="3" fill="white"/><rect x="26" y="10" width="12" height="12" rx="3" fill="white" opacity=".7"/><path d="M14 28Q12 24 16 22Q18 21 20 23L24 28L28 23Q30 21 32 22Q36 24 34 28L24 38Z" fill="white" opacity=".95"/><defs><linearGradient id="lgi" x1="0" y1="0" x2="48" y2="48"><stop stopColor="#8B6CF6"/><stop offset="1" stopColor="#6B5CE7"/></linearGradient></defs></svg>
      </div>
      <h1 className="sora fu1" style={{fontSize:25,fontWeight:800,color:"#1A1A2E",marginTop:14,marginBottom:4}}>Welcome Back</h1>
      <p className="fu2" style={{fontSize:13,color:"#6B6B9B",marginBottom:32}}>Your preventive health, intelligently managed</p>
      <div className="card fu3" style={{width:"100%",padding:"26px 22px",borderRadius:20}}>
        <h2 className="sora" style={{fontSize:17,fontWeight:700,marginBottom:18,textAlign:"center",color:"#1A1A2E"}}>Sign In</h2>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:12,fontWeight:500,color:"#4B4B6B",marginBottom:5}}>Email</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#A78BFA",fontSize:15}}>✉</span>
            <input className="input" type="email" placeholder="alex@company.com"/>
          </div>
        </div>
        <div style={{marginBottom:6}}>
          <label style={{display:"block",fontSize:12,fontWeight:500,color:"#4B4B6B",marginBottom:5}}>Password</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"#A78BFA",fontSize:15}}>🔒</span>
            <input className="input" type={sp?"text":"password"} placeholder="Enter password" style={{paddingRight:42}}/>
            <button onClick={()=>setSp(!sp)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#A78BFA",fontSize:14}}>{sp?"🙈":"👁"}</button>
          </div>
        </div>
        <div style={{textAlign:"right",marginBottom:18}}>
          <span style={{fontSize:12,color:"#7C6CF6",cursor:"pointer",fontWeight:500}}>Forgot password?</span>
        </div>
        <button className="btn-p" onClick={()=>nav("onboarding_1")}>Sign In →</button>
        <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}>
          <div style={{flex:1,height:1,background:"#EDE9FE"}}/><span style={{fontSize:11,color:"#B0B0C8"}}>or continue with</span><div style={{flex:1,height:1,background:"#EDE9FE"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["🍎","Apple"],["🔵","Google"]].map(([ic,lb])=>(
            <button key={lb} style={{flex:1,padding:"10px",borderRadius:10,border:"1.5px solid #EDE9FE",background:"white",cursor:"pointer",fontSize:13,fontWeight:500,color:"#4B4B6B",display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontFamily:"'DM Sans',sans-serif"}}><span style={{fontSize:16}}>{ic}</span>{lb}</button>
          ))}
        </div>
        <p style={{textAlign:"center",marginTop:18,fontSize:12,color:"#8B8BAD"}}>New here? <span style={{color:"#7C6CF6",fontWeight:600,cursor:"pointer"}} onClick={()=>nav("onboarding_1")}>Create account</span></p>
      </div>
    </div>
  );
};

// ── Onboarding Steps ──────────────────────────────────────────────────────────
const OBProgress = ({step}) => {
  const steps=["Basic Info","Body Stats","Health History","Goals","Devices"];
  return (
    <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:22}}>
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",flex:i<steps.length-1?1:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:i<step?"#7C6CF6":i===step?"white":"#F0EDFF",border:i===step?"2px solid #7C6CF6":i<step?"none":"2px solid #DDD6FE",display:"flex",alignItems:"center",justifyContent:"center",color:i<step?"white":i===step?"#7C6CF6":"#A78BFA",fontSize:11,fontWeight:700,fontFamily:"'Sora',sans-serif",boxShadow:i===step?"0 0 0 3px rgba(124,108,246,.15)":"none",transition:"all .3s"}}>
              {i<step?"✓":i+1}
            </div>
            <span style={{fontSize:9,color:i===step?"#7C6CF6":"#A78BFA",fontWeight:i===step?600:400,whiteSpace:"nowrap"}}>{s}</span>
          </div>
          {i<steps.length-1&&<div style={{flex:1,height:2,background:i<step?"#7C6CF6":"#EDE9FE",margin:"0 4px",marginBottom:14,transition:"all .3s"}}/>}
        </div>
      ))}
    </div>
  );
};

const OB1 = ({nav}) => (
  <div style={{minHeight:780,background:"#F8F7FF",padding:"22px 22px 36px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><Logo size={28} text/><span className="badge b-purple">Step 1 of 5</span></div>
    <OBProgress step={1}/>
    <h2 className="sora" style={{fontSize:19,fontWeight:700,marginBottom:4}}>Basic Information</h2>
    <p style={{fontSize:12,color:"#8B8BAD",marginBottom:18}}>Your health profile starts here</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      {[{l:"First Name",ph:"Alex",ic:"👤"},{l:"Last Name",ph:"Johnson",ic:"👤"}].map(f=>(
        <div key={f.l}><label style={{display:"block",fontSize:11,fontWeight:500,color:"#6B6B9B",marginBottom:4}}>{f.l}</label><div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>{f.ic}</span><input className="input" placeholder={f.ph}/></div></div>
      ))}
    </div>
    {[{l:"Email",ph:"alex@company.com",ic:"✉"},{l:"Phone",ph:"+1 (555) 000-0000",ic:"📱"}].map(f=>(
      <div key={f.l} style={{marginBottom:12}}><label style={{display:"block",fontSize:11,fontWeight:500,color:"#6B6B9B",marginBottom:4}}>{f.l}</label><div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#A78BFA",fontSize:14}}>{f.ic}</span><input className="input" placeholder={f.ph}/></div></div>
    ))}
    <div style={{marginBottom:14}}><label style={{display:"block",fontSize:11,fontWeight:500,color:"#6B6B9B",marginBottom:4}}>Date of Birth</label><div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>🎂</span><input className="input" placeholder="MM / DD / YYYY"/></div></div>
    <div style={{marginBottom:22}}><label style={{display:"block",fontSize:11,fontWeight:500,color:"#6B6B9B",marginBottom:6}}>Biological Sex</label><div style={{display:"flex",gap:7}}>{["Male","Female","Intersex","Prefer not to say"].map((o,i)=><button key={o} style={{flex:1,padding:"9px 4px",borderRadius:9,fontSize:10,fontWeight:500,cursor:"pointer",transition:"all .2s",background:i===0?"#7C6CF6":"white",color:i===0?"white":"#6B6B9B",border:i===0?"none":"1.5px solid #EDE9FE",fontFamily:"'DM Sans',sans-serif"}}>{o}</button>)}</div></div>
    <button className="btn-p" onClick={()=>nav("onboarding_2")}>Continue →</button>
  </div>
);

const OB2 = ({nav}) => (
  <div style={{minHeight:780,background:"#F8F7FF",padding:"22px 22px 36px"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><Logo size={28} text/><span className="badge b-purple">Step 2 of 5</span></div>
    <OBProgress step={2}/>
    <h2 className="sora" style={{fontSize:19,fontWeight:700,marginBottom:4}}>Body Stats</h2>
    <p style={{fontSize:12,color:"#8B8BAD",marginBottom:14}}>Used to calculate biological age & BMI</p>
    <div className="fu" style={{display:"inline-flex",alignItems:"center",gap:6,background:"#EDE9FE",borderRadius:8,padding:"5px 12px",marginBottom:16}}>
      <span style={{fontSize:13}}>🇺🇸</span><span style={{fontSize:12,fontWeight:600,color:"#7C6CF6"}}>US Imperial (ft, lbs, in)</span>
    </div>
    <div className="fu1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
      {[{l:"Height",ph:'5\'10"',ic:"📏"},{l:"Weight",ph:"165 lbs",ic:"⚖️"},{l:"Body Fat %",ph:"e.g. 18%",ic:"💪"},{l:"Waist",ph:'32"',ic:"📐"}].map(f=>(
        <div key={f.l}><label style={{display:"block",fontSize:11,fontWeight:500,color:"#6B6B9B",marginBottom:4}}>{f.l}</label><div style={{position:"relative"}}><span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>{f.ic}</span><input className="input" placeholder={f.ph}/></div></div>
      ))}
    </div>
    <div className="fu2 card" style={{padding:"14px 18px",marginBottom:18,background:"linear-gradient(135deg,#EDE9FE,#F5F3FF)",border:"none"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:11,color:"#8B6CF6",fontWeight:500}}>Estimated BMI</p><p className="sora" style={{fontSize:26,fontWeight:800,color:"#4338CA"}}>23.4</p></div>
        <div style={{textAlign:"right"}}><span className="badge b-green">✓ Normal</span><p style={{fontSize:10,color:"#8B8BAD",marginTop:3}}>Auto-calculated</p></div>
      </div>
      <div style={{marginTop:8,height:5,background:"rgba(255,255,255,.5)",borderRadius:3,overflow:"hidden"}}>
        <div style={{width:"45%",height:"100%",background:"linear-gradient(90deg,#10B981,#7C6CF6)",borderRadius:3}}/>
      </div>
    </div>
    <div style={{display:"flex",gap:8}}>
      <button className="btn-o" onClick={()=>nav("onboarding_1")} style={{width:"auto",padding:"12px 18px"}}>← Back</button>
      <button className="btn-p" onClick={()=>nav("onboarding_3")}>Continue →</button>
    </div>
  </div>
);

const OB3 = ({nav}) => {
  const conds=["Type 2 Diabetes","Hypertension","High Cholesterol","Heart Disease","Thyroid Disorder","Sleep Apnea","Asthma","Anxiety/Depression","Arthritis","None of the above"];
  const [sel,setSel]=useState(new Set(["None of the above"]));
  const tog=c=>{const s=new Set(sel);s.has(c)?s.delete(c):s.add(c);setSel(s);};
  return (
    <div style={{minHeight:780,background:"#F8F7FF",padding:"22px 22px 36px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><Logo size={28} text/><span className="badge b-purple">Step 3 of 5</span></div>
      <OBProgress step={3}/>
      <h2 className="sora" style={{fontSize:19,fontWeight:700,marginBottom:4}}>Health History</h2>
      <p style={{fontSize:12,color:"#8B8BAD",marginBottom:16}}>Personalizes your risk assessment and AI insights</p>
      <div className="fu" style={{marginBottom:16}}>
        <label style={{fontSize:12,fontWeight:600,color:"#4B4B6B",display:"block",marginBottom:8}}>Existing Conditions</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
          {conds.map(c=><button key={c} onClick={()=>tog(c)} style={{padding:"7px 11px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",transition:"all .2s",background:sel.has(c)?"#7C6CF6":"white",color:sel.has(c)?"white":"#6B6B9B",border:sel.has(c)?"none":"1.5px solid #EDE9FE",fontFamily:"'DM Sans',sans-serif"}}>{c}</button>)}
        </div>
      </div>
      <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#4B4B6B",display:"block",marginBottom:6}}>Current Medications</label><textarea className="input plain" placeholder="e.g. Metformin 500mg daily..." style={{height:72,resize:"none",paddingTop:10}}/></div>
      <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#4B4B6B",display:"block",marginBottom:6}}>Known Allergies</label><input className="input plain" placeholder="e.g. Penicillin, Shellfish..."/></div>
      <div style={{marginBottom:20}}><label style={{fontSize:12,fontWeight:600,color:"#4B4B6B",display:"block",marginBottom:6}}>Family Medical History</label><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Heart Disease","Diabetes","Cancer","Stroke","Alzheimer's","None known"].map(f=><button key={f} style={{padding:"6px 11px",borderRadius:20,fontSize:11,border:"1.5px solid #EDE9FE",background:"white",color:"#6B6B9B",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{f}</button>)}</div></div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn-o" onClick={()=>nav("onboarding_2")} style={{width:"auto",padding:"12px 18px"}}>← Back</button>
        <button className="btn-p" onClick={()=>nav("onboarding_4")}>Continue →</button>
      </div>
    </div>
  );
};

const OB4 = ({nav}) => {
  const gs=[{ic:"⚖️",lb:"Lose Weight",c:"#F59E0B"},{ic:"💪",lb:"Build Muscle",c:"#10B981"},{ic:"😴",lb:"Improve Sleep",c:"#6B5CE7"},{ic:"🧘",lb:"Reduce Stress",c:"#8B5CF6"},{ic:"⚡",lb:"Optimize Energy",c:"#F59E0B"},{ic:"🫀",lb:"Heart Health",c:"#EF4444"},{ic:"🔬",lb:"Prevent Disease",c:"#0EA5E9"},{ic:"⚗️",lb:"Balance Hormones",c:"#10B981"}];
  const [sel,setSel]=useState(new Set(["Improve Sleep","Optimize Energy"]));
  return (
    <div style={{minHeight:780,background:"#F8F7FF",padding:"22px 22px 36px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><Logo size={28} text/><span className="badge b-purple">Step 4 of 5</span></div>
      <OBProgress step={4}/>
      <h2 className="sora" style={{fontSize:19,fontWeight:700,marginBottom:4}}>Health Goals</h2>
      <p style={{fontSize:12,color:"#8B8BAD",marginBottom:16}}>Select up to 5 goals</p>
      <div className="fu" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:18}}>
        {gs.map(g=>{const s=sel.has(g.lb);return(
          <button key={g.lb} onClick={()=>{const ns=new Set(sel);ns.has(g.lb)?ns.delete(g.lb):ns.size<5&&ns.add(g.lb);setSel(ns);}} style={{padding:"14px 10px",borderRadius:13,border:s?"none":"1.5px solid #EDE9FE",background:s?`linear-gradient(135deg,${g.c}22,${g.c}11)`:"white",cursor:"pointer",transition:"all .2s",textAlign:"center",boxShadow:s?`0 4px 14px ${g.c}30`:"none",fontFamily:"'DM Sans',sans-serif"}}>
            <div style={{fontSize:26,marginBottom:5}}>{g.ic}</div>
            <div style={{fontSize:11,fontWeight:s?600:400,color:s?g.c:"#6B6B9B"}}>{g.lb}</div>
            {s&&<div style={{width:18,height:18,borderRadius:"50%",background:g.c,color:"white",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",margin:"6px auto 0"}}>✓</div>}
          </button>
        );})}
      </div>
      <div className="card" style={{padding:"12px 14px",marginBottom:16,background:"#F5F3FF",border:"none"}}>
        <p style={{fontSize:12,color:"#7C6CF6",fontWeight:600}}>🎯 {sel.size} of 5 goals selected</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:6}}>{[...sel].map(s=><span key={s} className="badge b-purple">{s}</span>)}</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn-o" onClick={()=>nav("onboarding_3")} style={{width:"auto",padding:"12px 18px"}}>← Back</button>
        <button className="btn-p" onClick={()=>nav("onboarding_5")}>Continue →</button>
      </div>
    </div>
  );
};

// ── Onboarding Step 5: Connect Wearables (NEW — bridges F001 → F002) ─────────
const OB5 = ({nav}) => {
  const [connected, setConnected] = useState(new Set(["apple"]));
  const [linking, setLinking] = useState(null);
  const handleConnect = (id) => {
    if (id === "apple") { setConnected(p => new Set([...p, id])); return; }
    setLinking(id);
    setTimeout(() => { setConnected(p => new Set([...p, id])); setLinking(null); }, 1800);
  };
  return (
    <div style={{minHeight:780,background:"#F8F7FF",padding:"22px 22px 36px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><Logo size={28} text/><span className="badge b-purple">Step 5 of 5</span></div>
      <OBProgress step={5}/>
      <h2 className="sora" style={{fontSize:19,fontWeight:700,marginBottom:4}}>Connect Your Devices</h2>
      <p style={{fontSize:12,color:"#8B8BAD",marginBottom:6}}>Unlock real-time biometrics, biological age tracking, and AI insights</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:8,background:"var(--vital-light)",marginBottom:16,border:"1px solid #D8C4FF"}}>
        <span style={{fontSize:11,fontWeight:600,color:"var(--vital)"}}>⚡ Powered by Vital SDK · link.tryvital.io</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        {WEARABLES.map(w=>{
          const done=connected.has(w.id);
          const loading=linking===w.id;
          return(
            <div key={w.id} className="card fu" style={{padding:"12px 14px",border:done?"1.5px solid #A7F3D0":"1px solid var(--border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{w.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--navy)"}}>{w.name}</span>
                    <span style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:w.type==="sdk"?"#E0E7FF":"var(--vital-light)",color:w.type==="sdk"?"#3730A3":"var(--vital)",fontWeight:600}}>{w.type==="sdk"?"SDK":"OAuth"}</span>
                  </div>
                  {done?<span className="badge b-green" style={{fontSize:10,marginTop:2}}>✓ Connected</span>:<span style={{fontSize:11,color:"var(--text3)"}}>Not connected</span>}
                </div>
                {done?<span style={{fontSize:18}}>✅</span>:loading?<div style={{width:20,height:20,borderRadius:"50%",border:"2.5px solid var(--p100)",borderTopColor:"var(--vital)",animation:"spin .8s linear infinite"}}/>:
                  <button className="btn-v" style={{padding:"7px 13px",fontSize:11}} onClick={()=>handleConnect(w.id)}>Connect</button>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn-o" onClick={()=>nav("onboarding_4")} style={{width:"auto",padding:"12px 18px"}}>← Back</button>
        <button className="btn-p" onClick={()=>nav("profile")}>{connected.size>1?"Finish Setup ✓":"Skip for now →"}</button>
      </div>
    </div>
  );
};

// ── Profile Overview ──────────────────────────────────────────────────────────
const ProfileScreen = ({nav}) => (
  <div style={{minHeight:780,background:"#F8F7FF"}}>
    <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 28px",borderRadius:"0 0 26px 26px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <Logo size={28}/>
        <div style={{display:"flex",gap:7}}>
          <button onClick={()=>nav("wearables")} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.1)",border:"none",cursor:"pointer",color:"white",fontSize:15}}>📡</button>
          <button onClick={()=>nav("timeline")} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.1)",border:"none",cursor:"pointer",color:"white",fontSize:15}}>🔔</button>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{position:"relative"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C6CF6)",display:"flex",alignItems:"center",justifyContent:"center",border:"3px solid rgba(255,255,255,.3)",fontSize:26}}>👤</div>
          <div style={{position:"absolute",bottom:0,right:0,width:18,height:18,borderRadius:"50%",background:"#10B981",border:"2px solid #1A1A2E"}}/>
        </div>
        <div>
          <h2 className="sora" style={{color:"white",fontSize:19,fontWeight:700}}>Alex Johnson</h2>
          <p style={{color:"#A78BFA",fontSize:12}}>Member since Jan 2024</p>
          <span className="badge" style={{background:"rgba(167,139,250,.2)",color:"#C4B5FD",fontSize:10,marginTop:4}}>🏢 TechCorp Wellness</span>
        </div>
      </div>
      <div style={{marginTop:16,background:"rgba(255,255,255,.08)",borderRadius:10,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:11,color:"#C4B5FD"}}>Profile Completeness</span>
          <span className="sora" style={{fontSize:12,fontWeight:700,color:"white"}}>78%</span>
        </div>
        <div style={{height:5,background:"rgba(255,255,255,.15)",borderRadius:3}}>
          <div style={{width:"78%",height:"100%",background:"linear-gradient(90deg,#A78BFA,#7C6CF6)",borderRadius:3}}/>
        </div>
      </div>
    </div>
    <div style={{padding:"18px 22px"}}>
      <div className="fu" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:18}}>
        {[{l:"Age",v:"32",s:"years",ic:"🎂"},{l:"BMI",v:"23.4",s:"Normal",ic:"⚖️"},{l:"Bio Age",v:"28",s:"↓ 4 yrs",ic:"🧬"}].map(s=>(
          <div key={s.l} className="card" style={{padding:"12px 10px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:3}}>{s.ic}</div>
            <div className="sora" style={{fontSize:19,fontWeight:800,color:"#1A1A2E"}}>{s.v}</div>
            <div style={{fontSize:9,color:"#8B8BAD"}}>{s.l}</div>
            <div style={{fontSize:9,color:s.l==="Bio Age"?"#10B981":"#7C6CF6",fontWeight:500}}>{s.s}</div>
          </div>
        ))}
      </div>
      {/* Wearable quick status */}
      <div className="fu1 card" style={{padding:"12px 14px",marginBottom:14,cursor:"pointer"}} onClick={()=>nav("wearables")}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:13,fontWeight:700,color:"var(--navy)"}}>📡 Wearable Sync</span>
          <span style={{fontSize:11,color:"var(--p600)",fontWeight:500}}>Manage →</span>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {WEARABLES.filter(w=>w.status!=="never").map(w=><div key={w.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",borderRadius:7,background:"#F9FAFB",border:"1px solid var(--border)",fontSize:11}}><span>{w.emoji}</span><StatusDot status={w.status}/></div>)}
        </div>
        {/* Live metrics mini-strip */}
        <div style={{display:"flex",gap:8,marginTop:10,overflowX:"auto",paddingBottom:2}}>
          {METRICS.slice(0,4).map(m=>(
            <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 10px",borderRadius:8,background:"var(--p50)",minWidth:62,flexShrink:0}}>
              <span className="sora" style={{fontSize:13,fontWeight:700,color:m.color}}>{m.value}</span>
              <span style={{fontSize:9,color:"var(--text3)"}}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="fu2" style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 className="sora" style={{fontSize:14,fontWeight:700}}>Active Goals</h3>
          <span style={{fontSize:11,color:"#7C6CF6",cursor:"pointer",fontWeight:500}} onClick={()=>nav("goals")}>Manage →</span>
        </div>
        {GOALS_DATA.filter(g=>g.status==="active").slice(0,2).map(g=>(
          <div key={g.label} className="card" style={{padding:"11px 13px",marginBottom:7}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:12,fontWeight:500}}>{g.icon} {g.label}</span><span style={{fontSize:11,fontWeight:700,color:g.color}}>{g.progress}%</span></div>
            <div style={{height:4,background:"#F0EDFF",borderRadius:2}}><div style={{width:`${g.progress}%`,height:"100%",background:g.color,borderRadius:2}}/></div>
          </div>
        ))}
      </div>
      <div className="fu3" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {[{ic:"📊",lb:"Timeline",sc:"timeline"},{ic:"🎯",lb:"Goals",sc:"goals"},{ic:"📡",lb:"Devices",sc:"wearables"},{ic:"🔒",lb:"Privacy",sc:"privacy"}].map(n=>(
          <button key={n.lb} onClick={()=>nav(n.sc)} className="card" style={{padding:"14px",display:"flex",alignItems:"center",gap:9,border:"none",cursor:"pointer",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
            <span style={{fontSize:20}}>{n.ic}</span><span style={{fontSize:12,fontWeight:600,color:"#1A1A2E"}}>{n.lb}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── Health Timeline ───────────────────────────────────────────────────────────
const TimelineScreen = ({nav}) => {
  const [filter, setFilter] = useState("All");
  const filters=["All","Lab Results","Wearable","Goals","Notes"];
  const filtered=filter==="All"?TIMELINE_DATA:TIMELINE_DATA.filter(e=>{
    if(filter==="Lab Results") return e.tag==="Lab Result";
    if(filter==="Wearable") return e.tag==="Wearable"||e.tag==="Milestone";
    if(filter==="Goals") return e.tag==="Achievement";
    if(filter==="Notes") return e.tag==="Note";
    return true;
  });
  return (
    <div style={{minHeight:780,background:"#F8F7FF"}}>
      <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 16px",borderRadius:"0 0 22px 22px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <button onClick={()=>nav("profile")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:13}}>← Back</button>
          <h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>Health Timeline</h2>
        </div>
        <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4}}>
          {filters.map(f=><button key={f} onClick={()=>setFilter(f)} style={{whiteSpace:"nowrap",padding:"5px 13px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:500,background:filter===f?"#7C6CF6":"rgba(255,255,255,.1)",color:"white",fontFamily:"'DM Sans',sans-serif"}}>{f}</button>)}
        </div>
      </div>
      <div style={{padding:"18px 22px"}}>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:18,top:0,bottom:0,width:2,background:"linear-gradient(180deg,#7C6CF6,#EDE9FE)",borderRadius:2}}/>
          {filtered.map((e,i)=>(
            <div key={i} className="fu" style={{display:"flex",gap:14,marginBottom:14,position:"relative",animationDelay:`${i*.06}s`}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:"white",border:`2px solid ${e.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,zIndex:1,boxShadow:`0 0 0 3px ${e.color}18`}}>{e.icon}</div>
              <div className="card" style={{flex:1,padding:"11px 13px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600,color:"#1A1A2E"}}>{e.title}</span>
                  <span className="badge" style={{background:`${e.color}15`,color:e.color,fontSize:9}}>{e.tag}</span>
                </div>
                <p style={{fontSize:11,color:"#8B8BAD",marginBottom:3}}>{e.summary}</p>
                <span style={{fontSize:10,color:"#B8B8D0"}}>{e.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",marginTop:8}}>
          <button className="btn-p" style={{width:"auto",padding:"11px 26px",borderRadius:30}}>+ Add Health Note</button>
        </div>
      </div>
    </div>
  );
};

// ── Goals ─────────────────────────────────────────────────────────────────────
const GoalsScreen = ({nav}) => (
  <div style={{minHeight:780,background:"#F8F7FF"}}>
    <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 18px",borderRadius:"0 0 22px 22px"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
        <button onClick={()=>nav("profile")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:13}}>← Back</button>
        <h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>Health Goals</h2>
      </div>
      <p style={{color:"#A78BFA",fontSize:12,marginLeft:60}}>4 goals · 1 achieved</p>
    </div>
    <div style={{padding:"18px 22px"}}>
      {GOALS_DATA.map((g,i)=>(
        <div key={g.label} className={`card fu${i}`} style={{padding:"14px",marginBottom:10,borderLeft:`4px solid ${g.color}`,position:"relative",overflow:"hidden",animationDelay:`${i*.07}s`}}>
          {g.status==="achieved"&&<div style={{position:"absolute",top:10,right:10}}><span className="badge b-green">✓ Achieved</span></div>}
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:42,height:42,borderRadius:11,background:`${g.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{g.icon}</div>
            <div style={{flex:1}}>
              <h4 style={{fontSize:13,fontWeight:700,color:"#1A1A2E",marginBottom:2}}>{g.label}</h4>
              <p style={{fontSize:11,color:"#8B8BAD",marginBottom:7}}>{g.target} · {g.date}</p>
              <div style={{height:5,background:"#F0EDFF",borderRadius:3}}><div style={{width:`${g.progress}%`,height:"100%",background:g.status==="achieved"?"#10B981":g.color,borderRadius:3}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}><span style={{fontSize:10,color:"#B8B8D0"}}>Progress</span><span style={{fontSize:11,fontWeight:700,color:g.color}}>{g.progress}%</span></div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn-o" style={{marginTop:6}}>+ Add New Goal</button>
    </div>
  </div>
);

// ── Privacy ───────────────────────────────────────────────────────────────────
const PrivacyScreen = ({nav}) => {
  const [s,setS]=useState({employerAnon:true,wearableShare:false,biomarkerShare:true,aiTraining:false,research:false,email:true});
  const tog=k=>setS(p=>({...p,[k]:!p[k]}));
  const groups=[{title:"Employer Visibility",icon:"🏢",items:[{k:"employerAnon",l:"Share anonymized wellness data",sub:"Employer sees aggregate trends only — never individual results"},{k:"biomarkerShare",l:"Include biomarker results",sub:"Aggregate participation rates shared with HR dashboard"}]},{title:"Data Sharing",icon:"🔗",items:[{k:"wearableShare",l:"Share wearable data externally",sub:"Allow third-party wellness integrations to access step/sleep data"},{k:"aiTraining",l:"Contribute to AI model training",sub:"Help improve Better Human AI using de-identified data"},{k:"research",l:"Research participation",sub:"Join anonymized population health studies"}]},{title:"Communications",icon:"✉️",items:[{k:"email",l:"Health insight emails",sub:"Weekly health summaries and goal progress updates"}]}];
  return (
    <div style={{minHeight:780,background:"#F8F7FF"}}>
      <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 18px",borderRadius:"0 0 22px 22px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>nav("profile")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:13}}>← Back</button>
          <div><h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>Privacy & Consent</h2><p style={{color:"#A78BFA",fontSize:11,marginTop:1}}>Your data, your control</p></div>
        </div>
      </div>
      <div style={{padding:"14px 22px"}}>
        <div className="fu" style={{background:"linear-gradient(135deg,#EDE9FE,#F5F3FF)",borderRadius:12,padding:"10px 14px",marginBottom:14,border:"1px solid #DDD6FE"}}>
          <p style={{fontSize:12,color:"#5B4FD6",fontWeight:600}}>🔒 HIPAA Protected</p>
          <p style={{fontSize:11,color:"#7C6CF6",marginTop:2}}>Your health data is encrypted and protected. A BAA is in place with your employer.</p>
        </div>
        {groups.map((g,gi)=>(
          <div key={g.title} className={`fu${gi}`} style={{marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}><span style={{fontSize:14}}>{g.icon}</span><h3 style={{fontSize:13,fontWeight:700,color:"#1A1A2E"}}>{g.title}</h3></div>
            <div className="card" style={{overflow:"hidden"}}>
              {g.items.map((item,ii)=>(
                <div key={item.k} style={{padding:"13px 14px",borderBottom:ii<g.items.length-1?"1px solid #F0EDFF":"none",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}><p style={{fontSize:12,fontWeight:500,color:"#1A1A2E",marginBottom:2}}>{item.l}</p><p style={{fontSize:11,color:"#8B8BAD"}}>{item.sub}</p></div>
                  <Toggle on={s[item.k]} onChange={()=>tog(item.k)}/>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn-p" style={{marginTop:6}}>Save Settings</button>
      </div>
    </div>
  );
};

// ── Wearables Hub ─────────────────────────────────────────────────────────────
const WearablesScreen = ({nav}) => {
  const [linking, setLinking] = useState(null);
  const [wearables, setWearables] = useState(WEARABLES);
  const handleConnect = (id) => {
    setLinking(id);
    setTimeout(()=>{
      setWearables(w=>w.map(x=>x.id===id?{...x,status:"syncing",lastSync:"Syncing...",prog:10}:x));
      setLinking(null);
    },1600);
  };
  return (
    <div style={{minHeight:780,background:"#F8F7FF"}}>
      <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 20px",borderRadius:"0 0 22px 22px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <button onClick={()=>nav("profile")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:13}}>← Back</button>
          <div>
            <h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>Connected Devices</h2>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}><VitalBadge/><span style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>link.tryvital.io</span></div>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,.06)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:"#10B981",display:"inline-block",animation:"pulse 1.5s ease infinite"}}/>
          <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>2 devices active · Live biometric sync</span>
        </div>
      </div>
      <div style={{padding:"16px 22px",display:"flex",flexDirection:"column",gap:10}}>
        {wearables.map((w,i)=>(
          <div key={w.id} className="card fu" style={{padding:"13px 14px",animationDelay:`${i*.06}s`,border:w.status==="connected"?"1.5px solid #A7F3D0":w.status==="syncing"?"1.5px solid #FDE68A":"1px solid var(--border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:42,height:42,borderRadius:11,background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{w.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                  <span style={{fontSize:13,fontWeight:600,color:"var(--navy)"}}>{w.name}</span>
                  <span style={{fontSize:9,padding:"2px 5px",borderRadius:4,background:w.type==="sdk"?"#E0E7FF":"var(--vital-light)",color:w.type==="sdk"?"#3730A3":"var(--vital)",fontWeight:600}}>{w.type==="sdk"?"SDK":"OAuth"}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <StatusDot status={w.status}/>
                  {w.status!=="never"&&<span style={{fontSize:10,color:"var(--text3)"}}>{w.lastSync}</span>}
                </div>
                {w.status==="syncing"&&<div style={{marginTop:6}}><div className="progress-bar"><div className="progress-fill" style={{width:`${w.prog}%`}}/></div><span style={{fontSize:9,color:"var(--text3)",marginTop:2,display:"block"}}>{w.prog}% imported</span></div>}
              </div>
              {linking===w.id?<div style={{width:20,height:20,borderRadius:"50%",border:"2.5px solid var(--p100)",borderTopColor:"var(--vital)",animation:"spin .8s linear infinite"}}/>:w.status!=="never"?<button className="btn-o" style={{width:"auto",padding:"6px 12px",fontSize:11}} onClick={()=>nav("disconnect")}>Manage</button>:<button className="btn-v" style={{padding:"7px 13px",fontSize:11}} onClick={()=>handleConnect(w.id)}>Connect</button>}
            </div>
          </div>
        ))}
        <div style={{background:"var(--vital-light)",borderRadius:12,padding:"12px 14px",border:"1px solid #D8C4FF",display:"flex",gap:9,alignItems:"flex-start"}}>
          <span style={{fontSize:14}}>🔐</span>
          <div><div style={{fontSize:11,fontWeight:700,color:"var(--vital)",marginBottom:2}}>Vital SDK handles all OAuth</div><div style={{fontSize:10,color:"#6B4FA8",lineHeight:1.5}}>Token management, webhook delivery, and data normalisation are handled by Vital. Better Human never stores your provider credentials.</div></div>
        </div>
      </div>
    </div>
  );
};

// ── Live Metrics Dashboard ────────────────────────────────────────────────────
const MetricsScreen = ({nav}) => {
  const [refreshing, setRefresh] = useState(false);
  return (
    <div style={{minHeight:780,background:"#F8F7FF"}}>
      <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 18px",borderRadius:"0 0 22px 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>Live Metrics</h2>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}><span style={{width:6,height:6,borderRadius:"50%",background:"#10B981",display:"inline-block",animation:"pulse 1.5s ease infinite"}}/><span style={{fontSize:11,color:"rgba(255,255,255,.45)"}}>Real-time · 3 active sources</span></div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={()=>nav("trends")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}>📈 Trends</button>
            <button onClick={()=>setRefresh(true)} style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.1)",border:"none",cursor:"pointer",color:"white",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{animation:refreshing?"spin .8s linear infinite":"none",display:"inline-block"}}>🔄</span>
            </button>
          </div>
        </div>
        <div style={{background:"#FEF9C3",borderRadius:8,padding:"6px 10px",marginTop:10,display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:11}}>⚠️</span><span style={{fontSize:10,color:"#92400E"}}>Fitbit last synced 18 min ago · Some data may be stale</span>
        </div>
      </div>
      <div style={{padding:"16px 22px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {METRICS.map((m,i)=>(
            <div key={m.id} className={`card fu${Math.min(i,4)}`} style={{padding:"12px 13px",animationDelay:`${i*.05}s`,cursor:"pointer",transition:"transform .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"} onClick={()=>nav("trends")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div><div style={{fontSize:10,color:"var(--text3)",fontWeight:500,marginBottom:3}}>{m.label}</div><div className="sora" style={{fontSize:20,fontWeight:700,color:"var(--navy)"}}>{m.value}<span style={{fontSize:10,fontWeight:400,color:"var(--text3)",marginLeft:2}}>{m.unit}</span></div></div>
                <div style={{width:28,height:28,borderRadius:7,background:`${m.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>
                  {m.id==="hrv"?"📈":m.id==="steps"?"🚶":m.id==="rhr"?"❤️":m.id==="sleep"?"🌙":m.id==="calories"?"⚡":"💧"}
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <span style={{fontSize:10,color:m.pos?"#10B981":"#EF4444",fontWeight:600}}>{m.pos?"↑":"↓"} {m.delta}</span>
                <Spark data={m.data} color={m.color}/>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:"12px 14px"}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--text2)",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Active Sources</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {WEARABLES.filter(w=>w.status!=="never").map(w=>(
              <div key={w.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:7,background:"#F9FAFB",border:"1px solid var(--border)"}}>
                <span style={{fontSize:14}}>{w.emoji}</span><StatusDot status={w.status}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Trend Charts ──────────────────────────────────────────────────────────────
const TrendsScreen = ({nav}) => {
  const [active, setActive] = useState("hrv");
  const [range, setRange] = useState(30);
  const cur = TREND[active];
  const sl = range===7?cur.v.slice(-7):range===30?cur.v.slice(-30):cur.v;
  const tabs=[{id:"hrv",lb:"HRV",c:"#7C6CF6"},{id:"steps",lb:"Steps",c:"#10B981"},{id:"rhr",lb:"HR",c:"#EF4444"},{id:"sleep",lb:"Sleep",c:"#3B82F6"}];
  return (
    <div style={{minHeight:780,background:"#F8F7FF"}}>
      <div style={{background:"linear-gradient(160deg,#1A1A2E,#2D2B55)",padding:"40px 22px 0",borderRadius:"0 0 0 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <button onClick={()=>nav("metrics")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:9,padding:"7px 11px",color:"white",cursor:"pointer",fontSize:13}}>← Back</button>
          <h2 className="sora" style={{color:"white",fontSize:17,fontWeight:700}}>90-Day Trends</h2>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,.1)"}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setActive(t.id)} style={{flex:1,padding:"10px 4px",border:"none",background:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",color:active===t.id?t.c:"rgba(255,255,255,.4)",borderBottom:active===t.id?`2.5px solid ${t.c}`:"2.5px solid transparent",transition:"all .2s"}}>{t.lb}</button>)}
        </div>
      </div>
      <div style={{padding:"16px 22px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:16}}>
          {[{l:"Current",v:sl[sl.length-1].toFixed(1)},{l:"7d Avg",v:(sl.slice(-7).reduce((a,b)=>a+b,0)/Math.min(7,sl.length)).toFixed(1)},{l:"30d Avg",v:(sl.reduce((a,b)=>a+b,0)/sl.length).toFixed(1)}].map(s=>(
            <div key={s.l} className="card" style={{padding:"12px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"var(--text3)",fontWeight:600,textTransform:"uppercase",letterSpacing:.4,marginBottom:4}}>{s.l}</div>
              <div className="sora" style={{fontSize:19,fontWeight:700,color:cur.color}}>{s.v}</div>
              <div style={{fontSize:9,color:"var(--text3)"}}>{cur.unit}</div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:"16px 18px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div className="sora" style={{fontSize:14,fontWeight:700,color:"var(--navy)"}}>{cur.label}</div><div style={{fontSize:10,color:"var(--text3)"}}>Rolling 7-day avg overlay</div></div>
            <div style={{display:"flex",gap:2,background:"#F3F4F6",borderRadius:7,padding:2}}>
              {[7,30,90].map(r=><button key={r} onClick={()=>setRange(r)} style={{padding:"4px 10px",border:"none",cursor:"pointer",borderRadius:5,fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:range===r?"white":"transparent",color:range===r?cur.color:"var(--text3)",boxShadow:range===r?"0 1px 3px rgba(0,0,0,.1)":"none",transition:"all .15s"}}>{r}d</button>)}
            </div>
          </div>
          <div style={{display:"flex",gap:12,marginBottom:8}}>
            <span style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#8B8BAD"}}><span style={{width:14,height:2,background:cur.color,borderRadius:2,display:"inline-block"}}/>Actual</span>
            <span style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:"#8B8BAD"}}><span style={{width:14,height:2,background:"#C4B5FD",borderRadius:2,display:"inline-block",opacity:.7}}/>7-day avg</span>
          </div>
          <TrendLine data={cur.v} color={cur.color} range={range}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}><span style={{fontSize:10,color:"#8B8BAD"}}>{sl.length}d ago</span><span style={{fontSize:10,color:"#8B8BAD"}}>Today</span></div>
        </div>
        <div style={{padding:"10px 12px",background:"var(--p50)",borderRadius:10,border:"1px solid var(--border)",display:"flex",gap:7,alignItems:"flex-start"}}>
          <span style={{fontSize:12}}>ℹ️</span>
          <span style={{fontSize:10,color:"var(--text2)",lineHeight:1.5}}>Conflict resolution active — when Oura & Apple Health both report HRV, Oura takes priority. Change in Data Sources.</span>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════════════════════
const ALL_SCREENS = {
  login:        LoginScreen,
  onboarding_1: OB1,
  onboarding_2: OB2,
  onboarding_3: OB3,
  onboarding_4: OB4,
  onboarding_5: OB5,
  profile:      ProfileScreen,
  timeline:     TimelineScreen,
  goals:        GoalsScreen,
  privacy:      PrivacyScreen,
  wearables:    WearablesScreen,
  metrics:      MetricsScreen,
  trends:       TrendsScreen,
};

const APP_TABS = [
  {id:"profile",  icon:"👤", label:"Profile"},
  {id:"metrics",  icon:"📡", label:"Metrics"},
  {id:"timeline", icon:"📊", label:"Timeline"},
  {id:"goals",    icon:"🎯", label:"Goals"},
  {id:"privacy",  icon:"🔒", label:"Privacy"},
];

const WEB_NAV = [
  {id:"profile",    icon:"👤", label:"Profile",     group:"main"},
  {id:"timeline",   icon:"📊", label:"Timeline",    group:"main"},
  {id:"goals",      icon:"🎯", label:"Goals",       group:"main"},
  {id:"metrics",    icon:"📡", label:"Live Metrics",group:"wearable"},
  {id:"trends",     icon:"📈", label:"Trends",      group:"wearable"},
  {id:"wearables",  icon:"🔗", label:"Devices",     group:"wearable"},
  {id:"privacy",    icon:"🔒", label:"Privacy",     group:"settings"},
];

const SCREEN_LABELS = {
  login:"Login", onboarding_1:"Step 1 · Basic Info", onboarding_2:"Step 2 · Body Stats",
  onboarding_3:"Step 3 · Health History", onboarding_4:"Step 4 · Goals", onboarding_5:"Step 5 · Devices",
  profile:"Profile", timeline:"Health Timeline", goals:"Goals", privacy:"Privacy",
  wearables:"Connected Devices", metrics:"Live Metrics", trends:"Trend Charts",
};

// ── Web Sidebar ───────────────────────────────────────────────────────────────
const Sidebar = ({current, nav}) => {
  const groups = [
    {label:"Health Profile", items:WEB_NAV.filter(n=>n.group==="main")},
    {label:"Wearables (Vital SDK)", items:WEB_NAV.filter(n=>n.group==="wearable")},
    {label:"Settings", items:WEB_NAV.filter(n=>n.group==="settings")},
  ];
  return (
    <div style={{width:220,background:"linear-gradient(180deg,#1A1A2E,#2D2B55)",display:"flex",flexDirection:"column",padding:"22px 0",flexShrink:0}}>
      <div style={{padding:"0 18px 18px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <Logo size={30}/>
      </div>
      <div style={{padding:"14px 10px",flex:1,overflowY:"auto"}}>
        {groups.map(g=>(
          <div key={g.label} style={{marginBottom:18}}>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:1,padding:"0 10px",marginBottom:6}}>{g.label}</div>
            {g.items.map(item=>(
              <button key={item.id} onClick={()=>nav(item.id)} className="nav-item" style={{color:current===item.id?"#C4B5FD":"rgba(255,255,255,.5)",fontWeight:current===item.id?600:400,background:current===item.id?"rgba(124,108,246,.25)":"transparent"}}>
                <span style={{fontSize:15}}>{item.icon}</span>
                <span style={{fontSize:12}}>{item.label}</span>
                {current===item.id&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:"#7C6CF6"}}/>}
                {item.id==="metrics"&&<span style={{marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:"#10B981",animation:"pulse 1.5s ease infinite"}}/>}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div style={{padding:"10px 14px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#A78BFA,#7C6CF6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
          <div><p style={{color:"white",fontSize:11,fontWeight:600}}>Alex Johnson</p><p style={{color:"#A78BFA",fontSize:10}}>TechCorp Wellness</p></div>
        </div>
        <VitalBadge/>
      </div>
    </div>
  );
};

// ── Mobile Tab Bar ─────────────────────────────────────────────────────────────
const TabBar = ({current, nav}) => {
  const shown=APP_TABS;
  return (
    <div style={{background:"white",borderTop:"1px solid var(--border)",display:"flex",padding:"8px 0 4px",boxShadow:"0 -3px 16px rgba(124,108,246,.08)"}}>
      {shown.map(t=>(
        <button key={t.id} onClick={()=>nav(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"2px 0",opacity:current===t.id?1:.45}}>
          <span style={{fontSize:19}}>{t.icon}</span>
          <span style={{fontSize:9,fontWeight:current===t.id?700:400,color:current===t.id?"#7C6CF6":"#8B8BAD",fontFamily:"'DM Sans',sans-serif"}}>{t.label}</span>
          {current===t.id&&<div style={{width:3,height:3,borderRadius:"50%",background:"#7C6CF6"}}/>}
        </button>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login");
  const [viewMode, setViewMode] = useState("mobile");
  const isMobile = viewMode === "mobile";
  const isOnboarding = screen.startsWith("onboarding") || screen==="login";
  const showTabBar = !isOnboarding && isMobile;
  const showSidebar = !isOnboarding && !isMobile;
  const Screen = ALL_SCREENS[screen] || ProfileScreen;

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F172A,#1E1B4B 50%,#1A1A2E)",display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 36px"}}>

        {/* Top Control Bar */}
        <div style={{width:"100%",maxWidth:1160,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Logo size={32}/>
            <div style={{height:20,width:1,background:"rgba(255,255,255,.15)"}}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,.45)",letterSpacing:.3}}>F-001 · F-002 Unified Prototype</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* View toggle */}
            <div style={{display:"flex",gap:2,background:"rgba(255,255,255,.08)",borderRadius:9,padding:3}}>
              {[["mobile","📱 Mobile"],["web","🖥 Web"]].map(([m,lb])=>(
                <button key={m} onClick={()=>setViewMode(m)} style={{padding:"5px 14px",borderRadius:7,border:"none",cursor:"pointer",background:viewMode===m?"#7C6CF6":"transparent",color:viewMode===m?"white":"rgba(255,255,255,.5)",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all .15s"}}>{lb}</button>
              ))}
            </div>
            {/* Quick jump */}
            <select value={screen} onChange={e=>setScreen(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.8)",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
              <optgroup label="── Auth & Onboarding" style={{background:"#1A1A2E"}}>
                {["login","onboarding_1","onboarding_2","onboarding_3","onboarding_4","onboarding_5"].map(s=><option key={s} value={s} style={{background:"#1A1A2E"}}>{SCREEN_LABELS[s]}</option>)}
              </optgroup>
              <optgroup label="── F-001 Profile" style={{background:"#1A1A2E"}}>
                {["profile","timeline","goals","privacy"].map(s=><option key={s} value={s} style={{background:"#1A1A2E"}}>{SCREEN_LABELS[s]}</option>)}
              </optgroup>
              <optgroup label="── F-002 Wearables" style={{background:"#1A1A2E"}}>
                {["wearables","metrics","trends"].map(s=><option key={s} value={s} style={{background:"#1A1A2E"}}>{SCREEN_LABELS[s]}</option>)}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Screen pills */}
        <div style={{width:"100%",maxWidth:1160,display:"flex",flexWrap:"wrap",gap:6,marginBottom:24,justifyContent:"center"}}>
          {Object.keys(ALL_SCREENS).map(s=>(
            <button key={s} onClick={()=>setScreen(s)} style={{padding:"4px 12px",borderRadius:999,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all .15s",background:screen===s?"#7C6CF6":s.startsWith("onboarding")||s==="login"?"rgba(255,255,255,.07)":s==="wearables"||s==="metrics"||s==="trends"?"rgba(92,52,164,.35)":"rgba(255,255,255,.1)",color:screen===s?"white":s==="wearables"||s==="metrics"||s==="trends"?"#C4B5FD":"rgba(255,255,255,.6)",boxShadow:screen===s?"0 2px 8px rgba(124,108,246,.4)":"none"}}>
              {SCREEN_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Device Frame */}
        <div style={{width:"100%",maxWidth:isMobile?390:1160}}>
          {isMobile ? (
            /* ── Mobile frame ── */
            <div style={{position:"relative",width:390,margin:"0 auto",borderRadius:44,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.1) inset",background:"white",border:"10px solid #1A1A2E",display:"flex",flexDirection:"column"}}>
              {/* Status bar */}
              <div style={{height:44,background:isOnboarding?"transparent":"#1A1A2E",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 26px",position:"relative",zIndex:10}}>
                <span style={{fontSize:12,fontWeight:600,color:isOnboarding?"#1A1A2E":"white"}}>9:41</span>
                <div style={{width:100,height:24,borderRadius:12,background:"black",position:"absolute",left:"50%",transform:"translateX(-50%)"}}/>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {[4,3,2].map(h=><div key={h} style={{width:3,height:h*3,background:isOnboarding?"#1A1A2E":"white",borderRadius:1}}/>)}
                  <div style={{width:14,height:9,border:`1.5px solid ${isOnboarding?"#1A1A2E":"white"}`,borderRadius:2,marginLeft:2}}>
                    <div style={{width:"65%",height:"100%",background:isOnboarding?"#1A1A2E":"white",borderRadius:1}}/>
                  </div>
                </div>
              </div>
              {/* Content */}
              <div style={{flex:1,overflowY:"auto",paddingBottom:showTabBar?70:0,minHeight:680}}>
                <Screen nav={setScreen}/>
              </div>
              {/* Tab bar */}
              {showTabBar&&<div style={{position:"sticky",bottom:0,left:0,right:0,background:"white"}}><TabBar current={screen} nav={setScreen}/></div>}
              {/* Home indicator */}
              <div style={{background:"white",padding:"10px 0 14px",display:"flex",justifyContent:"center"}}>
                <div style={{width:110,height:4,borderRadius:2,background:"#D1D5DB"}}/>
              </div>
            </div>
          ) : (
            /* ── Web frame ── */
            <div style={{borderRadius:14,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.08) inset",background:"white",display:"flex",flexDirection:"column"}}>
              {/* Browser chrome */}
              <div style={{background:"#2D2D2D",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <div style={{display:"flex",gap:5}}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
                </div>
                <div style={{flex:1,background:"#1A1A1A",borderRadius:6,padding:"5px 12px",fontSize:11,color:"#9CA3AF",display:"flex",alignItems:"center",gap:7}}>
                  <span style={{color:"#10B981"}}>🔒</span> app.betterhumans.com/{screen==="login"||screen.startsWith("onboarding")?"onboarding":screen}
                </div>
              </div>
              {/* App layout */}
              <div style={{display:"flex",height:680}}>
                {showSidebar&&<Sidebar current={screen} nav={setScreen}/>}
                <div style={{flex:1,overflowY:"auto"}}>
                  <Screen nav={setScreen}/>
                </div>
              </div>
            </div>
          )}
        </div>

        <p style={{color:"rgba(255,255,255,.2)",fontSize:10,marginTop:20,letterSpacing:.5,textAlign:"center"}}>
          Better Human · Unified App Prototype · F-001 Health Identity Profile + F-002 Multi-Wearable Integration
        </p>
      </div>
    </>
  );
}
