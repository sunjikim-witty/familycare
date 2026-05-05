"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Setup() {
  const router = useRouter();
  const [myName, setMyName] = useState("");
  const [parentName, setParentName] = useState("");
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
    await setDoc(doc(db, "users", user.uid), {
      myName,
      parentName,
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
          <input
            type="text"
            value={myName}
            onChange={e => setMyName(e.target.value)}
            placeholder="e.g. David"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}}
          />
        </div>
        <div style={{marginBottom:"24px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Your parent's name</label>
          <input
            type="text"
            value={parentName}
            onChange={e => setParentName(e.target.value)}
            placeholder="e.g. Elaine"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}}
          />
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