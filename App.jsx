import { useState, useRef } from "react";

const ADMIN_USER = "admin";
const ADMIN_PASS = "485488";

function generateAccountNo() {
  return "ADB-" + Date.now().toString().slice(-7);
}

function TransactionHistory({ txns }) {
  if (!txns || txns.length === 0)
    return <div style={{ color: "#6b7a99", textAlign: "center", padding: "24px 0", fontSize: 13 }}>ابھی کوئی ٹرانزیکشن نہیں</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: "#0f1b2d" }}>
            {["تاریخ", "قسم", "رقم", "نوٹ", "بیلنس"].map(h => (
              <th key={h} style={{ padding: "9px 12px", color: "#7c8db5", fontWeight: 600, textAlign: "center", borderBottom: "1px solid #1e2d45" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...txns].reverse().map((t, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #1a2640", background: i % 2 === 0 ? "#111d2e" : "#0d1825" }}>
              <td style={{ padding: "8px 12px", color: "#7c8db5", fontSize: 11, textAlign: "center", whiteSpace: "nowrap" }}>{t.date}</td>
              <td style={{ padding: "8px 12px", textAlign: "center" }}>
                <span style={{
                  background: t.type === "جمع" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: t.type === "جمع" ? "#22c55e" : "#ef4444",
                  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700
                }}>{t.type === "جمع" ? "▲ جمع" : "▼ نکاس"}</span>
              </td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: t.type === "جمع" ? "#22c55e" : "#ef4444" }}>
                {t.type === "جمع" ? "+" : "-"}Rs. {t.amount.toLocaleString()}
              </td>
              <td style={{ padding: "8px 12px", color: "#a0aec0", textAlign: "center" }}>{t.note || "—"}</td>
              <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: "#e2b94b" }}>Rs. {t.balance.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrintView({ user }) {
  return (
    <div style={{ fontFamily: "serif", padding: 32, maxWidth: 580, margin: "0 auto", background: "#fff", color: "#000" }}>
      <div style={{ textAlign: "center", borderBottom: "3px double #000", paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 3 }}>ADEEN BANKS LIMITED</div>
        <div style={{ fontSize: 12, marginTop: 2 }}>Account Opening Record — Official Copy</div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Account No: {user.accountNo} | Joined: {user.joinDate}</div>
      </div>
      {user.photo && (
        <img src={user.photo} alt="" style={{ float: "right", width: 80, height: 80, objectFit: "cover", border: "1px solid #000", marginLeft: 16 }} />
      )}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        {[
          ["نام", user.naam], ["والد کا نام", user.walid], ["موبائل نمبر", user.mobile],
          ["جنس", user.jins], ["تاریخ پیدائش", user.dob], ["تعلیم / کلاس", user.taleem],
          ["بالغ / نابالغ", user.baligh], ["علاقہ", user.illaqa], ["صوبہ", user.soba],
          ["شہر", user.sheher], ["تحصیل", user.tehsil], ["ضلع", user.zila],
          ["مکمل پتہ", user.pata], ["بیلنس", "Rs. " + (user.balance || 0).toLocaleString()],
        ].map(([k, v]) => (
          <tr key={k} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: "5px 8px", fontWeight: 700, width: "38%", direction: "rtl", textAlign: "right" }}>{k}</td>
            <td style={{ padding: "5px 8px" }}>{v || "—"}</td>
          </tr>
        ))}
      </table>
      <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #000", paddingTop: 16 }}>
        <div>دستخط سربراہ ادارہ: _______________</div>
        <div>دستخط صارف: _______________</div>
      </div>
      <div style={{ marginTop: 12, fontSize: 10, textAlign: "center", color: "#999" }}>Adeen Banks Limited — Confidential | Password NOT included in print</div>
    </div>
  );
}

const EMPTY_FORM = {
  naam: "", walid: "", mobile: "", jins: "M", dob: "", taleem: "", baligh: "بالغ",
  illaqa: "", soba: "", sheher: "", tehsil: "", zila: "", pata: "",
  username: "", password: "", photo: null
};

const C = {
  bg: "#080f1a", surface: "#0d1825", surface2: "#111d2e", border: "#1a2d45",
  gold: "#e2b94b", goldDim: "#c9a23a", blue: "#3b82f6", green: "#22c55e",
  red: "#ef4444", text: "#e2e8f0", muted: "#7c8db5",
};

const S = {
  wrap: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI','Noto Nastaliq Urdu',sans-serif" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#0a1520", color: C.text, fontSize: 13.5, boxSizing: "border-box", outline: "none", marginBottom: 10 },
  btn: (bg = C.gold, fg = C.bg) => ({ padding: "10px 20px", borderRadius: 8, border: "none", background: bg, color: fg, fontWeight: 700, fontSize: 13, cursor: "pointer" }),
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 22px" },
  label: { display: "block", fontSize: 11.5, color: C.muted, marginBottom: 4, marginTop: 8 },
  tab: (a) => ({ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12.5, background: a ? C.gold : "transparent", color: a ? C.bg : C.muted, transition: "all .2s" }),
  header: { background: C.surface, borderBottom: `2px solid ${C.gold}`, padding: "13px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 },
  statCard: (color) => ({ background: C.surface2, border: `1px solid ${color}33`, borderRadius: 12, padding: "16px 20px", flex: 1, minWidth: 120 }),
  err: { color: C.red, fontSize: 12.5, marginBottom: 10, textAlign: "center" },
  ok: { color: C.green, fontSize: 12.5, marginBottom: 10 },
};

export default function App() {
  const [users, setUsers] = useState([]);
  // page: "login" | "signup" | "admin" | "user"
  const [page, setPage] = useState("login");
  const [loginType, setLoginType] = useState("member"); // "admin" | "member"
  const [loginInput, setLoginInput] = useState({ username: "", password: "" });
  const [loginErr, setLoginErr] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [userTab, setUserTab] = useState("dashboard");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const [search, setSearch] = useState("");
  const [txnInput, setTxnInput] = useState({ type: "جمع", amount: "", note: "" });
  const [txnMsg, setTxnMsg] = useState("");
  const [signupForm, setSignupForm] = useState(EMPTY_FORM);
  const [signupMsg, setSignupMsg] = useState("");
  const [signupStep, setSignupStep] = useState(1); // 1=personal, 2=address, 3=account
  const [newUser, setNewUser] = useState(EMPTY_FORM);
  const [addMsg, setAddMsg] = useState("");
  const photoRef = useRef();
  const signupPhotoRef = useRef();

  // ── LOGIN ──────────────────────────────────────────────────────────────
  function handleLogin(e) {
    e.preventDefault();
    if (loginType === "admin") {
      if (loginInput.username === ADMIN_USER && loginInput.password === ADMIN_PASS) {
        setPage("admin"); setLoginErr(""); setAdminTab("dashboard");
      } else setLoginErr("غلط username یا password");
    } else {
      const u = users.find(u => u.username === loginInput.username && u.password === loginInput.password);
      if (u) { setLoggedUser(u); setPage("user"); setLoginErr(""); setUserTab("dashboard"); }
      else setLoginErr("غلط username یا password");
    }
    setLoginInput({ username: "", password: "" });
  }

  function logout() {
    setPage("login"); setLoggedUser(null); setSelectedUser(null);
    setLoginInput({ username: "", password: "" }); setLoginErr("");
  }

  // ── SIGNUP ─────────────────────────────────────────────────────────────
  function handleSignupPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setSignupForm(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    if (!signupForm.naam) { setSignupMsg("نام ضروری ہے"); return; }
    if (!signupForm.username) { setSignupMsg("Username ضروری ہے"); return; }
    if (!signupForm.password) { setSignupMsg("Password ضروری ہے"); return; }
    if (users.find(u => u.username === signupForm.username)) { setSignupMsg("یہ username پہلے سے موجود ہے"); return; }
    const user = { ...signupForm, accountNo: generateAccountNo(), balance: 0, transactions: [], joinDate: new Date().toLocaleDateString("en-PK") };
    setUsers(p => [...p, user]);
    setSignupMsg("✅ اکاؤنٹ بن گیا! ابھی login کریں۔");
    setTimeout(() => {
      setSignupForm(EMPTY_FORM); setSignupMsg(""); setSignupStep(1);
      setPage("login"); setLoginType("member");
    }, 2000);
  }

  // ── ADMIN ADD MEMBER ───────────────────────────────────────────────────
  function handleAddUser(e) {
    e.preventDefault();
    if (!newUser.naam) { setAddMsg("نام ضروری ہے"); return; }
    if (!newUser.username) { setAddMsg("Username ضروری ہے"); return; }
    if (!newUser.password) { setAddMsg("Password ضروری ہے"); return; }
    if (users.find(u => u.username === newUser.username)) { setAddMsg("یہ username پہلے سے موجود ہے"); return; }
    const user = { ...newUser, accountNo: generateAccountNo(), balance: 0, transactions: [], joinDate: new Date().toLocaleDateString("en-PK") };
    setUsers(p => [...p, user]);
    setNewUser(EMPTY_FORM);
    if (photoRef.current) photoRef.current.value = "";
    setAddMsg("✅ اکاؤنٹ کامیابی سے بنا دیا گیا!");
    setTimeout(() => setAddMsg(""), 3000);
  }

  function handleAdminPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewUser(p => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  // ── TRANSACTION ────────────────────────────────────────────────────────
  function handleTxn(e) {
    e.preventDefault();
    const amt = parseInt(txnInput.amount);
    if (!amt || amt <= 0) { setTxnMsg("صحیح رقم درج کریں"); return; }
    let blocked = false;
    setUsers(prev => prev.map(u => {
      if (u.accountNo !== selectedUser.accountNo) return u;
      const newBal = txnInput.type === "جمع" ? u.balance + amt : u.balance - amt;
      if (newBal < 0) { blocked = true; return u; }
      const txn = { date: new Date().toLocaleString("en-PK"), type: txnInput.type, amount: amt, note: txnInput.note, balance: newBal };
      const updated = { ...u, balance: newBal, transactions: [...u.transactions, txn] };
      setSelectedUser(updated);
      if (loggedUser && loggedUser.accountNo === u.accountNo) setLoggedUser(updated);
      return updated;
    }));
    if (blocked) { setTxnMsg("بیلنس کم ہے — نکاس ممکن نہیں"); return; }
    setTxnInput({ type: "جمع", amount: "", note: "" });
    setTxnMsg("✅ ٹرانزیکشن مکمل!");
    setTimeout(() => setTxnMsg(""), 2500);
  }

  const filtered = users.filter(u =>
    u.naam.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.accountNo.toLowerCase().includes(search.toLowerCase())
  );
  const totalBalance = users.reduce((a, u) => a + u.balance, 0);
  const totalTxns = users.reduce((a, u) => a + u.transactions.length, 0);
  const liveUser = loggedUser ? users.find(u => u.accountNo === loggedUser.accountNo) || loggedUser : null;

  // ══════════════════════════════════════════════════════════════════════
  // PRINT
  // ══════════════════════════════════════════════════════════════════════
  if (showPrint && selectedUser) {
    return (
      <div>
        <div style={{ padding: "10px 16px", background: C.surface, display: "flex", gap: 10, borderBottom: `1px solid ${C.border}` }} className="no-print">
          <button onClick={() => setShowPrint(false)} style={S.btn(C.surface2, C.text)}>← Back</button>
          <button onClick={() => window.print()} style={S.btn(C.gold)}>🖨️ Print</button>
        </div>
        <style>{`@media print { .no-print { display:none!important; } }`}</style>
        <PrintView user={selectedUser} />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // LOGIN PAGE
  // ══════════════════════════════════════════════════════════════════════
  if (page === "login") {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: `radial-gradient(ellipse at 60% 40%, #0d1f3a 0%, #080f1a 70%)` }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.goldDim})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px", boxShadow: `0 0 30px ${C.gold}44` }}>🏦</div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, color: C.gold }}>ADEEN BANKS</div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1 }}>LIMITED — Management Portal</div>
          </div>

          {/* Toggle Admin / Member */}
          <div style={{ display: "flex", background: C.surface2, borderRadius: 10, padding: 4, marginBottom: 20, border: `1px solid ${C.border}` }}>
            {[["admin", "🔐 Admin"], ["member", "👤 Member"]].map(([t, l]) => (
              <button key={t} onClick={() => { setLoginType(t); setLoginErr(""); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: loginType === t ? C.gold : "transparent", color: loginType === t ? C.bg : C.muted, transition: "all .2s" }}>{l}</button>
            ))}
          </div>

          <div style={{ ...S.card, padding: "28px" }}>
            <form onSubmit={handleLogin}>
              <label style={S.label}>Username</label>
              <input style={S.input} value={loginInput.username} onChange={e => setLoginInput(p => ({ ...p, username: e.target.value }))} placeholder="Enter username" autoComplete="off" />
              <label style={S.label}>Password</label>
              <input style={S.input} type="password" value={loginInput.password} onChange={e => setLoginInput(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
              {loginErr && <div style={S.err}>{loginErr}</div>}
              <button type="submit" style={{ ...S.btn(C.gold), width: "100%", padding: "12px", fontSize: 14, marginTop: 4, borderRadius: 10, boxShadow: `0 4px 20px ${C.gold}33` }}>
                {loginType === "admin" ? "Login as Admin" : "Login"}
              </button>
            </form>

            {loginType === "member" && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <span style={{ fontSize: 12, color: C.muted }}>نیا اکاؤنٹ نہیں ہے؟ </span>
                <button onClick={() => { setPage("signup"); setSignupStep(1); setSignupMsg(""); }} style={{ background: "none", border: "none", color: C.gold, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>Sign Up کریں →</button>
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: C.muted }}>Adeen Banks Limited © 2026</div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // SIGNUP PAGE — 3 Steps
  // ══════════════════════════════════════════════════════════════════════
  if (page === "signup") {
    const sf = signupForm;
    const setSF = (k, v) => setSignupForm(p => ({ ...p, [k]: v }));
    return (
      <div style={{ ...S.wrap, background: `radial-gradient(ellipse at 40% 60%, #0d1f3a 0%, #080f1a 70%)`, padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.gold }}>ADEEN BANKS</div>
            <div style={{ fontSize: 11, color: C.muted }}>نیا اکاؤنٹ کھولیں</div>
          </div>

          {/* Step Indicator */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 0 }}>
            {[["1", "ذاتی معلومات"], ["2", "پتہ"], ["3", "اکاؤنٹ"]].map(([num, label], i) => (
              <div key={num} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: signupStep >= parseInt(num) ? C.gold : C.surface2, color: signupStep >= parseInt(num) ? C.bg : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, border: `2px solid ${signupStep >= parseInt(num) ? C.gold : C.border}` }}>{num}</div>
                <div style={{ fontSize: 10, color: signupStep >= parseInt(num) ? C.gold : C.muted, marginTop: 4 }}>{label}</div>
                {i < 2 && <div style={{ position: "absolute" }} />}
              </div>
            ))}
          </div>

          <div style={{ ...S.card, padding: "28px" }}>
            <form onSubmit={signupStep < 3 ? (e) => { e.preventDefault(); setSignupMsg(""); setSignupStep(s => s + 1); } : handleSignupSubmit}>

              {/* Step 1: Personal */}
              {signupStep === 1 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>ذاتی معلومات</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                    <div><label style={S.label}>نام *</label><input style={S.input} value={sf.naam} onChange={e => setSF("naam", e.target.value)} placeholder="پورا نام" /></div>
                    <div><label style={S.label}>والد کا نام</label><input style={S.input} value={sf.walid} onChange={e => setSF("walid", e.target.value)} placeholder="والد کا نام" /></div>
                    <div><label style={S.label}>موبائل نمبر</label><input style={S.input} value={sf.mobile} onChange={e => setSF("mobile", e.target.value)} placeholder="03XX-XXXXXXX" /></div>
                    <div><label style={S.label}>تاریخ پیدائش</label><input style={S.input} value={sf.dob} onChange={e => setSF("dob", e.target.value)} placeholder="DD/MM/YYYY" /></div>
                    <div>
                      <label style={S.label}>جنس</label>
                      <select style={S.input} value={sf.jins} onChange={e => setSF("jins", e.target.value)}>
                        <option value="M">مذکر (Male)</option>
                        <option value="F">مؤنث (Female)</option>
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>بالغ/نابالغ</label>
                      <select style={S.input} value={sf.baligh} onChange={e => setSF("baligh", e.target.value)}>
                        <option value="بالغ">بالغ</option>
                        <option value="نابالغ">نابالغ</option>
                      </select>
                    </div>
                    <div><label style={S.label}>تعلیم/کلاس</label><input style={S.input} value={sf.taleem} onChange={e => setSF("taleem", e.target.value)} placeholder="مثلاً: میٹرک" /></div>
                  </div>
                  <label style={S.label}>تصویر (اختیاری)</label>
                  <input ref={signupPhotoRef} type="file" accept="image/*" style={{ color: C.muted, fontSize: 12, marginBottom: 10 }} onChange={handleSignupPhoto} />
                  {sf.photo && <img src={sf.photo} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}`, marginBottom: 10, display: "block" }} />}
                </div>
              )}

              {/* Step 2: Address */}
              {signupStep === 2 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>پتے کی معلومات</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                    <div><label style={S.label}>علاقہ</label><input style={S.input} value={sf.illaqa} onChange={e => setSF("illaqa", e.target.value)} /></div>
                    <div><label style={S.label}>صوبہ</label><input style={S.input} value={sf.soba} onChange={e => setSF("soba", e.target.value)} /></div>
                    <div><label style={S.label}>شہر</label><input style={S.input} value={sf.sheher} onChange={e => setSF("sheher", e.target.value)} /></div>
                    <div><label style={S.label}>تحصیل</label><input style={S.input} value={sf.tehsil} onChange={e => setSF("tehsil", e.target.value)} /></div>
                    <div><label style={S.label}>ضلع</label><input style={S.input} value={sf.zila} onChange={e => setSF("zila", e.target.value)} /></div>
                  </div>
                  <label style={S.label}>مکمل پتہ</label>
                  <input style={S.input} value={sf.pata} onChange={e => setSF("pata", e.target.value)} placeholder="گھر نمبر، گلی، محلہ..." />
                </div>
              )}

              {/* Step 3: Account */}
              {signupStep === 3 && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>اکاؤنٹ کی معلومات</div>
                  <label style={S.label}>Username * (login کے لیے)</label>
                  <input style={S.input} value={sf.username} onChange={e => setSF("username", e.target.value)} placeholder="مثلاً: ali123" autoComplete="off" />
                  <label style={S.label}>Password *</label>
                  <input style={S.input} type="password" value={sf.password} onChange={e => setSF("password", e.target.value)} placeholder="کم از کم 6 حروف" />
                  <div style={{ background: "rgba(226,185,75,0.07)", border: `1px solid ${C.gold}33`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.muted, marginTop: 4 }}>
                    ⚠️ یہ username اور password یاد رکھیں — login کے لیے صرف یہی چاہیے ہوگا
                  </div>
                </div>
              )}

              {signupMsg && (
                <div style={signupMsg.startsWith("✅") ? S.ok : S.err}>{signupMsg}</div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                {signupStep > 1 && (
                  <button type="button" onClick={() => setSignupStep(s => s - 1)} style={{ ...S.btn(C.surface2, C.muted), flex: 1 }}>← پچھلا</button>
                )}
                <button type="submit" style={{ ...S.btn(C.gold), flex: 2, padding: "11px", borderRadius: 9 }}>
                  {signupStep < 3 ? "اگلا ←" : "اکاؤنٹ بنائیں ✓"}
                </button>
              </div>
            </form>
            <div style={{ textAlign: "center", marginTop: 14 }}>
              <button onClick={() => { setPage("login"); setSignupStep(1); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer" }}>← واپس Login پر</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // USER PANEL
  // ══════════════════════════════════════════════════════════════════════
  if (page === "user" && liveUser) {
    const lastTxn = liveUser.transactions[liveUser.transactions.length - 1];
    return (
      <div style={S.wrap}>
        <div style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {liveUser.photo
              ? <img src={liveUser.photo} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
              : <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.surface2, border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.gold }}>{liveUser.naam[0]}</div>
            }
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{liveUser.naam}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{liveUser.accountNo}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 11, color: C.gold, fontWeight: 700 }}>ADEEN BANKS</div>
            <button onClick={logout} style={S.btn("#1a2640", C.red)}>Logout</button>
          </div>
        </div>

        <div style={{ padding: "12px 18px", display: "flex", gap: 8, borderBottom: `1px solid ${C.border}` }}>
          {[["dashboard", "📊 Dashboard"], ["history", "📋 History"], ["profile", "👤 Profile"]].map(([k, v]) => (
            <button key={k} onClick={() => setUserTab(k)} style={S.tab(userTab === k)}>{v}</button>
          ))}
        </div>

        <div style={{ padding: 20, maxWidth: 780, margin: "0 auto" }}>
          {userTab === "dashboard" && (
            <div>
              <div style={{ background: "linear-gradient(135deg,#0d2240,#091829)", border: `1px solid ${C.gold}55`, borderRadius: 16, padding: "28px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, borderRadius: "50%", background: `${C.gold}11` }} />
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>آپ کا موجودہ بیلنس</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, marginBottom: 4 }}>Rs. {liveUser.balance.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: C.muted }}>Account: {liveUser.accountNo} • رکن بنے: {liveUser.joinDate}</div>
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  ["کل ٹرانزیکشنز", liveUser.transactions.length, C.blue],
                  ["جمع شدہ", "Rs. " + liveUser.transactions.filter(t => t.type === "جمع").reduce((a, t) => a + t.amount, 0).toLocaleString(), C.green],
                  ["نکاسی", "Rs. " + liveUser.transactions.filter(t => t.type === "نکاس").reduce((a, t) => a + t.amount, 0).toLocaleString(), C.red],
                ].map(([label, val, color]) => (
                  <div key={label} style={S.statCard(color)}>
                    <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
                  </div>
                ))}
              </div>
              {lastTxn && (
                <div style={{ ...S.card, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>آخری ٹرانزیکشن</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ background: lastTxn.type === "جمع" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: lastTxn.type === "جمع" ? C.green : C.red, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {lastTxn.type === "جمع" ? "▲ جمع" : "▼ نکاس"}
                      </span>
                      <span style={{ marginLeft: 10, fontSize: 12, color: C.muted }}>{lastTxn.note || "—"}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: lastTxn.type === "جمع" ? C.green : C.red }}>
                      {lastTxn.type === "جمع" ? "+" : "-"}Rs. {lastTxn.amount.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 6 }}>{lastTxn.date}</div>
                </div>
              )}
              <div style={{ background: "rgba(226,185,75,0.07)", border: `1px solid ${C.gold}33`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: C.muted }}>
                🔒 آپ کے اکاؤنٹ کا سارا کنٹرول Admin کے پاس ہے۔ کسی بھی ٹرانزیکشن کے لیے Branch سے رابطہ کریں۔
              </div>
            </div>
          )}

          {userTab === "history" && (
            <div style={S.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 16 }}>ٹرانزیکشن تاریخ</div>
              <TransactionHistory txns={liveUser.transactions} />
            </div>
          )}

          {userTab === "profile" && (
            <div style={S.card}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
                {liveUser.photo
                  ? <img src={liveUser.photo} alt="" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}` }} />
                  : <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.surface2, border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: C.gold }}>{liveUser.naam[0]}</div>
                }
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{liveUser.naam}</div>
                  <div style={{ fontSize: 12, color: C.gold }}>{liveUser.accountNo}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>رکن بنے: {liveUser.joinDate}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["والد", liveUser.walid], ["موبائل", liveUser.mobile], ["جنس", liveUser.jins === "M" ? "مذکر" : "مؤنث"], ["تاریخ پیدائش", liveUser.dob], ["تعلیم", liveUser.taleem], ["بالغ/نابالغ", liveUser.baligh], ["شہر", liveUser.sheher], ["ضلع", liveUser.zila]].map(([k, v]) => (
                  <div key={k} style={{ background: C.surface2, borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontSize: 10, color: C.muted }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v || "—"}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, background: "rgba(226,185,75,0.08)", border: `1px solid ${C.gold}33`, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: C.muted }}>🔒 آپ کا Password (صرف screen پر)</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, letterSpacing: 3, marginTop: 4 }}>{liveUser.password}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 20 }}>🏦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: C.gold, letterSpacing: 1 }}>ADEEN BANKS LIMITED</div>
            <div style={{ fontSize: 10, color: C.muted }}>Admin Control Panel</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {[["dashboard", "📊 Dashboard"], ["members", "👥 Members"], ["add", "➕ Add Member"]].map(([k, l]) => (
            <button key={k} onClick={() => { setAdminTab(k); if (k !== "detail") setSelectedUser(null); }} style={S.tab(adminTab === k)}>{l}</button>
          ))}
          <button onClick={logout} style={S.btn("#1a2640", C.red)}>Logout</button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {adminTab === "dashboard" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
              {[["کل ممبران", users.length, C.gold, "👥"], ["کل بیلنس", "Rs. " + totalBalance.toLocaleString(), C.green, "💰"], ["کل ٹرانزیکشنز", totalTxns, C.blue, "📋"], ["آج کے ممبران", users.filter(u => u.joinDate === new Date().toLocaleDateString("en-PK")).length, "#a855f7", "🆕"]].map(([label, val, color, icon]) => (
                <div key={label} style={{ ...S.statCard(color), display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: C.muted }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 14 }}>حالیہ ممبران</div>
              {users.length === 0
                ? <div style={{ color: C.muted, textAlign: "center", padding: 24 }}>ابھی کوئی ممبر نہیں</div>
                : users.slice(-5).reverse().map((u, i) => (
                  <div key={i} onClick={() => { setSelectedUser(u); setAdminTab("detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, marginBottom: 8, background: C.surface2, cursor: "pointer", border: `1px solid ${C.border}` }}>
                    {u.photo ? <img src={u.photo} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
                      : <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a3a5c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.gold, border: `2px solid ${C.gold}` }}>{u.naam[0]}</div>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{u.naam}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{u.accountNo} • @{u.username}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: C.green, fontWeight: 700 }}>Rs. {u.balance.toLocaleString()}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{u.transactions.length} txns</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* MEMBERS */}
        {adminTab === "members" && !selectedUser && (
          <div style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>تمام ممبران ({users.length})</div>
              <input style={{ ...S.input, maxWidth: 260, marginBottom: 0 }} placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {filtered.length === 0
              ? <div style={{ color: C.muted, textAlign: "center", padding: 32 }}>کوئی ممبر نہیں ملا</div>
              : filtered.map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, marginBottom: 8, background: C.surface2, border: `1px solid ${C.border}` }}>
                  {u.photo ? <img src={u.photo} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
                    : <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a3a5c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.gold, border: `2px solid ${C.gold}` }}>{u.naam[0]}</div>}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{u.naam}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{u.accountNo} • @{u.username}</div>
                  </div>
                  <div style={{ textAlign: "right", marginRight: 10 }}>
                    <div style={{ color: C.green, fontWeight: 800 }}>Rs. {u.balance.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{u.transactions.length} txns</div>
                  </div>
                  <button onClick={() => { setSelectedUser(u); setAdminTab("detail"); }} style={S.btn(C.surface, C.gold)}>View →</button>
                </div>
              ))
            }
          </div>
        )}

        {/* DETAIL */}
        {adminTab === "detail" && selectedUser && (
          <div>
            <button onClick={() => { setAdminTab("members"); setSelectedUser(null); setTxnMsg(""); }} style={{ ...S.btn(C.surface2, C.muted), marginBottom: 16 }}>← واپس</button>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 280px", minWidth: 260 }}>
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                    {selectedUser.photo ? <img src={selectedUser.photo} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}` }} />
                      : <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.surface2, border: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.gold }}>{selectedUser.naam[0]}</div>}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 900 }}>{selectedUser.naam}</div>
                      <div style={{ fontSize: 11, color: C.gold }}>{selectedUser.accountNo}</div>
                      <div style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>Rs. {(users.find(u => u.accountNo === selectedUser.accountNo)?.balance || 0).toLocaleString()}</div>
                    </div>
                  </div>
                  {[["والد", selectedUser.walid], ["موبائل", selectedUser.mobile], ["جنس", selectedUser.jins], ["تاریخ پیدائش", selectedUser.dob], ["تعلیم", selectedUser.taleem], ["بالغ/نابالغ", selectedUser.baligh], ["علاقہ", selectedUser.illaqa], ["صوبہ", selectedUser.soba], ["شہر", selectedUser.sheher], ["تحصیل", selectedUser.tehsil], ["ضلع", selectedUser.zila], ["پتہ", selectedUser.pata], ["Username", selectedUser.username], ["Password", selectedUser.password]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}22`, fontSize: 12 }}>
                      <span style={{ color: C.muted }}>{k}</span>
                      <span style={{ fontWeight: 600, color: k === "Password" ? C.gold : C.text }}>{v || "—"}</span>
                    </div>
                  ))}
                  <button onClick={() => setShowPrint(true)} style={{ ...S.btn(C.surface2, C.muted), width: "100%", marginTop: 14 }}>🖨️ Print</button>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>ٹرانزیکشن کریں</div>
                  <form onSubmit={handleTxn}>
                    <label style={S.label}>قسم</label>
                    <select style={S.input} value={txnInput.type} onChange={e => setTxnInput(p => ({ ...p, type: e.target.value }))}>
                      <option value="جمع">▲ جمع (Deposit)</option>
                      <option value="نکاس">▼ نکاس (Withdrawal)</option>
                    </select>
                    <label style={S.label}>رقم (Rs.)</label>
                    <input style={S.input} type="number" min="1" placeholder="مثلاً: 5000" value={txnInput.amount} onChange={e => setTxnInput(p => ({ ...p, amount: e.target.value }))} />
                    <label style={S.label}>نوٹ (اختیاری)</label>
                    <input style={S.input} placeholder="مثلاً: ماہانہ بچت" value={txnInput.note} onChange={e => setTxnInput(p => ({ ...p, note: e.target.value }))} />
                    {txnMsg && <div style={{ color: txnMsg.startsWith("✅") ? C.green : C.red, fontSize: 13, marginBottom: 10 }}>{txnMsg}</div>}
                    <button type="submit" style={{ ...S.btn(C.gold), width: "100%", padding: "11px", borderRadius: 9 }}>محفوظ کریں</button>
                  </form>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 14 }}>ٹرانزیکشن تاریخ</div>
                  <TransactionHistory txns={users.find(u => u.accountNo === selectedUser.accountNo)?.transactions || []} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD MEMBER */}
        {adminTab === "add" && (
          <div style={{ ...S.card, maxWidth: 640 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.gold, marginBottom: 20 }}>➕ نئے ممبر کا اکاؤنٹ کھولیں</div>
            <form onSubmit={handleAddUser}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                {[["naam", "نام *"], ["walid", "والد کا نام"], ["mobile", "موبائل نمبر"], ["dob", "تاریخ پیدائش"], ["taleem", "تعلیم/کلاس"], ["illaqa", "علاقہ"], ["soba", "صوبہ"], ["sheher", "شہر"], ["tehsil", "تحصیل"], ["zila", "ضلع"]].map(([f, l]) => (
                  <div key={f}><label style={S.label}>{l}</label><input style={S.input} value={newUser[f]} onChange={e => setNewUser(p => ({ ...p, [f]: e.target.value }))} /></div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <div><label style={S.label}>جنس</label>
                  <select style={S.input} value={newUser.jins} onChange={e => setNewUser(p => ({ ...p, jins: e.target.value }))}>
                    <option value="M">مذکر (Male)</option><option value="F">مؤنث (Female)</option>
                  </select>
                </div>
                <div><label style={S.label}>بالغ/نابالغ</label>
                  <select style={S.input} value={newUser.baligh} onChange={e => setNewUser(p => ({ ...p, baligh: e.target.value }))}>
                    <option value="بالغ">بالغ</option><option value="نابالغ">نابالغ</option>
                  </select>
                </div>
              </div>
              <label style={S.label}>مکمل پتہ</label>
              <input style={S.input} value={newUser.pata} onChange={e => setNewUser(p => ({ ...p, pata: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
                <div><label style={S.label}>Username *</label><input style={S.input} value={newUser.username} onChange={e => setNewUser(p => ({ ...p, username: e.target.value }))} autoComplete="off" /></div>
                <div><label style={S.label}>Password *</label><input style={S.input} value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} autoComplete="off" /></div>
              </div>
              <label style={S.label}>تصویر اپلوڈ کریں</label>
              <input ref={photoRef} type="file" accept="image/*" style={{ color: C.muted, fontSize: 12, marginBottom: 10 }} onChange={handleAdminPhoto} />
              {newUser.photo && <img src={newUser.photo} alt="" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}`, marginBottom: 10, display: "block" }} />}
              {addMsg && <div style={{ color: addMsg.startsWith("✅") ? C.green : C.red, marginBottom: 10, fontSize: 13 }}>{addMsg}</div>}
              <button type="submit" style={{ ...S.btn(C.gold), width: "100%", padding: "12px", borderRadius: 10, fontSize: 14 }}>اکاؤنٹ محفوظ کریں</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
