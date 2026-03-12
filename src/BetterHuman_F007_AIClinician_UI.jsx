import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────
   BETTER HUMAN  ·  F-007  ·  AI CLINICIAN — Health Q&A Assistant
   Full interactive prototype  ·  Web + Mobile  ·  5 screens
   Design system: deep obsidian · bio-teal #00D4B8 · violet #7B6FF0
───────────────────────────────────────────────────────────────── */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#040810;--deep:#080E1A;--base:#0D1525;--mid:#131E2F;
  --surf:#192236;--lift:#1E2A40;--rim:#26344D;
  --muted:rgba(255,255,255,.055);--muted2:rgba(255,255,255,.09);
  --t0:#FFFFFF;--t1:rgba(255,255,255,.88);--t2:rgba(255,255,255,.55);
  --t3:rgba(255,255,255,.30);--t4:rgba(255,255,255,.14);
  --v:#7B6FF0;--v2:#5B52D0;--v3:#4740B8;--lilac:#A89CFF;--vglow:rgba(123,111,240,.32);
  --bio:#00D4B8;--bio2:#00A896;--biodim:rgba(0,212,184,.14);--bioglow:rgba(0,212,184,.36);
  --green:#22C55E;--gdim:rgba(34,197,94,.13);
  --amber:#F59E0B;--adim:rgba(245,158,11,.13);
  --red:#F43F5E;--rdim:rgba(244,63,94,.13);
  --blue:#38BDF8;--bdim:rgba(56,189,248,.13);
  --b1:rgba(255,255,255,.07);--b2:rgba(255,255,255,.12);--b3:rgba(255,255,255,.20);
  --sh2:0 6px 28px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.05) inset;
  --sh3:0 20px 60px rgba(0,0,0,.65),0 1px 0 rgba(255,255,255,.07) inset;
  --r3:10px;--r4:14px;
  --ff:'Plus Jakarta Sans',system-ui,sans-serif;
  --ffd:'Fraunces',Georgia,serif;
}
html,body{font-family:var(--ff);background:var(--void);color:var(--t1);line-height:1.5;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--rim);border-radius:3px}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes wave{0%,100%{height:4px}25%{height:18px}50%{height:8px}75%{height:22px}}
@keyframes stream{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 24px var(--bioglow)}50%{box-shadow:0 0 48px var(--bioglow)}}
@keyframes dotb{0%,80%,100%{transform:scale(0);opacity:.4}40%{transform:scale(1);opacity:1}}

.fu {animation:fadeUp .48s cubic-bezier(.22,1,.36,1) both}
.fu1{animation:fadeUp .48s .07s cubic-bezier(.22,1,.36,1) both}
.fu2{animation:fadeUp .48s .14s cubic-bezier(.22,1,.36,1) both}
.fu3{animation:fadeUp .48s .21s cubic-bezier(.22,1,.36,1) both}
.fu4{animation:fadeUp .48s .28s cubic-bezier(.22,1,.36,1) both}
.fu5{animation:fadeUp .48s .35s cubic-bezier(.22,1,.36,1) both}

.glass{background:linear-gradient(145deg,rgba(255,255,255,.053),rgba(255,255,255,.018));border:1px solid var(--b1);border-radius:var(--r4);backdrop-filter:blur(16px);box-shadow:var(--sh2)}
.gh{transition:border-color .2s,box-shadow .22s,transform .18s;cursor:pointer}
.gh:hover{border-color:var(--b3);box-shadow:var(--sh3);transform:translateY(-2px)}

.field{width:100%;padding:11px 14px;background:rgba(255,255,255,.05);border:1px solid var(--b2);border-radius:var(--r3);font-family:var(--ff);font-size:14px;color:var(--t1);outline:none;transition:border-color .2s,box-shadow .2s;resize:none}
.field:focus{border-color:var(--bio);box-shadow:0 0 0 3px rgba(0,212,184,.14)}
.field::placeholder{color:var(--t3)}

.btn-bio{padding:11px 20px;background:linear-gradient(135deg,var(--bio),var(--bio2));color:#021017;border:none;border-radius:var(--r3);font-family:var(--ff);font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 18px var(--bioglow)}
.btn-bio:hover{transform:translateY(-1px);box-shadow:0 8px 28px var(--bioglow)}
.btn-g{padding:8px 14px;background:var(--muted);border:1px solid var(--b2);border-radius:var(--r3);color:var(--t2);font-family:var(--ff);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s}
.btn-g:hover{background:var(--lift);border-color:var(--b3);color:var(--t1)}
.btn-icon{width:32px;height:32px;background:var(--muted);border:1px solid var(--b1);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;color:var(--t2);font-size:14px;flex-shrink:0}
.btn-icon:hover{background:var(--lift);border-color:var(--b2);color:var(--t1)}
.send-btn{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--bio),var(--bio2));border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 4px 16px var(--bioglow)}
.send-btn:hover:not(:disabled){transform:scale(1.1);box-shadow:0 8px 24px var(--bioglow)}
.send-btn:disabled{opacity:.3;cursor:not-allowed}

.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.02em}
.b-bio{background:var(--biodim);color:var(--bio);border:1px solid rgba(0,212,184,.22)}
.b-v{background:rgba(123,111,240,.12);color:var(--lilac);border:1px solid rgba(123,111,240,.22)}
.b-g{background:var(--gdim);color:var(--green);border:1px solid rgba(34,197,94,.2)}
.b-a{background:var(--adim);color:var(--amber);border:1px solid rgba(245,158,11,.2)}
.b-dim{background:rgba(255,255,255,.06);color:var(--t2);border:1px solid var(--b1)}

.dot{width:7px;height:7px;border-radius:50%;background:var(--bio);animation:dotb 1.3s ease-in-out infinite;display:inline-block}
.dot:nth-child(2){animation-delay:.18s}
.dot:nth-child(3){animation-delay:.36s}
.wbar{width:3px;border-radius:2px;background:var(--bio);animation:wave 1.1s ease-in-out infinite;display:inline-block;margin:0 1.5px}
.wbar:nth-child(2){animation-delay:.14s}
.wbar:nth-child(3){animation-delay:.28s}
.wbar:nth-child(4){animation-delay:.42s}
.wbar:nth-child(5){animation-delay:.28s}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--green);display:inline-block;animation:pulse 1.6s ease-in-out infinite}

.msg-user{background:linear-gradient(135deg,rgba(123,111,240,.22),rgba(91,82,208,.15));border:1px solid rgba(123,111,240,.28);border-radius:16px 4px 16px 16px;padding:12px 16px;margin-left:auto;max-width:80%;animation:stream .3s ease both}
.msg-ai{background:linear-gradient(135deg,rgba(0,212,184,.08),rgba(8,145,178,.055));border:1px solid rgba(0,212,184,.18);border-radius:4px 16px 16px 16px;padding:14px 16px;max-width:92%;animation:stream .36s ease both;position:relative}
.msg-ai::before{content:'';position:absolute;left:-1px;top:16px;width:3px;height:22px;background:var(--bio);border-radius:0 2px 2px 0}

.chip{padding:7px 13px;background:rgba(123,111,240,.08);border:1px solid rgba(123,111,240,.22);border-radius:999px;font-size:12px;color:var(--lilac);cursor:pointer;transition:all .18s;white-space:nowrap;font-family:var(--ff);font-weight:500}
.chip:hover{background:rgba(123,111,240,.2);border-color:rgba(123,111,240,.45);color:var(--t0);transform:translateY(-1px)}

.ctx{background:var(--surf);border:1px solid var(--b1);border-radius:var(--r3);padding:9px 12px;transition:border-color .15s}
.ctx:hover{border-color:var(--b2)}
.pbar{height:4px;border-radius:2px;background:var(--muted)}
.pfill{height:100%;border-radius:2px;transition:width .9s cubic-bezier(.22,1,.36,1)}

.snav{display:flex;align-items:center;gap:9px;padding:7px 11px;border-radius:var(--r3);border:1px solid transparent;cursor:pointer;width:100%;font-family:var(--ff);font-size:12px;text-align:left;transition:all .15s;background:transparent;color:var(--t3)}
.snav:hover{background:var(--muted2);color:var(--t2)}
.snav.on{background:rgba(0,212,184,.09);color:var(--bio);border-color:rgba(0,212,184,.14)}

.hist{padding:10px 12px;border-radius:var(--r3);border:1px solid var(--b1);cursor:pointer;transition:all .15s;background:var(--muted)}
.hist:hover{background:var(--surf);border-color:var(--b2)}
.hist.on{background:rgba(123,111,240,.1);border-color:rgba(123,111,240,.28)}

.cit-strip{background:rgba(0,212,184,.06);border:1px solid rgba(0,212,184,.16);border-radius:var(--r3);padding:10px 13px;margin-top:10px}
.cit-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;background:rgba(0,212,184,.1);border:1px solid rgba(0,212,184,.2);border-radius:999px;font-size:10px;color:var(--bio);font-weight:600;margin:2px}
.proto{background:linear-gradient(135deg,rgba(0,212,184,.08),rgba(8,145,178,.05));border:1px solid rgba(0,212,184,.2);border-radius:var(--r4);padding:14px 16px;margin-top:10px}
.proto-row{display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.proto-row:last-child{border-bottom:none}

.fb{padding:4px 10px;border-radius:999px;border:1px solid var(--b1);background:transparent;cursor:pointer;font-size:12px;transition:all .15s;font-family:var(--ff);color:var(--t3)}
.fb:hover{background:var(--lift);border-color:var(--b2);color:var(--t1)}
.fb.up{border-color:rgba(34,197,94,.3);color:var(--green);background:var(--gdim)}
.fb.dn{border-color:rgba(244,63,94,.3);color:var(--red);background:var(--rdim)}

.tbar{display:flex;background:var(--base);border-top:1px solid var(--b1);padding:6px 4px 10px}
.tbtn{flex:1;background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px 2px;font-family:var(--ff);transition:all .15s;position:relative}
.tog{width:40px;height:22px;border-radius:11px;position:relative;transition:background .22s;cursor:pointer;flex-shrink:0}
.tog-k{position:absolute;top:2px;width:18px;height:18px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,.4);transition:transform .22s cubic-bezier(.22,1,.36,1)}

.alert-watch{background:rgba(56,189,248,.05);border:1px solid rgba(56,189,248,.18);border-left:3px solid var(--blue);border-radius:var(--r3);padding:11px 13px}
.alert-attention{background:rgba(245,158,11,.05);border:1px solid rgba(245,158,11,.18);border-left:3px solid var(--amber);border-radius:var(--r3);padding:11px 13px}
.alert-urgent{background:rgba(244,63,94,.06);border:1px solid rgba(244,63,94,.18);border-left:3px solid var(--red);border-radius:var(--r3);padding:11px 13px}
.disclaimer{margin-top:8px;padding:7px 10px;background:rgba(244,63,94,.04);border:1px solid rgba(244,63,94,.1);border-radius:6px;font-size:10px;color:rgba(244,63,94,.55);line-height:1.5}
`;

/* DATA */
const USER = {
  name:"Alex Johnson", age:32, bioAge:31.2,
  biomarkers:[
    {k:"hs-CRP",v:"1.2 mg/L",s:"attention",ref:"<1.0",imp:"+0.8yr"},
    {k:"HbA1c",v:"5.4%",s:"optimal",ref:"<5.7%",imp:"−0.5yr"},
    {k:"Vitamin D",v:"34 ng/mL",s:"attention",ref:"40–60",imp:"+0.6yr"},
    {k:"LDL/HDL",v:"2.1 ratio",s:"optimal",ref:"<3.0",imp:"−0.3yr"},
    {k:"Homocysteine",v:"9.2 μmol/L",s:"optimal",ref:"<10",imp:"Neutral"},
    {k:"Testosterone",v:"620 ng/dL",s:"optimal",ref:"400–900",imp:"−0.2yr"},
  ],
  wearable:[
    {k:"HRV rMSSD",v:"62 ms",s:"optimal",d:"+8% 30d"},
    {k:"Resting HR",v:"58 bpm",s:"optimal",d:"−3% 30d"},
    {k:"Sleep Eff.",v:"76%",s:"attention",d:"−8% 30d"},
    {k:"VO₂ Max",v:"48 mL/kg/m",s:"optimal",d:"+2% 30d"},
    {k:"Deep Sleep",v:"18%",s:"attention",d:"−4% 30d"},
    {k:"Steps/Day",v:"8,420",s:"optimal",d:"+12% 7d"},
  ],
};

const ALERTS = [
  {level:"attention",icon:"⚠️",title:"hs-CRP Mildly Elevated",body:"Inflammation at 1.2 mg/L — above optimal. Largest driver of bio age gap (+0.8yr).",action:"Explore →"},
  {level:"watch",icon:"💤",title:"Sleep Efficiency Declining",body:"7-day avg at 76% (was 84%). Deep sleep at 18% below optimal 20%.",action:"Ask AI →"},
];

const HISTORY = [
  {id:"h1",title:"Lab Results — Full Panel Walkthrough",date:"Mar 8",preview:"Your hs-CRP of 1.2 indicates mild systemic inflammation…",turns:6,type:"insight"},
  {id:"h2",title:"Anti-Inflammation Protocol",date:"Mar 5",preview:"Based on your profile, here's a ranked intervention plan…",turns:4,type:"protocol"},
  {id:"h3",title:"Sleep & HRV Optimization",date:"Mar 1",preview:"Your declining sleep efficiency is the upstream driver…",turns:8,type:"insight"},
  {id:"h4",title:"Vitamin D Supplementation Plan",date:"Feb 25",preview:"At 34 ng/mL you're below optimal range. Protocol…",turns:3,type:"protocol"},
];

const SUGGESTED = [
  "My hs-CRP is 1.2 — what does this mean for my health?",
  "What's driving my biological age higher than my calendar age?",
  "My sleep efficiency has declined — how does this affect me?",
  "Give me a full anti-inflammation protocol based on my data",
  "What are my biggest health opportunities right now?",
  "How can I raise my Vitamin D quickly?",
];

const DEMO_MSGS = [
  {role:"user",content:"I just got my lab results back. My hs-CRP is 1.2 — is that bad?",time:"2:14 PM"},
  {
    role:"ai",time:"2:14 PM",type:"insight",
    content:"Great question, Alex — let's walk through this together.\n\nYour **hs-CRP of 1.2 mg/L** is *mildly elevated*. Here's the context:\n\n• **Optimal:** < 1.0 mg/L\n• **Mild concern zone:** 1.0–3.0 mg/L ← you're here\n• **Elevated concern:** > 3.0 mg/L\n\nHere's why this matters **specifically for you**: based on your Biological Age engine, hs-CRP is the largest single contributor to your bio age being **0.8 years higher** than it needs to be.\n\nYour **Oura sleep efficiency has dropped to 76%** over the last 30 days (down from 84%), which is likely a contributing driver — poor sleep is a well-established upstream cause of systemic inflammation.\n\nThe good news: **hs-CRP is highly modifiable** — often reduced 30–40% within 60–90 days with targeted interventions.",
    citations:[
      {m:"hs-CRP",v:"1.2 mg/L",src:"Lab Panel · Mar 5"},
      {m:"Bio Age",v:"31.2 yrs",src:"F-003 · Mar 8"},
      {m:"Sleep Eff.",v:"76% (7d avg)",src:"Oura Ring · Mar 8"},
    ],
    followUps:["What foods help reduce hs-CRP?","How is sleep driving inflammation?","Give me a full protocol"],
  },
  {role:"user",content:"That's really helpful. Can you give me a specific protocol to bring my hs-CRP down?",time:"2:16 PM"},
  {
    role:"ai",time:"2:16 PM",type:"protocol",
    content:"Absolutely. Based on your full health profile, here is your personalized anti-inflammation protocol ranked by estimated impact:",
    isProtocol:true,
    protocol:{
      title:"Anti-Inflammation & Bio Age Optimization Protocol",
      signal:"hs-CRP 1.2 mg/L · Sleep Efficiency 76%",
      impact:"Est. −0.8 to −1.2 yrs bio age over 90 days",
      items:[
        {cat:"🥗",label:"Nutrition",color:"#22C55E",ev:"A",action:"Mediterranean diet + 2g EPA/DHA omega-3 daily",impact:"hs-CRP −0.3 to −0.4 mg/L",time:"60–90 days"},
        {cat:"😴",label:"Sleep",color:"#38BDF8",ev:"A",action:"10:30 PM–6:30 AM schedule · no screens 90 min before bed",impact:"Sleep eff. +8–10%, bio age −0.3yr",time:"14–30 days"},
        {cat:"💊",label:"Supplements",color:"#A89CFF",ev:"B",action:"Curcumin 500mg + Vit D3 2,000 IU + Mag glycinate 400mg",impact:"hs-CRP −0.1 to −0.2 mg/L",time:"30–60 days"},
        {cat:"🏃",label:"Exercise",color:"#F59E0B",ev:"A",action:"3× Zone 2 cardio per week · 45 min",impact:"HRV +5–8 ms, hs-CRP −0.1 mg/L",time:"45–60 days"},
      ],
      monitor:["hs-CRP","Sleep efficiency (7d avg)","HRV rMSSD (30d avg)"],
      retest:"Retest biomarker panel in 90 days",
    },
    citations:[
      {m:"hs-CRP",v:"1.2 mg/L",src:"Lab Panel · Mar 5"},
      {m:"Sleep Eff.",v:"76%",src:"Oura Ring · Mar 8"},
      {m:"Vitamin D",v:"34 ng/mL",src:"Lab Panel · Mar 5"},
      {m:"HRV",v:"62 ms",src:"Oura Ring · Mar 8"},
    ],
    followUps:["How long until I see bio age improve?","Can I do Zone 2 with my HRV?","What if hs-CRP stays elevated?"],
  },
];

const PROTOCOLS = [
  {title:"Anti-Inflammation Protocol",status:"active",pct:34,signal:"hs-CRP 1.2 mg/L",impact:"Est. −0.8yr",date:"Mar 8",icon:"🥗",c:"#22C55E"},
  {title:"Sleep Optimization",status:"active",pct:60,signal:"Sleep Eff. 76%",impact:"Est. −0.3yr",date:"Mar 5",icon:"😴",c:"#38BDF8"},
  {title:"Vitamin D Correction",status:"completed",pct:100,signal:"Vit D 34 ng/mL",impact:"−0.4yr achieved",date:"Feb 20",icon:"💊",c:"#A89CFF"},
  {title:"Zone 2 Cardio Program",status:"active",pct:22,signal:"VO₂ Max 48 mL",impact:"Est. −0.5yr",date:"Mar 8",icon:"🏃",c:"#F59E0B"},
];

/* MICRO COMPONENTS */
function Logo({sz=32,text=true}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <svg width={sz} height={sz} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="11" fill="url(#lg7)"/>
        <rect x="15" y="8" width="10" height="10" rx="2.5" fill="white"/>
        <rect x="21.5" y="8" width="10" height="10" rx="2.5" fill="white" opacity=".55"/>
        <path d="M11 24Q9 21 13 19Q15 18 17 20L20 24L23 20Q25 18 27 19Q31 21 29 24L20 33Z" fill="white" opacity=".9"/>
        <defs><linearGradient id="lg7" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#7B6FF0"/><stop offset="1" stopColor="#4740B8"/>
        </linearGradient></defs>
      </svg>
      {text&&<span style={{fontFamily:"var(--ffd)",fontSize:sz*.52,fontWeight:800,color:"white",letterSpacing:"-.03em"}}>
        Better<span style={{color:"var(--bio)"}}>Human</span>
      </span>}
    </div>
  );
}

function AIClinBadge(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:30,height:30,borderRadius:9,background:"linear-gradient(135deg,var(--bio),var(--bio2))",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
        animation:"glow 3s ease-in-out infinite"}}>🤖</div>
      <div>
        <div style={{fontFamily:"var(--ffd)",fontSize:14,fontWeight:800,color:"var(--bio)",letterSpacing:"-.02em",lineHeight:1}}>AI Clinician</div>
        <div style={{fontSize:9,color:"var(--t3)",marginTop:1}}>BetterHuman · GPT-4o · F-007</div>
      </div>
      <span className="badge b-bio" style={{fontSize:9}}>LIVE</span>
    </div>
  );
}

function TypingIndicator(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
      <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,var(--bio),var(--bio2))",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🤖</div>
      <div style={{display:"flex",alignItems:"center",gap:5,padding:"9px 14px",
        background:"rgba(0,212,184,.07)",border:"1px solid rgba(0,212,184,.16)",borderRadius:"4px 14px 14px 14px"}}>
        <div className="dot"/><div className="dot"/><div className="dot"/>
        <span style={{fontSize:11,color:"var(--t3)",marginLeft:5}}>Analyzing your health data…</span>
      </div>
    </div>
  );
}

function WaveBar(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",
      background:"rgba(0,212,184,.08)",border:"1px solid rgba(0,212,184,.18)",borderRadius:999}}>
      <div style={{display:"flex",alignItems:"flex-end",height:18}}>
        {[1,2,3,4,5].map(i=><div key={i} className="wbar" style={{animationDelay:`${(i-1)*.14}s`}}/>)}
      </div>
      <span style={{fontSize:11,color:"var(--bio)",fontWeight:600}}>Responding…</span>
    </div>
  );
}

function FmtText({text}){
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p,i)=>{
    if(p.startsWith("**")&&p.endsWith("**"))return<strong key={i} style={{color:"var(--t0)",fontWeight:700}}>{p.slice(2,-2)}</strong>;
    if(p.startsWith("*")&&p.endsWith("*"))return<em key={i} style={{color:"var(--t2)"}}>{p.slice(1,-1)}</em>;
    return p;
  });
}

function CtxCard({metric,val,status,sub,delta}){
  const c={optimal:"var(--green)",attention:"var(--amber)",critical:"var(--red)"}[status]||"var(--t3)";
  return(
    <div className="ctx" style={{borderLeft:`2px solid ${c}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <span style={{fontSize:9,color:"var(--t3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>{metric}</span>
        {delta&&<span style={{fontSize:9,color:c,fontWeight:700}}>{delta}</span>}
      </div>
      <div style={{fontFamily:"var(--ffd)",fontSize:15,fontWeight:800,color:c,marginTop:1,lineHeight:1.2}}>{val}</div>
      {sub&&<div style={{fontSize:9,color:"var(--t4)",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function CitationStrip({citations}){
  return(
    <div className="cit-strip">
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}>
        <span style={{fontSize:12}}>📎</span>
        <span style={{fontSize:10,color:"var(--bio)",fontWeight:700,textTransform:"uppercase",letterSpacing:".05em"}}>Based on your data</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
        {citations.map((c,i)=>(
          <span key={i} className="cit-pill">{c.m}: <strong>{c.v}</strong><span style={{opacity:.65}}> · {c.src}</span></span>
        ))}
      </div>
    </div>
  );
}

function ProtocolCard({pr}){
  const [exp,setExp]=useState(true);
  return(
    <div className="proto">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div>
          <div style={{fontFamily:"var(--ffd)",fontSize:14,fontWeight:800,color:"var(--bio)",letterSpacing:"-.02em"}}>{pr.title}</div>
          <div style={{fontSize:10,color:"var(--t3)",marginTop:2}}>{pr.signal}</div>
        </div>
        <span className="badge b-g" style={{fontSize:9,flexShrink:0,marginLeft:8}}>{pr.impact}</span>
      </div>
      {exp&&(
        <>
          {pr.items.map((iv,i)=>(
            <div key={i} className="proto-row">
              <span style={{fontSize:18,flexShrink:0,marginTop:1}}>{iv.cat}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:700,color:iv.color}}>{iv.label}</span>
                  <span style={{fontSize:9,padding:"1px 5px",borderRadius:4,background:`${iv.color}18`,color:iv.color,fontWeight:700,border:`1px solid ${iv.color}28`}}>Ev.{iv.ev}</span>
                </div>
                <div style={{fontSize:12,color:"var(--t2)",marginBottom:4,lineHeight:1.4}}>{iv.action}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:"var(--green)",fontWeight:600}}>{iv.impact}</span>
                  <span style={{fontSize:10,color:"var(--t4)"}}>·</span>
                  <span style={{fontSize:10,color:"var(--t3)"}}>Timeline: {iv.time}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid var(--b1)",display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:700,color:"var(--t2)"}}>Monitor:</span>
            {pr.monitor.map((m,i)=><span key={i} className="badge b-dim" style={{fontSize:9}}>{m}</span>)}
          </div>
          <div style={{marginTop:6,fontSize:11,color:"var(--bio)",fontWeight:600}}>📅 {pr.retest}</div>
        </>
      )}
      <div style={{display:"flex",gap:7,marginTop:12}}>
        <button className="btn-bio" style={{flex:1,padding:"8px 14px",fontSize:12}}>💾 Save Protocol</button>
        <button className="btn-g" style={{padding:"8px 12px",fontSize:12}} onClick={()=>setExp(!exp)}>{exp?"▲ Collapse":"▼ Expand"}</button>
      </div>
    </div>
  );
}

function AlertCard({alert,onAsk}){
  const colors={watch:"var(--blue)",attention:"var(--amber)",urgent:"var(--red)"};
  const c=colors[alert.level];
  return(
    <div className={`alert-${alert.level}`} style={{marginBottom:8}}>
      <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
        <span style={{fontSize:16,flexShrink:0}}>{alert.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:3}}>{alert.title}</div>
          <div style={{fontSize:11,color:"var(--t2)",lineHeight:1.5}}>{alert.body}</div>
        </div>
        <button className="btn-g" style={{padding:"5px 10px",fontSize:11,flexShrink:0,borderColor:`${c}30`,color:c}} onClick={onAsk}>{alert.action}</button>
      </div>
    </div>
  );
}

function Msg({msg,streaming=false}){
  if(msg.role==="user"){
    return(
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16,animation:"stream .3s ease both"}}>
        <div style={{maxWidth:"80%"}}>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:6,marginBottom:5}}>
            <span style={{fontSize:10,color:"var(--t4)"}}>{msg.time}</span>
            <span style={{fontSize:11,fontWeight:700,color:"var(--lilac)"}}>You</span>
          </div>
          <div className="msg-user"><p style={{fontSize:14,color:"var(--t0)",lineHeight:1.65}}>{msg.content}</p></div>
        </div>
      </div>
    );
  }
  return(
    <div style={{marginBottom:20,animation:"stream .36s ease both"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{width:26,height:26,borderRadius:8,background:"linear-gradient(135deg,var(--bio),var(--bio2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>🤖</div>
        <span style={{fontSize:11,fontWeight:700,color:"var(--bio)"}}>AI Clinician</span>
        <span style={{fontSize:10,color:"var(--t4)"}}>{msg.time}</span>
        {msg.type&&<span className={`badge ${msg.type==="protocol"?"b-bio":"b-v"}`} style={{fontSize:9}}>{msg.type==="protocol"?"📋 Protocol":"💡 Insight"}</span>}
        {streaming&&<WaveBar/>}
      </div>
      <div className="msg-ai">
        {msg.content.split("\n").map((line,i)=>{
          if(!line.trim())return<div key={i} style={{height:6}}/>;
          return<p key={i} style={{fontSize:14,color:"var(--t1)",lineHeight:1.65,marginBottom:4}}><FmtText text={line}/></p>;
        })}
        {msg.isProtocol&&msg.protocol&&<ProtocolCard pr={msg.protocol}/>}
        {msg.citations&&!streaming&&<CitationStrip citations={msg.citations}/>}
      </div>
      {!streaming&&msg.followUps&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
          {msg.followUps.map((q,i)=><button key={i} className="chip" style={{fontSize:11}}>↗ {q}</button>)}
        </div>
      )}
      {!streaming&&(
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          <button className="fb up">👍 Helpful</button>
          <button className="fb dn">👎</button>
          <button className="fb">📋 Copy</button>
          {msg.type==="protocol"&&<button className="fb" style={{color:"var(--bio)",borderColor:"rgba(0,212,184,.28)"}}>📄 Export PDF</button>}
        </div>
      )}
      {!streaming&&<div className="disclaimer">⚕ Educational health information only — not medical advice or diagnosis. Consult your healthcare provider for clinical decisions.</div>}
    </div>
  );
}

/* SCREENS */
function EmptyState({onPrompt}){
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",textAlign:"center",overflowY:"auto"}}>
      <div className="fu" style={{position:"relative",marginBottom:18}}>
        <div style={{width:76,height:76,borderRadius:22,background:"linear-gradient(135deg,var(--bio),var(--bio2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,animation:"float 4s ease-in-out infinite",boxShadow:"0 0 48px var(--bioglow)"}}>🤖</div>
        <div style={{position:"absolute",bottom:-2,right:-2,width:22,height:22,borderRadius:"50%",background:"var(--green)",border:"2.5px solid var(--deep)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div className="ldot" style={{width:5,height:5}}/>
        </div>
      </div>
      <h2 className="fu1" style={{fontFamily:"var(--ffd)",fontSize:22,fontWeight:900,color:"var(--t0)",letterSpacing:"-.04em",marginBottom:6}}>AI Clinician</h2>
      <p className="fu2" style={{fontSize:13,color:"var(--t3)",maxWidth:300,lineHeight:1.65,marginBottom:20}}>Ask anything about your health. Every answer is grounded in your biomarkers, wearable data, and biological age.</p>
      <div className="fu3" style={{width:"100%",maxWidth:460,marginBottom:18}}>
        {ALERTS.map((a,i)=><AlertCard key={i} alert={a} onAsk={()=>onPrompt(`Tell me about: ${a.title}`)}/>)}
      </div>
      <div className="fu4" style={{width:"100%",maxWidth:460}}>
        <div style={{fontSize:10,color:"var(--t3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>Suggested questions</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center"}}>
          {SUGGESTED.map((s,i)=><button key={i} className="chip" onClick={()=>onPrompt(s)}>{s}</button>)}
        </div>
      </div>
    </div>
  );
}

function ChatView({msgs,typing,onSend,input,setInput,chatRef}){
  const empty=msgs.length===0;
  const handleKey=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onSend();}};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:empty?0:"20px 20px 10px"}}>
        {empty
          ?<EmptyState onPrompt={p=>{setInput(p);setTimeout(()=>onSend(p),80);}}/>
          :<>
            {msgs.map((m,i)=><Msg key={i} msg={m} streaming={typing&&i===msgs.length-1&&m.role==="ai"}/>)}
            {typing&&msgs.at(-1)?.role!=="ai"&&<TypingIndicator/>}
          </>
        }
      </div>
      <div style={{padding:"12px 16px 14px",borderTop:"1px solid var(--b1)",background:"var(--base)",flexShrink:0}}>
        {!empty&&(
          <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:9,paddingBottom:1}}>
            {SUGGESTED.slice(0,4).map((s,i)=>(
              <button key={i} className="chip" style={{fontSize:11,flexShrink:0}} onClick={()=>setInput(s)}>
                {s.length>38?s.slice(0,38)+"…":s}
              </button>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:1,position:"relative"}}>
            <textarea className="field" rows={1} value={input}
              onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
              placeholder="Ask about your health data, get personalized insights…"
              style={{resize:"none",lineHeight:1.5,minHeight:44,maxHeight:120,paddingRight:52}}/>
            <span style={{position:"absolute",right:10,bottom:10,fontSize:10,color:"var(--t4)"}}>{input.length}/1500</span>
          </div>
          <button className="send-btn" onClick={()=>onSend()} disabled={!input.trim()||typing}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:10,color:"var(--t4)",marginTop:6}}>⚕ Educational guidance only · Not a substitute for medical advice</p>
      </div>
    </div>
  );
}

function HistoryScreen({onSelect}){
  const [active,setActive]=useState("h1");
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"14px 16px 12px",borderBottom:"1px solid var(--b1)",flexShrink:0}}>
        <div style={{fontFamily:"var(--ffd)",fontSize:16,fontWeight:800,color:"var(--t0)",letterSpacing:"-.03em",marginBottom:9}}>Conversations</div>
        <input className="field" placeholder="🔍  Search history…" style={{fontSize:12,padding:"8px 12px"}}/>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
        {HISTORY.map(h=>(
          <div key={h.id} className={`hist ${active===h.id?"on":""}`} style={{marginBottom:7}}
            onClick={()=>{setActive(h.id);onSelect();}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:12,fontWeight:700,color:"var(--t1)"}}>{h.title}</span>
              <div style={{display:"flex",gap:5,alignItems:"center",flexShrink:0,marginLeft:8}}>
                <span className={`badge ${h.type==="protocol"?"b-bio":"b-v"}`} style={{fontSize:8}}>{h.type}</span>
                <span style={{fontSize:10,color:"var(--t4)"}}>{h.date}</span>
              </div>
            </div>
            <p style={{fontSize:11,color:"var(--t3)",lineHeight:1.4,marginBottom:3}}>{h.preview}</p>
            <span style={{fontSize:10,color:"var(--t4)"}}>{h.turns} messages</span>
          </div>
        ))}
      </div>
      <div style={{padding:"10px 12px",borderTop:"1px solid var(--b1)",flexShrink:0}}>
        <button className="btn-bio" style={{width:"100%",padding:10,fontSize:13}}>✦ New Conversation</button>
      </div>
    </div>
  );
}

function ContextPanel(){
  return(
    <div style={{height:"100%",overflowY:"auto",padding:"16px 14px"}}>
      <div style={{fontFamily:"var(--ffd)",fontSize:14,fontWeight:800,color:"var(--t0)",marginBottom:3,letterSpacing:"-.03em"}}>Health Context</div>
      <p style={{fontSize:10,color:"var(--t3)",marginBottom:14,lineHeight:1.5}}>Injected into every AI response to personalize insights</p>
      <div style={{padding:"10px 13px",background:"rgba(0,212,184,.07)",border:"1px solid rgba(0,212,184,.2)",borderRadius:12,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
          <span style={{fontSize:14}}>🧬</span>
          <span style={{fontSize:10,fontWeight:700,color:"var(--bio)",textTransform:"uppercase",letterSpacing:".05em"}}>Biological Age</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:4}}>
          <span style={{fontFamily:"var(--ffd)",fontSize:28,fontWeight:900,color:"var(--bio)",lineHeight:1}}>{USER.bioAge}</span>
          <span style={{fontSize:11,color:"var(--t3)"}}>vs {USER.age} chron.</span>
        </div>
        <span className="badge b-g">↓ 3.0yr improved · 12 months</span>
      </div>
      <div style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Biomarkers</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
        {USER.biomarkers.map(b=><CtxCard key={b.k} metric={b.k} val={b.v} status={b.s} sub={`Ref: ${b.ref}`} delta={b.imp}/>)}
      </div>
      <div style={{fontSize:10,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Wearable Metrics</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
        {USER.wearable.map(w=><CtxCard key={w.k} metric={w.k} val={w.v} status={w.s} delta={w.d}/>)}
      </div>
      <div style={{fontSize:10,color:"var(--t4)",lineHeight:1.6,padding:"8px 10px",background:"var(--muted)",borderRadius:8}}>
        🔒 Context is injected server-side. Health data is never sent to LLM providers in identifiable form.
      </div>
    </div>
  );
}

function ProtocolsScreen(){
  return(
    <div style={{height:"100%",overflowY:"auto",padding:"18px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <h2 style={{fontFamily:"var(--ffd)",fontSize:20,fontWeight:900,color:"var(--t0)",letterSpacing:"-.04em",marginBottom:2}}>My Protocols</h2>
          <p style={{fontSize:12,color:"var(--t3)"}}>AI-generated protocols saved from conversations</p>
        </div>
        <span className="badge b-bio">{PROTOCOLS.filter(p=>p.status==="active").length} active</span>
      </div>
      {PROTOCOLS.map((pr,i)=>(
        <div key={i} className={`fu${Math.min(i+1,5)} glass gh`} style={{padding:"13px 15px",marginBottom:9,borderLeft:`3px solid ${pr.c}`}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <div style={{width:38,height:38,borderRadius:11,background:`${pr.c}18`,border:`1px solid ${pr.c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{pr.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,fontWeight:700,color:"var(--t1)"}}>{pr.title}</span>
                <span className={`badge ${pr.status==="completed"?"b-g":"b-dim"}`} style={{fontSize:9,flexShrink:0,marginLeft:6}}>{pr.status}</span>
              </div>
              <p style={{fontSize:11,color:"var(--t3)",marginBottom:7}}>{pr.signal} · {pr.date}</p>
              <div className="pbar"><div className="pfill" style={{width:`${pr.pct}%`,background:pr.c}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                <span style={{fontSize:10,fontWeight:700,color:"var(--green)"}}>{pr.impact}</span>
                <span style={{fontSize:10,color:"var(--t3)"}}>{pr.pct}% adherence</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:7,marginTop:10}}>
            <button className="btn-g" style={{flex:1,fontSize:11}}>View Details</button>
            <button className="btn-g" style={{fontSize:11}}>Ask AI →</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SettingsScreen(){
  const [model,setModel]=useState("gpt4o");
  const [prefs,setPrefs]=useState({proactive:true,citations:true,disclaimer:true,voice:false});
  const tog=k=>setPrefs(p=>({...p,[k]:!p[k]}));
  function Toggle({on,k}){
    return(
      <div className="tog" style={{background:on?"var(--bio)":"var(--rim)"}} onClick={()=>tog(k)}>
        <div className="tog-k" style={{transform:on?"translateX(20px)":"translateX(2px)"}}/>
      </div>
    );
  }
  return(
    <div style={{height:"100%",overflowY:"auto",padding:"18px"}}>
      <h2 style={{fontFamily:"var(--ffd)",fontSize:20,fontWeight:900,color:"var(--t0)",letterSpacing:"-.04em",marginBottom:3}}>AI Settings</h2>
      <p style={{fontSize:12,color:"var(--t3)",marginBottom:18}}>Configure AI behavior, model selection, and privacy</p>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:10}}>LLM Model</div>
        <div style={{display:"flex",gap:9}}>
          {[{id:"gpt4o",n:"GPT-4o",sub:"OpenAI · Default",ic:"🤖"},{id:"claude",n:"Claude 3.5",sub:"Anthropic · Alt.",ic:"🧠"}].map(m=>(
            <div key={m.id} className="glass gh" onClick={()=>setModel(m.id)}
              style={{flex:1,padding:"12px 14px",borderColor:model===m.id?"var(--bio)":"var(--b1)",background:model===m.id?"rgba(0,212,184,.06)":undefined,transition:"all .2s"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}>
                <span style={{fontSize:16}}>{m.ic}</span>
                <span style={{fontSize:13,fontWeight:700,color:model===m.id?"var(--bio)":"var(--t1)"}}>{m.n}</span>
                {model===m.id&&<span className="badge b-bio" style={{fontSize:8,marginLeft:"auto"}}>Active</span>}
              </div>
              <div style={{fontSize:10,color:"var(--t3)"}}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:10}}>Preferences</div>
        <div className="glass" style={{overflow:"hidden"}}>
          {[
            {k:"proactive",l:"Proactive health alerts",sub:"Notify when data triggers AI insights"},
            {k:"citations",l:"Show data citations",sub:"'Based on your data' panel in responses"},
            {k:"disclaimer",l:"Medical disclaimers",sub:"Append disclaimer to all responses (recommended)"},
            {k:"voice",l:"Voice mode",sub:"Voice-to-text + TTS responses (Beta)"},
          ].map((item,i,a)=>(
            <div key={item.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",borderBottom:i<a.length-1?"1px solid var(--b1)":"none"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"var(--t1)",marginBottom:1}}>{item.l}</div>
                <div style={{fontSize:10,color:"var(--t3)"}}>{item.sub}</div>
              </div>
              <Toggle on={prefs[item.k]} k={item.k}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"12px 14px",background:"rgba(123,111,240,.07)",border:"1px solid rgba(123,111,240,.2)",borderRadius:12,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--lilac)",marginBottom:4}}>🔒 AI Data Consent Active</div>
        <p style={{fontSize:11,color:"var(--t3)",lineHeight:1.55}}>You consented to AI analysis of health data on Feb 14, 2025. Conversations are encrypted (AES-256) and PHI is never sent to LLM providers in identifiable form.</p>
        <button className="btn-g" style={{marginTop:10,fontSize:11,width:"100%"}}>Manage Consent & Delete History</button>
      </div>
      <button className="btn-bio" style={{width:"100%"}}>Save Settings</button>
    </div>
  );
}

/* NAV CONFIG */
const SCREENS=[
  {id:"chat",label:"AI Clinician",icon:"🤖",mb:"Chat"},
  {id:"history",label:"History",icon:"💬",mb:"History"},
  {id:"protocols",label:"Protocols",icon:"📋",mb:"Protocols"},
  {id:"context",label:"Health Context",icon:"🧬",mb:"Context"},
  {id:"settings",label:"Settings",icon:"⚙️",mb:"Settings"},
];

function getScreen(id,{msgs,typing,onSend,input,setInput,chatRef,goChat}){
  switch(id){
    case"chat":return<ChatView msgs={msgs} typing={typing} onSend={onSend} input={input} setInput={setInput} chatRef={chatRef}/>;
    case"history":return<HistoryScreen onSelect={goChat}/>;
    case"protocols":return<ProtocolsScreen/>;
    case"context":return<ContextPanel/>;
    case"settings":return<SettingsScreen/>;
    default:return null;
  }
}

/* WEB LAYOUT */
function WebLayout({screen,setScreen,msgs,typing,onSend,input,setInput,chatRef}){
  const ctx={msgs,typing,onSend,input,setInput,chatRef,goChat:()=>setScreen("chat")};
  return(
    <div style={{display:"flex",height:720,borderRadius:14,overflow:"hidden",boxShadow:"0 48px 120px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.06) inset"}}>
      {/* Sidebar */}
      <div style={{width:216,background:"var(--void)",borderRight:"1px solid var(--b1)",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"16px 14px 14px",borderBottom:"1px solid var(--b1)"}}><Logo sz={26}/></div>
        <div style={{flex:1,padding:"12px 8px",overflowY:"auto"}}>
          <div style={{padding:"8px 10px",marginBottom:14,background:"rgba(0,212,184,.07)",borderRadius:10,border:"1px solid rgba(0,212,184,.15)"}}>
            <AIClinBadge/>
          </div>
          <div style={{fontSize:9,fontWeight:700,color:"var(--t4)",textTransform:"uppercase",letterSpacing:".1em",padding:"0 8px",marginBottom:5}}>AI Features</div>
          {SCREENS.map(s=>(
            <button key={s.id} onClick={()=>setScreen(s.id)} className={`snav ${screen===s.id?"on":""}`}>
              <span style={{fontSize:15}}>{s.icon}</span>
              <span style={{flex:1}}>{s.label}</span>
              {s.id==="chat"&&<div className="ldot" style={{width:5,height:5}}/>}
            </button>
          ))}
          <div style={{height:1,background:"var(--b1)",margin:"12px 8px"}}/>
          <div style={{fontSize:9,fontWeight:700,color:"var(--t4)",textTransform:"uppercase",letterSpacing:".1em",padding:"0 8px",marginBottom:5}}>Platform</div>
          {[{ic:"👤",l:"Profile"},{ic:"🧬",l:"Bio Age"},{ic:"📡",l:"Metrics"},{ic:"🔗",l:"Devices"}].map(n=>(
            <button key={n.l} className="snav"><span style={{fontSize:14}}>{n.ic}</span>{n.l}</button>
          ))}
        </div>
        <div style={{padding:"10px 12px",borderTop:"1px solid var(--b1)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,var(--lilac),var(--v2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👤</div>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:"var(--t1)"}}>Alex Johnson</p>
              <p style={{fontSize:9,color:"var(--t3)"}}>TechCorp Wellness Plan</p>
            </div>
          </div>
        </div>
      </div>
      {/* Center */}
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"var(--deep)",overflow:"hidden"}}>
        <div style={{padding:"12px 20px",borderBottom:"1px solid var(--b1)",background:"var(--base)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          {screen==="chat"?<AIClinBadge/>:<div style={{fontFamily:"var(--ffd)",fontSize:17,fontWeight:800,color:"var(--t0)",letterSpacing:"-.03em"}}>{SCREENS.find(s=>s.id===screen)?.label}</div>}
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            {screen==="chat"&&msgs.length>0&&<span className="badge b-dim" style={{fontSize:10}}>GPT-4o · Context active</span>}
            <button className="btn-icon">🔄</button>
            <button className="btn-icon">⋯</button>
          </div>
        </div>
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {getScreen(screen,ctx)}
        </div>
      </div>
      {/* Right context */}
      {screen==="chat"&&(
        <div style={{width:236,background:"var(--base)",borderLeft:"1px solid var(--b1)",flexShrink:0}}>
          <div style={{padding:"12px 14px 10px",borderBottom:"1px solid var(--b1)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".07em"}}>Health Context</div>
            <div style={{fontSize:8,color:"var(--t4)",marginTop:1}}>Injected into every AI response</div>
          </div>
          <ContextPanel/>
        </div>
      )}
    </div>
  );
}

/* MOBILE LAYOUT */
function MobileLayout({screen,setScreen,msgs,typing,onSend,input,setInput,chatRef}){
  const ctx={msgs,typing,onSend,input,setInput,chatRef,goChat:()=>setScreen("chat")};
  return(
    <div style={{width:390,margin:"0 auto",borderRadius:48,overflow:"hidden",boxShadow:"0 48px 120px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.08) inset",background:"var(--void)",border:"11px solid #0E1420",display:"flex",flexDirection:"column",height:790}}>
      {/* Status bar */}
      <div style={{height:44,background:"var(--void)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",flexShrink:0,position:"relative"}}>
        <span style={{fontSize:12,fontWeight:700,color:"var(--t2)"}}>9:41</span>
        <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:96,height:22,background:"#000",borderRadius:11}}/>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          <div style={{display:"flex",gap:1.5,alignItems:"flex-end"}}>
            {[3,4,5,6].map(h=><div key={h} style={{width:3,height:h*2,background:"var(--t2)",borderRadius:1}}/>)}
          </div>
          <svg width="15" height="10" viewBox="0 0 24 12" fill="none">
            <rect x="0" y="1" width="20" height="10" rx="2.5" stroke="rgba(255,255,255,.5)" strokeWidth="1.5"/>
            <rect x="21" y="3.5" width="3" height="5" rx="1" fill="rgba(255,255,255,.3)"/>
            <rect x="1" y="2" width="14" height="8" rx="1.5" fill="#22C55E"/>
          </svg>
        </div>
      </div>
      {/* App header */}
      <div style={{padding:"7px 18px 10px",background:"var(--base)",borderBottom:"1px solid var(--b1)",flexShrink:0}}>
        {screen==="chat"
          ?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <AIClinBadge/>
            <div style={{display:"flex",gap:6}}>
              {msgs.length>0&&<button className="btn-icon" style={{width:30,height:30,fontSize:12}}>🔄</button>}
              <button className="btn-icon" style={{width:30,height:30,fontSize:12}}>⋯</button>
            </div>
          </div>
          :<div style={{display:"flex",alignItems:"center",gap:9}}>
            <button className="btn-icon" style={{width:28,height:28,fontSize:12}} onClick={()=>setScreen("chat")}>←</button>
            <span style={{fontFamily:"var(--ffd)",fontSize:16,fontWeight:800,color:"var(--t0)",letterSpacing:"-.03em"}}>{SCREENS.find(s=>s.id===screen)?.label}</span>
          </div>}
      </div>
      {/* Content */}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {getScreen(screen,ctx)}
      </div>
      {/* Tab bar */}
      <div className="tbar" style={{flexShrink:0}}>
        {SCREENS.map(s=>(
          <button key={s.id} className="tbtn" onClick={()=>setScreen(s.id)}>
            <span style={{fontSize:20}}>{s.icon}</span>
            <span style={{fontSize:9,fontWeight:screen===s.id?700:400,color:screen===s.id?"var(--bio)":"var(--t4)"}}>{s.mb}</span>
            {screen===s.id&&<span style={{width:3,height:3,borderRadius:"50%",background:"var(--bio)",position:"absolute",bottom:1}}/>}
            {s.id==="chat"&&screen!=="chat"&&<span className="ldot" style={{width:5,height:5,position:"absolute",top:2,right:"22%"}}/>}
          </button>
        ))}
      </div>
      <div style={{background:"var(--void)",paddingBottom:10,paddingTop:6,display:"flex",justifyContent:"center",flexShrink:0}}>
        <div style={{width:110,height:4,borderRadius:2,background:"rgba(255,255,255,.14)"}}/>
      </div>
    </div>
  );
}

/* ROOT */
export default function App(){
  const [view,setView]=useState("web");
  const [screen,setScreen]=useState("chat");
  const [chatMode,setChatMode]=useState("demo");
  const [msgs,setMsgs]=useState(DEMO_MSGS);
  const [input,setInput]=useState("");
  const [typing,setTyping]=useState(false);
  const chatRef=useRef(null);

  useEffect(()=>{
    if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight;
  },[msgs,typing]);

  const onSend=useCallback(async(override)=>{
    const text=(override||input).trim();
    if(!text)return;
    const now=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    setMsgs(prev=>[...prev,{role:"user",content:text,time:now}]);
    setInput("");
    setTyping(true);
    await new Promise(r=>setTimeout(r,2200));
    const isProto=text.toLowerCase().includes("protocol")||text.toLowerCase().includes("plan");
    const reply={
      role:"ai",
      time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
      type:isProto?"protocol":"insight",
      content:isProto
        ?"Based on your full health profile, here is your personalized protocol:"
        :`Based on your current health data, here's what I can share:\n\nYour **hs-CRP of 1.2 mg/L** and **sleep efficiency of 76%** are the two metrics most relevant here — they're connected. Poor sleep is a well-established upstream driver of systemic inflammation.\n\n• Your **HRV of 62 ms** shows your autonomic nervous system is resilient despite the inflammatory signal\n• Your **Biological Age of 31.2** is already below your calendar age — excellent trajectory\n• The most impactful next step is **improving sleep quality first**, as it is the upstream driver of your hs-CRP elevation`,
      citations:[
        {m:"hs-CRP",v:"1.2 mg/L",src:"Lab Panel · Mar 5"},
        {m:"Sleep Eff.",v:"76% (7d)",src:"Oura Ring · Mar 8"},
        {m:"HRV",v:"62 ms",src:"Oura Ring · Mar 8"},
        {m:"Bio Age",v:"31.2 yrs",src:"F-003 · Mar 8"},
      ],
      followUps:["How do I improve sleep efficiency?","Is my HRV good for my age?","Show me a full protocol"],
      ...(isProto?{
        isProtocol:true,
        protocol:{
          title:"Personalized Health Optimization Protocol",
          signal:"hs-CRP 1.2 mg/L · Sleep Efficiency 76%",
          impact:"Est. −0.8 to −1.2 yrs bio age over 90 days",
          items:[
            {cat:"🥗",label:"Nutrition",color:"#22C55E",ev:"A",action:"Mediterranean diet + 2g EPA/DHA daily",impact:"hs-CRP −0.3 mg/L",time:"60–90d"},
            {cat:"😴",label:"Sleep",color:"#38BDF8",ev:"A",action:"10:30 PM–6:30 AM · no screens 90 min pre-bed",impact:"Sleep eff. +8%",time:"14–30d"},
            {cat:"💊",label:"Supplements",color:"#A89CFF",ev:"B",action:"Curcumin 500mg + Vit D3 2,000 IU",impact:"hs-CRP −0.15 mg/L",time:"30–60d"},
            {cat:"🏃",label:"Exercise",color:"#F59E0B",ev:"A",action:"3× Zone 2 cardio · 45 min per session",impact:"HRV +5 ms",time:"45–60d"},
          ],
          monitor:["hs-CRP","Sleep efficiency","HRV rMSSD"],
          retest:"Retest biomarker panel in 90 days",
        }
      }:{}),
    };
    setTyping(false);
    setMsgs(prev=>[...prev,reply]);
  },[input]);

  const switchMode=m=>{setChatMode(m);setMsgs(m==="demo"?DEMO_MSGS:[]);setInput("");setTyping(false);};
  const isMob=view==="mobile";

  return(
    <>
      <style>{STYLES}</style>
      <div style={{minHeight:"100vh",
        background:"radial-gradient(ellipse 70% 45% at 50% -5%,rgba(0,212,184,.09) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 100% 100%,rgba(123,111,240,.07) 0%,transparent 55%),var(--void)",
        display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 14px 44px"}}>

        {/* Control bar */}
        <div style={{width:"100%",maxWidth:1200,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Logo sz={28}/>
            <div style={{width:1,height:22,background:"var(--b2)"}}/>
            <div>
              <div style={{fontSize:9,color:"var(--t4)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>UI Prototype</div>
              <div style={{display:"flex",gap:5}}>
                <span className="badge b-bio" style={{fontSize:9}}>F-007 · AI Clinician</span>
                <span className="badge b-v" style={{fontSize:9}}>GPT-4o + Claude</span>
                <span className="badge b-g" style={{fontSize:9}}>5 Screens</span>
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:2,background:"var(--muted)",borderRadius:9,padding:3,border:"1px solid var(--b1)"}}>
              {[["empty","📭 Empty"],["demo","💬 Demo"],["live","⚡ Live"]].map(([m,lb])=>(
                <button key={m} onClick={()=>switchMode(m)}
                  style={{padding:"5px 12px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"var(--ff)",fontSize:11,fontWeight:700,transition:"all .15s",
                    background:chatMode===m?"var(--bio)":"transparent",color:chatMode===m?"#021017":"var(--t3)",boxShadow:chatMode===m?"0 2px 8px var(--bioglow)":"none"}}>{lb}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:2,background:"var(--muted)",borderRadius:9,padding:3,border:"1px solid var(--b1)"}}>
              {[["mobile","📱 Mobile"],["web","🖥 Web"]].map(([m,lb])=>(
                <button key={m} onClick={()=>setView(m)}
                  style={{padding:"5px 14px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:"var(--ff)",fontSize:12,fontWeight:700,transition:"all .15s",
                    background:view===m?"var(--v)":"transparent",color:view===m?"white":"var(--t3)",boxShadow:view===m?"0 2px 8px var(--vglow)":"none"}}>{lb}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Screen pills */}
        <div style={{width:"100%",maxWidth:1200,display:"flex",gap:6,marginBottom:16,justifyContent:"center",flexWrap:"wrap"}}>
          {SCREENS.map(s=>(
            <button key={s.id} onClick={()=>setScreen(s.id)}
              style={{padding:"4px 13px",borderRadius:999,border:`1px solid ${screen===s.id?"transparent":"rgba(0,212,184,.16)"}`,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"var(--ff)",transition:"all .18s",
                background:screen===s.id?"var(--bio)":"rgba(0,212,184,.07)",color:screen===s.id?"#021017":"var(--bio)",boxShadow:screen===s.id?"0 2px 12px var(--bioglow)":"none"}}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Device */}
        <div style={{width:"100%",maxWidth:isMob?420:1200}}>
          {isMob
            ?<MobileLayout screen={screen} setScreen={setScreen} msgs={msgs} typing={typing} onSend={onSend} input={input} setInput={setInput} chatRef={chatRef}/>
            :<div style={{borderRadius:14,overflow:"hidden",boxShadow:"0 48px 120px rgba(0,0,0,.75),0 0 0 1px rgba(255,255,255,.07) inset"}}>
              <div style={{background:"#141B26",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{display:"flex",gap:5}}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c=><div key={c} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}
                </div>
                <div style={{flex:1,background:"rgba(255,255,255,.05)",borderRadius:6,padding:"5px 12px",fontSize:11,color:"var(--t3)",display:"flex",alignItems:"center",gap:7}}>
                  <span style={{color:"var(--green)",fontSize:12}}>🔒</span>
                  app.betterhumans.com/ai-clinician
                </div>
                <span className="badge b-bio" style={{fontSize:9}}>F-007 Live</span>
                <span className="badge b-v" style={{fontSize:9}}>GPT-4o</span>
              </div>
              <WebLayout screen={screen} setScreen={setScreen} msgs={msgs} typing={typing} onSend={onSend} input={input} setInput={setInput} chatRef={chatRef}/>
            </div>}
        </div>

        {/* Legend */}
        <div style={{marginTop:20,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",maxWidth:920}}>
          {[
            ["var(--bio)","AI Chat · Streaming with typing & wave animation"],
            ["var(--v)","History · Multi-turn conversation management"],
            ["var(--amber)","Protocol Cards · Ranked intervention plans with evidence levels"],
            ["var(--green)","Context Panel · Live biomarker + wearable data citations"],
            ["var(--red)","Risk Alerts · Proactive threshold-triggered notifications"],
            ["var(--lilac)","Protocols Library · Progress tracking & adherence"],
          ].map(([c,lb])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:999,background:`${c}0c`,border:`1px solid ${c}1e`}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{fontSize:10,color:c,fontWeight:500}}>{lb}</span>
            </div>
          ))}
        </div>
        <p style={{color:"rgba(255,255,255,.08)",fontSize:10,marginTop:14,letterSpacing:".05em",textAlign:"center"}}>
          BetterHuman · F-007 AI Clinician · Interactive Prototype · Web + Mobile · Switch Demo/Empty/Live · All 5 screens navigable
        </p>
      </div>
    </>
  );
}
