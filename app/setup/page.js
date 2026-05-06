"use client";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Setup() {
  const router = useRouter();
  const [myName, setMyName] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentTimezone, setParentTimezone] = useState("Asia/Seoul");
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, []);

  async function handleSave() {
    if (!myName || !parentName || !user) return;
    setSaving(true);
    const myTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const familyId = user.uid.slice(0, 8);
    await setDoc(doc(db, "users", user.uid), {
      myName,
      parentName,
      parentTimezone,
      myTimezone,
      familyId,
      email: user.email,
      createdAt: Date.now(),
    });
    router.push("/");
  }

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"380px", margin:"80px auto", padding:"0 20px", textAlign:"center"}}>
      <h1 style={{fontSize:"22px", fontWeight:"500", marginBottom:"8px"}}>Welcome! Let's get set up</h1>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"32px"}}>Tell us about you and your loved one</p>

      <div style={{background:"#f5f5f5", borderRadius:"12px", padding:"24px", textAlign:"left"}}>
        <div style={{marginBottom:"16px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Your name</label>
          <input type="text" value={myName} onChange={e => setMyName(e.target.value)} placeholder="e.g. David"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}} />
        </div>
        <div style={{marginBottom:"16px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Your parent's name</label>
          <input type="text" value={parentName} onChange={e => setParentName(e.target.value)} placeholder="e.g. Mary"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}} />
        </div>
        <div style={{marginBottom:"24px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Your parent's timezone</label>
          <select value={parentTimezone} onChange={e => setParentTimezone(e.target.value)}
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box", background:"#fff"}}>
            <option value="Asia/Seoul">Korea (KST)</option>
            <option value="Asia/Tokyo">Japan (JST)</option>
            <option value="Asia/Shanghai">China (CST)</option>
            <option value="Asia/Kolkata">India (IST)</option>
            <option value="Europe/London">UK (GMT)</option>
            <option value="Europe/Paris">Europe (CET)</option>
            <option value="America/New_York">US East (ET)</option>
            <option value="America/Chicago">US Central (CT)</option>
            <option value="America/Denver">US Mountain (MT)</option>
            <option value="America/Los_Angeles">US West (PT)</option>
          </select>
        </div>
        <button onClick={handleSave} disabled={saving} style={{
          width:"100%", background:"#1D9E75", color:"#fff",
          border:"none", borderRadius:"8px", padding:"12px",
          fontSize:"15px", fontWeight:"500", cursor:"pointer",
          opacity: saving ? 0.7 : 1
        }}>
          {saving ? "Saving..." : "Get started →"}
        </button>
      </div>
    </main>
  );
}