import { useState, useEffect, useRef } from "react";

// ─── Color System from logo ───────────────────────────────────────────────
// Primary: #7C6CF6 (logo purple), #6B5CE7 (deeper), #9B8FF8 (light)
// Dark: #1A1A2E (navy), #16213E, #0F172A
// Accent: #A78BFA, #C4B5FD
// Success: #10B981, Surface: #F8F7FF

const SCREENS = ["login", "onboarding_1", "onboarding_2", "onboarding_3", "onboarding_4", "profile", "timeline", "goals", "privacy"];

const SCREEN_LABELS = {
  login: "Login",
  onboarding_1: "Step 1 · Basic Info",
  onboarding_2: "Step 2 · Body Stats",
  onboarding_3: "Step 3 · Health History",
  onboarding_4: "Step 4 · Goals",
  profile: "Profile Overview",
  timeline: "Health Timeline",
  goals: "Goals Manager",
  privacy: "Privacy Controls",
};

// ─── Shared Design Tokens ──────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --p50: #F5F3FF;
    --p100: #EDE9FE;
    --p200: #DDD6FE;
    --p300: #C4B5FD;
    --p400: #A78BFA;
    --p500: #8B5CF6;
    --p600: #7C6CF6;
    --p700: #6B5CE7;
    --p800: #5B4FD6;
    --p900: #4338CA;
    --navy: #1A1A2E;
    --navy2: #16213E;
    --navy3: #0F172A;
    --surface: #F8F7FF;
    --surface2: #FFFFFF;
    --text1: #1A1A2E;
    --text2: #4B4B6B;
    --text3: #8B8BAD;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
    --border: #E8E4FF;
    --shadow: 0 4px 24px rgba(124,108,246,0.12);
    --shadow-lg: 0 12px 48px rgba(124,108,246,0.2);
    --radius: 16px;
    --radius-sm: 10px;
    --radius-lg: 24px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--text1); }

  .sora { font-family: 'Sora', sans-serif; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--p300); border-radius: 4px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp 0.5s ease forwards; }
  .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.4s ease both; }

  /* Input styles */
  .input-field {
    width: 100%; padding: 13px 16px 13px 44px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    color: var(--text1); background: white;
    transition: all 0.2s ease; outline: none;
  }
  .input-field:focus { border-color: var(--p600); box-shadow: 0 0 0 3px rgba(124,108,246,0.12); }
  .input-field::placeholder { color: var(--text3); }
  .input-field.no-icon { padding-left: 16px; }

  /* Button styles */
  .btn-primary {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--p600) 0%, var(--p700) 100%);
    color: white; border: none; border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease; letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(124,108,246,0.35);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(124,108,246,0.45); }
  .btn-primary:active { transform: translateY(0); }

  .btn-outline {
    width: 100%; padding: 13px;
    background: transparent; color: var(--p600);
    border: 1.5px solid var(--p300); border-radius: var(--radius-sm);
    font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: all 0.2s ease;
  }
  .btn-outline:hover { background: var(--p50); border-color: var(--p600); }

  /* Card */
  .card {
    background: white; border-radius: var(--radius);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }

  /* Tag / Badge */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
  }
  .tag-purple { background: var(--p100); color: var(--p700); }
  .tag-green { background: #D1FAE5; color: #065F46; }
  .tag-orange { background: #FEF3C7; color: #92400E; }
  .tag-red { background: #FEE2E2; color: #991B1B; }
  .tag-gray { background: #F3F4F6; color: #374151; }
`;

// ─── Logo Component ────────────────────────────────────────────────────────
function Logo({ size = 40, showText = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="url(#logoGrad)" />
        {/* Plus icon */}
        <rect x="18" y="10" width="12" height="12" rx="3" fill="white" opacity="0.9"/>
        <rect x="18" y="10" width="12" height="12" rx="3" fill="white"/>
        <rect x="26" y="10" width="12" height="12" rx="3" fill="white" opacity="0.7"/>
        {/* Hand / care symbol */}
        <path d="M14 28 Q12 24 16 22 Q18 21 20 23 L24 28 L28 23 Q30 21 32 22 Q36 24 34 28 L24 38 Z" fill="white" opacity="0.95"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#8B6CF6"/>
            <stop offset="100%" stopColor="#6B5CE7"/>
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#1A1A2E", letterSpacing: "-0.02em" }}>
          Better<span style={{ color: "#7C6CF6" }}>Human</span>
        </span>
      )}
    </div>
  );
}

// ─── Progress Steps ────────────────────────────────────────────────────────
function OnboardingProgress({ step }) {
  const steps = ["Basic Info", "Body Stats", "Health History", "Goals"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: i < step ? "#7C6CF6" : i === step ? "white" : "#F0EDFF",
              border: i === step ? "2px solid #7C6CF6" : i < step ? "none" : "2px solid #DDD6FE",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: i < step ? "white" : i === step ? "#7C6CF6" : "#A78BFA",
              fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif",
              boxShadow: i === step ? "0 0 0 4px rgba(124,108,246,0.15)" : "none",
              transition: "all 0.3s ease",
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 10, color: i === step ? "#7C6CF6" : "#A78BFA", fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < step ? "#7C6CF6" : "#EDE9FE", margin: "0 6px", marginBottom: 16, transition: "all 0.3s ease" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Mobile Frame ──────────────────────────────────────────────────────────
function MobileFrame({ children, bg = "var(--surface)" }) {
  return (
    <div style={{
      width: 390, minHeight: 844,
      background: bg,
      borderRadius: 44,
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.2)",
      position: "relative",
      border: "10px solid #1A1A2E",
    }}>
      {/* Status bar */}
      <div style={{ height: 44, background: "transparent", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[4,3,2].map(h => <div key={h} style={{ width: 3, height: h*3, background: "#1A1A2E", borderRadius: 1 }} />)}
          <div style={{ width: 15, height: 10, border: "1.5px solid #1A1A2E", borderRadius: 2, marginLeft: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "#1A1A2E", borderRadius: 1 }} />
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 44, height: "100%", overflowY: "auto" }}>{children}</div>
    </div>
  );
}

// ─── Screen: Login ─────────────────────────────────────────────────────────
function LoginScreen({ onNavigate }) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div style={{ minHeight: 800, background: "linear-gradient(160deg, #F5F3FF 0%, #EDE9FE 40%, #F8F7FF 100%)", padding: "60px 28px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Logo */}
      <div className="fade-up" style={{ marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>
        <Logo size={56} />
      </div>
      <h1 className="sora fade-up-1" style={{ fontSize: 26, fontWeight: 800, color: "#1A1A2E", marginTop: 16, marginBottom: 4 }}>Welcome Back</h1>
      <p className="fade-up-2" style={{ fontSize: 14, color: "#6B6B9B", marginBottom: 36 }}>Manage your health journey with confidence</p>

      <div className="card fade-up-3" style={{ width: "100%", padding: "28px 24px", borderRadius: 20 }}>
        <h2 className="sora" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: "center", color: "#1A1A2E" }}>Login</h2>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#4B4B6B", marginBottom: 6 }}>Email</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#A78BFA", fontSize: 15 }}>✉</span>
            <input className="input-field" type="email" placeholder="Enter your email" />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#4B4B6B", marginBottom: 6 }}>Password</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#A78BFA", fontSize: 15 }}>🔒</span>
            <input className="input-field" type={showPass ? "text" : "password"} placeholder="Enter your password" style={{ paddingRight: 44 }} />
            <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#A78BFA", fontSize: 15 }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#7C6CF6", fontWeight: 500, cursor: "pointer" }}>Forgot Password?</span>
        </div>

        <button className="btn-primary" onClick={() => onNavigate("onboarding_1")}>Login</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#EDE9FE" }} />
          <span style={{ fontSize: 12, color: "#A78BFA" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#EDE9FE" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {[{ icon: "G", label: "Google" }, { icon: "🍎", label: "Apple" }].map(s => (
            <button key={s.label} style={{ flex: 1, padding: "11px", border: "1.5px solid #EDE9FE", borderRadius: 10, background: "white", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#4B4B6B", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s" }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8B8BAD" }}>
          Don't have an account? <span style={{ color: "#7C6CF6", fontWeight: 600, cursor: "pointer" }} onClick={() => onNavigate("onboarding_1")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

// ─── Screen: Onboarding Step 1 ─────────────────────────────────────────────
function Onboarding1({ onNavigate }) {
  return (
    <div style={{ minHeight: 800, background: "#F8F7FF", padding: "24px 24px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Logo size={32} showText />
        <span className="tag tag-purple">Step 1 of 4</span>
      </div>

      <OnboardingProgress step={1} />

      <div style={{ marginBottom: 20 }}>
        <h2 className="sora" style={{ fontSize: 20, fontWeight: 700, color: "#1A1A2E" }}>Basic Information</h2>
        <p style={{ fontSize: 13, color: "#8B8BAD", marginTop: 4 }}>Tell us a little about yourself</p>
      </div>

      {/* Avatar upload */}
      <div className="fade-up" style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid white", boxShadow: "0 4px 16px rgba(124,108,246,0.2)" }}>
            <span style={{ fontSize: 32 }}>👤</span>
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#7C6CF6", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white", cursor: "pointer" }}>
            <span style={{ color: "white", fontSize: 12 }}>+</span>
          </div>
        </div>
      </div>

      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {["First Name", "Last Name"].map(label => (
          <div key={label}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B9B", marginBottom: 5 }}>{label}</label>
            <input className="input-field no-icon" placeholder={label} />
          </div>
        ))}
      </div>

      {[
        { label: "Email Address", icon: "✉", placeholder: "your@email.com" },
        { label: "Phone Number", icon: "📱", placeholder: "+1 (555) 000-0000" },
      ].map((f, i) => (
        <div key={f.label} className={`fade-up-${i+1}`} style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B9B", marginBottom: 5 }}>{f.label}</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>{f.icon}</span>
            <input className="input-field" placeholder={f.placeholder} />
          </div>
        </div>
      ))}

      <div className="fade-up-2" style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B9B", marginBottom: 5 }}>Date of Birth</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🎂</span>
          <input className="input-field" placeholder="MM / DD / YYYY" />
        </div>
      </div>

      <div className="fade-up-3" style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B9B", marginBottom: 8 }}>Biological Sex</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["Male", "Female", "Intersex", "Prefer not to say"].map((opt, i) => (
            <button key={opt} style={{
              flex: 1, padding: "10px 6px", borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
              background: i === 0 ? "#7C6CF6" : "white",
              color: i === 0 ? "white" : "#6B6B9B",
              border: i === 0 ? "none" : "1.5px solid #EDE9FE",
            }}>{opt}</button>
          ))}
        </div>
      </div>

      <button className="btn-primary fade-up-4" onClick={() => onNavigate("onboarding_2")}>Continue →</button>
    </div>
  );
}

// ─── Screen: Onboarding Step 2 ─────────────────────────────────────────────
function Onboarding2({ onNavigate }) {
  return (
    <div style={{ minHeight: 800, background: "#F8F7FF", padding: "24px 24px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Logo size={32} showText />
        <span className="tag tag-purple">Step 2 of 4</span>
      </div>
      <OnboardingProgress step={2} />

      <div style={{ marginBottom: 20 }}>
        <h2 className="sora" style={{ fontSize: 20, fontWeight: 700 }}>Body Stats</h2>
        <p style={{ fontSize: 13, color: "#8B8BAD", marginTop: 4 }}>Helps calculate your biological age & BMI</p>
      </div>

      {/* US Imperial badge */}
      <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EDE9FE", borderRadius: 8, padding: "6px 12px", marginBottom: 20 }}>
        <span style={{ fontSize: 14 }}>🇺🇸</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#7C6CF6" }}>US Imperial (ft, lbs, in)</span>
      </div>

      {/* Stats Grid */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {[
          { label: "Height", placeholder: "5'10\"", icon: "📏" },
          { label: "Weight", placeholder: "165 lbs", icon: "⚖️" },
          { label: "Body Fat %", placeholder: "e.g. 18%", icon: "💪" },
          { label: "Waist", placeholder: '32"', icon: "📐" },
        ].map(f => (
          <div key={f.label}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B9B", marginBottom: 5 }}>{f.label}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>{f.icon}</span>
              <input className="input-field" placeholder={f.placeholder} style={{ paddingLeft: 38 }} />
            </div>
          </div>
        ))}
      </div>

      {/* BMI Preview Card */}
      <div className="fade-up-2 card" style={{ padding: "16px 20px", marginBottom: 20, background: "linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, color: "#8B6CF6", fontWeight: 500 }}>Estimated BMI</p>
            <p className="sora" style={{ fontSize: 28, fontWeight: 800, color: "#4338CA" }}>23.4</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="tag tag-green">✓ Normal</span>
            <p style={{ fontSize: 11, color: "#8B8BAD", marginTop: 4 }}>Auto-calculated</p>
          </div>
        </div>
        <div style={{ marginTop: 10, height: 6, background: "rgba(255,255,255,0.5)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: "45%", height: "100%", background: "linear-gradient(90deg, #10B981, #7C6CF6)", borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: "#8B8BAD" }}>Underweight</span>
          <span style={{ fontSize: 10, color: "#8B8BAD" }}>Obese</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-outline" onClick={() => onNavigate("onboarding_1")} style={{ width: "auto", padding: "13px 20px" }}>← Back</button>
        <button className="btn-primary" onClick={() => onNavigate("onboarding_3")}>Continue →</button>
      </div>
    </div>
  );
}

// ─── Screen: Onboarding Step 3 ─────────────────────────────────────────────
function Onboarding3({ onNavigate }) {
  const conditions = ["Type 2 Diabetes", "Hypertension", "High Cholesterol", "Heart Disease", "Thyroid Disorder", "Sleep Apnea", "Asthma", "Anxiety/Depression", "Arthritis", "None of the above"];
  const [selected, setSelected] = useState(new Set(["None of the above"]));

  const toggle = (c) => {
    const s = new Set(selected);
    if (s.has(c)) s.delete(c); else s.add(c);
    setSelected(s);
  };

  return (
    <div style={{ minHeight: 800, background: "#F8F7FF", padding: "24px 24px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Logo size={32} showText />
        <span className="tag tag-purple">Step 3 of 4</span>
      </div>
      <OnboardingProgress step={3} />

      <div style={{ marginBottom: 20 }}>
        <h2 className="sora" style={{ fontSize: 20, fontWeight: 700 }}>Health History</h2>
        <p style={{ fontSize: 13, color: "#8B8BAD", marginTop: 4 }}>Helps personalize your risk assessment</p>
      </div>

      <div className="fade-up" style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#4B4B6B", display: "block", marginBottom: 10 }}>Existing Conditions (select all that apply)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {conditions.map(c => (
            <button key={c} onClick={() => toggle(c)} style={{
              padding: "8px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
              background: selected.has(c) ? "#7C6CF6" : "white",
              color: selected.has(c) ? "white" : "#6B6B9B",
              border: selected.has(c) ? "none" : "1.5px solid #EDE9FE",
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="fade-up-1" style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#4B4B6B", display: "block", marginBottom: 8 }}>Current Medications</label>
        <textarea className="input-field no-icon" placeholder="e.g. Metformin 500mg daily, Lisinopril 10mg..." style={{ height: 80, resize: "none", paddingTop: 12 }} />
      </div>

      <div className="fade-up-2" style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#4B4B6B", display: "block", marginBottom: 8 }}>Known Allergies</label>
        <input className="input-field no-icon" placeholder="e.g. Penicillin, Shellfish, Latex..." />
      </div>

      <div className="fade-up-3" style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#4B4B6B", display: "block", marginBottom: 8 }}>Family Medical History</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Heart Disease", "Diabetes", "Cancer", "Stroke", "Alzheimer's", "None known"].map(f => (
            <button key={f} style={{ padding: "7px 12px", borderRadius: 20, fontSize: 12, border: "1.5px solid #EDE9FE", background: "white", color: "#6B6B9B", cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-outline" onClick={() => onNavigate("onboarding_2")} style={{ width: "auto", padding: "13px 20px" }}>← Back</button>
        <button className="btn-primary" onClick={() => onNavigate("onboarding_4")}>Continue →</button>
      </div>
    </div>
  );
}

// ─── Screen: Onboarding Step 4 ─────────────────────────────────────────────
function Onboarding4({ onNavigate }) {
  const goals = [
    { icon: "⚖️", label: "Lose Weight", color: "#F59E0B" },
    { icon: "💪", label: "Build Muscle", color: "#10B981" },
    { icon: "😴", label: "Improve Sleep", color: "#6B5CE7" },
    { icon: "🧘", label: "Reduce Stress", color: "#8B5CF6" },
    { icon: "⚡", label: "Optimize Energy", color: "#F59E0B" },
    { icon: "🫀", label: "Heart Health", color: "#EF4444" },
    { icon: "🔬", label: "Prevent Disease", color: "#0EA5E9" },
    { icon: "⚗️", label: "Balance Hormones", color: "#10B981" },
  ];
  const [selected, setSelected] = useState(new Set(["Improve Sleep", "Optimize Energy"]));

  return (
    <div style={{ minHeight: 800, background: "#F8F7FF", padding: "24px 24px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <Logo size={32} showText />
        <span className="tag tag-purple">Step 4 of 4</span>
      </div>
      <OnboardingProgress step={4} />

      <div style={{ marginBottom: 20 }}>
        <h2 className="sora" style={{ fontSize: 20, fontWeight: 700 }}>Your Health Goals</h2>
        <p style={{ fontSize: 13, color: "#8B8BAD", marginTop: 4 }}>Select up to 5 goals (tap to select)</p>
      </div>

      <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {goals.map((g, i) => {
          const sel = selected.has(g.label);
          return (
            <button key={g.label} onClick={() => {
              const s = new Set(selected);
              if (s.has(g.label)) s.delete(g.label);
              else if (s.size < 5) s.add(g.label);
              setSelected(s);
            }} style={{
              padding: "16px 12px", borderRadius: 14, border: sel ? "none" : "1.5px solid #EDE9FE",
              background: sel ? `linear-gradient(135deg, ${g.color}22, ${g.color}11)` : "white",
              cursor: "pointer", transition: "all 0.2s", textAlign: "center",
              boxShadow: sel ? `0 4px 16px ${g.color}30` : "none",
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{g.icon}</div>
              <div style={{ fontSize: 12, fontWeight: sel ? 600 : 400, color: sel ? g.color : "#6B6B9B" }}>{g.label}</div>
              {sel && <div style={{ width: 20, height: 20, borderRadius: "50%", background: g.color, color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", margin: "8px auto 0" }}>✓</div>}
            </button>
          );
        })}
      </div>

      <div className="card fade-up-2" style={{ padding: "14px 16px", marginBottom: 20, background: "#F5F3FF", border: "none" }}>
        <p style={{ fontSize: 12, color: "#7C6CF6", fontWeight: 600 }}>🎯 {selected.size} of 5 goals selected</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {[...selected].map(s => <span key={s} className="tag tag-purple">{s}</span>)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn-outline" onClick={() => onNavigate("onboarding_3")} style={{ width: "auto", padding: "13px 20px" }}>← Back</button>
        <button className="btn-primary" onClick={() => onNavigate("profile")}>Complete Setup ✓</button>
      </div>
    </div>
  );
}

// ─── Screen: Profile Overview ──────────────────────────────────────────────
function ProfileScreen({ onNavigate }) {
  const completeness = 78;
  return (
    <div style={{ minHeight: 800, background: "#F8F7FF" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D2B55 100%)", padding: "44px 24px 32px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <Logo size={32} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onNavigate("timeline")} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", fontSize: 16 }}>🔔</button>
            <button style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "white", fontSize: 16 }}>⚙️</button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "linear-gradient(135deg, #A78BFA, #7C6CF6)", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid rgba(255,255,255,0.3)", fontSize: 28 }}>👤</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderRadius: "50%", background: "#10B981", border: "2px solid #1A1A2E" }} />
          </div>
          <div>
            <h2 className="sora" style={{ color: "white", fontSize: 20, fontWeight: 700 }}>Alex Johnson</h2>
            <p style={{ color: "#A78BFA", fontSize: 13 }}>Member since Jan 2024</p>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <span className="tag" style={{ background: "rgba(167,139,250,0.2)", color: "#C4B5FD", fontSize: 11 }}>🏢 TechCorp Wellness</span>
            </div>
          </div>
        </div>

        {/* Completeness */}
        <div style={{ marginTop: 20, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#C4B5FD" }}>Profile Completeness</span>
            <span className="sora" style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{completeness}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 3 }}>
            <div style={{ width: `${completeness}%`, height: "100%", background: "linear-gradient(90deg, #A78BFA, #7C6CF6)", borderRadius: 3, transition: "width 0.8s ease" }} />
          </div>
          <p style={{ fontSize: 11, color: "#8B6CF6", marginTop: 4 }}>Add medications to complete your profile</p>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Stats Row */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Age", value: "32", sub: "years", icon: "🎂" },
            { label: "BMI", value: "23.4", sub: "Normal", icon: "⚖️" },
            { label: "Bio Age", value: "28", sub: "years", icon: "🧬" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div className="sora" style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#8B8BAD" }}>{s.label}</div>
              <div style={{ fontSize: 10, color: s.label === "Bio Age" ? "#10B981" : "#7C6CF6", fontWeight: 500 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Active Goals */}
        <div className="fade-up-1" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 className="sora" style={{ fontSize: 15, fontWeight: 700 }}>Active Goals</h3>
            <span style={{ fontSize: 12, color: "#7C6CF6", cursor: "pointer", fontWeight: 500 }} onClick={() => onNavigate("goals")}>Manage →</span>
          </div>
          {[
            { label: "Improve Sleep", progress: 65, color: "#6B5CE7", icon: "😴" },
            { label: "Optimize Energy", progress: 40, color: "#F59E0B", icon: "⚡" },
            { label: "Reduce Stress", progress: 80, color: "#8B5CF6", icon: "🧘" },
          ].map(g => (
            <div key={g.label} className="card" style={{ padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{g.icon} {g.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{g.progress}%</span>
              </div>
              <div style={{ height: 5, background: "#F0EDFF", borderRadius: 3 }}>
                <div style={{ width: `${g.progress}%`, height: "100%", background: g.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "📊", label: "Health Timeline", screen: "timeline" },
            { icon: "🎯", label: "Goals", screen: "goals" },
            { icon: "🔬", label: "Biomarkers", screen: "profile" },
            { icon: "🔒", label: "Privacy", screen: "privacy" },
          ].map(n => (
            <button key={n.label} onClick={() => onNavigate(n.screen)} className="card" style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10, border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <span style={{ fontSize: 22 }}>{n.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{n.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Health Timeline ───────────────────────────────────────────────
function TimelineScreen({ onNavigate }) {
  const events = [
    { type: "biomarker", date: "Mar 8, 2025", title: "Biomarker Panel Completed", summary: "13 markers • 9 optimal, 3 normal, 1 attention", icon: "🔬", color: "#7C6CF6", tag: "Lab Result" },
    { type: "goal", date: "Mar 1, 2025", title: "Goal Achieved: Reduce Stress", summary: "Cortisol levels returned to normal range", icon: "🎯", color: "#10B981", tag: "Achievement" },
    { type: "wearable", date: "Feb 25, 2025", title: "7-Day Sleep Streak", summary: "Avg 7h 45m sleep • HRV improved by 18%", icon: "😴", color: "#6B5CE7", tag: "Milestone" },
    { type: "note", date: "Feb 20, 2025", title: "Health Note", summary: "Started intermittent fasting protocol (16:8)", icon: "📝", color: "#F59E0B", tag: "Note" },
    { type: "biomarker", date: "Jan 15, 2025", title: "Baseline Panel Completed", summary: "First biomarker assessment on the platform", icon: "🔬", color: "#7C6CF6", tag: "Lab Result" },
  ];

  return (
    <div style={{ minHeight: 800, background: "#F8F7FF" }}>
      <div style={{ background: "linear-gradient(160deg, #1A1A2E, #2D2B55)", padding: "44px 24px 20px", borderRadius: "0 0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={() => onNavigate("profile")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer", fontSize: 14 }}>← Back</button>
          <h2 className="sora" style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Health Timeline</h2>
        </div>
        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {["All", "Lab Results", "Goals", "Milestones", "Notes"].map((f, i) => (
            <button key={f} style={{ whiteSpace: "nowrap", padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: i === 0 ? "#7C6CF6" : "rgba(255,255,255,0.1)", color: "white" }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #7C6CF6, #EDE9FE)", borderRadius: 2 }} />

          {events.map((e, i) => (
            <div key={i} className={`fade-up-${Math.min(i, 4)}`} style={{ display: "flex", gap: 16, marginBottom: 16, position: "relative" }}>
              {/* Dot */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${e.color}20`, border: `2px solid ${e.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, zIndex: 1, background: "white", boxShadow: `0 0 0 4px ${e.color}15` }}>
                {e.icon}
              </div>
              <div className="card" style={{ flex: 1, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{e.title}</span>
                  <span className="tag" style={{ background: `${e.color}15`, color: e.color, fontSize: 10 }}>{e.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: "#8B8BAD", marginBottom: 4 }}>{e.summary}</p>
                <span style={{ fontSize: 11, color: "#B8B8D0" }}>{e.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Add Note FAB */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <button className="btn-primary" style={{ width: "auto", padding: "12px 28px", borderRadius: 30 }}>+ Add Health Note</button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Goals Manager ─────────────────────────────────────────────────
function GoalsScreen({ onNavigate }) {
  const goals = [
    { icon: "😴", label: "Improve Sleep", progress: 65, color: "#6B5CE7", target: "7h 30m avg", date: "Apr 2025", status: "active" },
    { icon: "⚡", label: "Optimize Energy", progress: 40, color: "#F59E0B", target: "Energy score > 80", date: "Jun 2025", status: "active" },
    { icon: "🧘", label: "Reduce Stress", progress: 100, color: "#10B981", target: "Cortisol normal", date: "Mar 2025", status: "achieved" },
    { icon: "⚖️", label: "Lose Weight", progress: 22, color: "#EF4444", target: "Target: 155 lbs", date: "Dec 2025", status: "active" },
  ];
  return (
    <div style={{ minHeight: 800, background: "#F8F7FF" }}>
      <div style={{ background: "linear-gradient(160deg, #1A1A2E, #2D2B55)", padding: "44px 24px 20px", borderRadius: "0 0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <button onClick={() => onNavigate("profile")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer" }}>← Back</button>
          <h2 className="sora" style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Health Goals</h2>
        </div>
        <p style={{ color: "#A78BFA", fontSize: 13, marginLeft: 70 }}>4 goals · 1 achieved</p>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {goals.map((g, i) => (
          <div key={g.label} className={`card fade-up-${i}`} style={{ padding: "16px", marginBottom: 12, borderLeft: `4px solid ${g.color}`, position: "relative", overflow: "hidden" }}>
            {g.status === "achieved" && (
              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <span className="tag tag-green">✓ Achieved</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${g.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 2 }}>{g.label}</h4>
                <p style={{ fontSize: 12, color: "#8B8BAD", marginBottom: 8 }}>{g.target} · {g.date}</p>
                <div style={{ height: 6, background: "#F0EDFF", borderRadius: 3 }}>
                  <div style={{ width: `${g.progress}%`, height: "100%", background: g.status === "achieved" ? "#10B981" : g.color, borderRadius: 3, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "#B8B8D0" }}>Progress</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{g.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="btn-outline" style={{ marginTop: 8 }}>+ Add New Goal</button>
      </div>
    </div>
  );
}

// ─── Screen: Privacy Controls ──────────────────────────────────────────────
function PrivacyScreen({ onNavigate }) {
  const [settings, setSettings] = useState({
    employerAnonymized: true,
    wearableShare: false,
    biomarkerShare: true,
    aiTraining: false,
    researchParticipation: false,
    emailUpdates: true,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const Toggle = ({ value, onToggle }) => (
    <div onClick={onToggle} style={{
      width: 44, height: 24, borderRadius: 12, cursor: "pointer", transition: "all 0.3s ease",
      background: value ? "#7C6CF6" : "#E5E7EB", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 2, left: value ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "all 0.3s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );

  const privacyGroups = [
    {
      title: "Employer Visibility", icon: "🏢",
      items: [
        { key: "employerAnonymized", label: "Share anonymized wellness data", sub: "Your employer sees aggregate trends only — never individual results" },
        { key: "biomarkerShare", label: "Include biomarker results", sub: "Aggregate biomarker participation rates shared with HR dashboard" },
      ]
    },
    {
      title: "Data Sharing", icon: "🔗",
      items: [
        { key: "wearableShare", label: "Share wearable data externally", sub: "Allow third-party wellness integrations to access step/sleep data" },
        { key: "aiTraining", label: "Contribute to AI model training", sub: "Help improve Better Human's health AI using de-identified data" },
        { key: "researchParticipation", label: "Research participation", sub: "Join anonymized population health research studies" },
      ]
    },
    {
      title: "Communications", icon: "✉️",
      items: [
        { key: "emailUpdates", label: "Health insights emails", sub: "Weekly health summaries and goal progress updates" },
      ]
    }
  ];

  return (
    <div style={{ minHeight: 800, background: "#F8F7FF" }}>
      <div style={{ background: "linear-gradient(160deg, #1A1A2E, #2D2B55)", padding: "44px 24px 20px", borderRadius: "0 0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => onNavigate("profile")} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "8px 12px", color: "white", cursor: "pointer" }}>← Back</button>
          <div>
            <h2 className="sora" style={{ color: "white", fontSize: 18, fontWeight: 700 }}>Privacy & Consent</h2>
            <p style={{ color: "#A78BFA", fontSize: 12, marginTop: 2 }}>Your data, your control</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px" }}>
        {/* HIPAA notice */}
        <div className="fade-up" style={{ background: "linear-gradient(135deg, #EDE9FE, #F5F3FF)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, border: "1px solid #DDD6FE" }}>
          <p style={{ fontSize: 12, color: "#5B4FD6", fontWeight: 600 }}>🔒 HIPAA Protected</p>
          <p style={{ fontSize: 11, color: "#7C6CF6", marginTop: 2 }}>Your health data is encrypted and protected under HIPAA. A Business Associate Agreement is in place with your employer.</p>
        </div>

        {privacyGroups.map((group, gi) => (
          <div key={group.title} className={`fade-up-${gi}`} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{group.icon}</span>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{group.title}</h3>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              {group.items.map((item, ii) => (
                <div key={item.key} style={{ padding: "14px 16px", borderBottom: ii < group.items.length - 1 ? "1px solid #F0EDFF" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1A2E", marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: "#8B8BAD" }}>{item.sub}</p>
                  </div>
                  <Toggle value={settings[item.key]} onToggle={() => toggle(item.key)} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="btn-primary" style={{ marginTop: 8 }}>Save Privacy Settings</button>
      </div>
    </div>
  );
}

// ─── Nav Tab Bar ───────────────────────────────────────────────────────────
function TabBar({ current, onNavigate }) {
  const tabs = [
    { icon: "👤", label: "Profile", screen: "profile" },
    { icon: "📊", label: "Timeline", screen: "timeline" },
    { icon: "🎯", label: "Goals", screen: "goals" },
    { icon: "🔒", label: "Privacy", screen: "privacy" },
  ];
  const active = tabs.find(t => t.screen === current);
  if (!active) return null;
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #EDE9FE", display: "flex", padding: "8px 0 12px", boxShadow: "0 -4px 20px rgba(124,108,246,0.08)" }}>
      {tabs.map(t => (
        <button key={t.screen} onClick={() => onNavigate(t.screen)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, opacity: current === t.screen ? 1 : 0.4 }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 10, fontWeight: current === t.screen ? 700 : 400, color: current === t.screen ? "#7C6CF6" : "#8B8BAD" }}>{t.label}</span>
          {current === t.screen && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#7C6CF6" }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [viewMode, setViewMode] = useState("mobile"); // "mobile" | "web"

  const SCREEN_MAP = {
    login: LoginScreen,
    onboarding_1: Onboarding1,
    onboarding_2: Onboarding2,
    onboarding_3: Onboarding3,
    onboarding_4: Onboarding4,
    profile: ProfileScreen,
    timeline: TimelineScreen,
    goals: GoalsScreen,
    privacy: PrivacyScreen,
  };

  const ScreenComponent = SCREEN_MAP[screen] || ProfileScreen;
  const showTabBar = ["profile", "timeline", "goals", "privacy"].includes(screen);

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #1A1A2E 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28, gap: 8 }}>
          <Logo size={44} showText />
          <p style={{ color: "#A78BFA", fontSize: 13, letterSpacing: "0.05em" }}>User Health Identity Profile — F-001</p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 3, marginBottom: 24, gap: 2 }}>
          {[["mobile", "📱 Mobile"], ["web", "🖥 Web"]].map(([mode, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{ padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s", background: viewMode === mode ? "white" : "transparent", color: viewMode === mode ? "#1A1A2E" : "rgba(255,255,255,0.6)" }}>{label}</button>
          ))}
        </div>

        {/* Screen Navigation */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 28, maxWidth: 800 }}>
          {SCREENS.map(s => (
            <button key={s} onClick={() => setScreen(s)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s",
              background: screen === s ? "#7C6CF6" : "rgba(255,255,255,0.1)",
              color: screen === s ? "white" : "rgba(255,255,255,0.6)",
              boxShadow: screen === s ? "0 4px 12px rgba(124,108,246,0.4)" : "none",
            }}>{SCREEN_LABELS[s]}</button>
          ))}
        </div>

        {/* Device Preview */}
        {viewMode === "mobile" ? (
          <div style={{ position: "relative" }}>
            <MobileFrame>
              <div style={{ paddingBottom: showTabBar ? 70 : 0 }}>
                <ScreenComponent onNavigate={setScreen} />
              </div>
            </MobileFrame>
            {showTabBar && (
              <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
                <TabBar current={screen} onNavigate={setScreen} />
              </div>
            )}
          </div>
        ) : (
          /* Web Layout */
          <div style={{ width: "100%", maxWidth: 1100, background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {/* Browser chrome */}
            <div style={{ background: "#F1F0FF", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #EDE9FE" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ flex: 1, background: "white", borderRadius: 6, padding: "5px 14px", fontSize: 12, color: "#8B8BAD", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔒</span> app.betterhuman.com/profile
              </div>
            </div>
            {/* Web app layout */}
            <div style={{ display: "flex", minHeight: 700 }}>
              {/* Sidebar */}
              <div style={{ width: 240, background: "linear-gradient(180deg, #1A1A2E, #2D2B55)", padding: "24px 0", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <Logo size={32} showText />
                </div>
                <div style={{ padding: "16px 12px", flex: 1 }}>
                  {[
                    { icon: "👤", label: "Profile", screen: "profile" },
                    { icon: "📊", label: "Timeline", screen: "timeline" },
                    { icon: "🎯", label: "Goals", screen: "goals" },
                    { icon: "🔒", label: "Privacy", screen: "privacy" },
                    { icon: "🔬", label: "Biomarkers", screen: "profile" },
                    { icon: "💬", label: "AI Clinician", screen: "profile" },
                  ].map(nav => (
                    <button key={nav.label} onClick={() => setScreen(nav.screen)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, transition: "all 0.2s",
                      background: screen === nav.screen ? "rgba(124,108,246,0.3)" : "transparent",
                      color: screen === nav.screen ? "#C4B5FD" : "rgba(255,255,255,0.5)",
                    }}>
                      <span style={{ fontSize: 16 }}>{nav.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: screen === nav.screen ? 600 : 400 }}>{nav.label}</span>
                      {screen === nav.screen && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#7C6CF6" }} />}
                    </button>
                  ))}
                </div>
                {/* User mini card */}
                <div style={{ margin: "12px", padding: "12px", background: "rgba(255,255,255,0.06)", borderRadius: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #A78BFA, #7C6CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👤</div>
                    <div>
                      <p style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Alex Johnson</p>
                      <p style={{ color: "#A78BFA", fontSize: 10 }}>TechCorp Wellness</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Main content */}
              <div style={{ flex: 1, overflowY: "auto", maxHeight: 700 }}>
                <ScreenComponent onNavigate={setScreen} />
              </div>
            </div>
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 20, letterSpacing: "0.05em" }}>
          Better Human · F-001 · User Health Identity Profile · UI Prototype
        </p>
      </div>
    </>
  );
}
