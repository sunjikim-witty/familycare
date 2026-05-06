"use client";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot, orderBy, query, limit, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [checkins, setCheckins] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const profileSnap = await getDoc(doc(db, "users", u.uid));
      if (!profileSnap.exists()) {
        router.push("/setup");
      } else {
        setProfile(profileSnap.data());
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user || !profile) return;
    const q = query(
      collection(db, "families", profile.familyId, "checkins"),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCheckins(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => unsubscribe();
  }, [user, profile]);

  if (!user || !profile) return null;

  const latest = checkins[0];

  function formatDate(ts, tz) {
    if (!ts) return "...";
    const d = new Date(ts);
    const myTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const parentTz = tz || profile.parentTimezone || "Asia/Seoul";
    const myTime = d.toLocaleString("en-US", {
      timeZone: myTz, month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"
    });
    const parentTime = d.toLocaleString("en-US", {
      timeZone: parentTz, month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"
    });
const myTzShort = new Date().toLocaleTimeString("en-US", {timeZone: myTz, timeZoneName:"short"}).split(" ").pop();
const parentTzShort = new Date().toLocaleTimeString("en-US", {timeZone: parentTz, timeZoneName:"short"}).split(" ").pop();
return `${myTime} ${myTzShort} (${profile.myName}) · ${parentTime} ${parentTzShort} (${profile.parentName})`;
  }

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"480px", margin:"40px auto", padding:"0 20px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px"}}>
        <h1 style={{fontSize:"22px", fontWeight:"500"}}>Senior Dashboard</h1>
        <button onClick={() => signOut(auth)} style={{fontSize:"12px", color:"#888", background:"none", border:"none", cursor:"pointer"}}>Sign out</button>
      </div>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"24px"}}>
        Hi {profile.myName} · Monitoring{" "}
        <span onClick={() => router.push("/setup")} style={{color:"#1D9E75", cursor:"pointer", textDecoration:"underline"}}>
          {profile.parentName}
        </span>
      </p>

      <div style={{background:"#E1F5EE", borderRadius:"12px", padding:"20px", marginBottom:"12px"}}>
        <div style={{fontSize:"12px", color:"#0F6E56", marginBottom:"4px"}}>STATUS</div>
        <div style={{fontSize:"24px", fontWeight:"500", color:"#085041"}}>
          {latest ? "✓ " + latest.status : "No check-ins yet"}
        </div>
        <div style={{fontSize:"11px", color:"#1D9E75", marginTop:"6px", lineHeight:"1.6"}}>
          Last check-in:<br/>
          {latest ? formatDate(latest.createdAt, latest.timezone) : "..."}
        </div>
      </div>

      <div style={{background:"#E6F1FB", borderRadius:"12px", padding:"16px", marginBottom:"12px"}}>
        <div style={{fontSize:"12px", color:"#888", marginBottom:"4px"}}>SENIOR LINK</div>
        <div style={{fontSize:"12px", color:"#185FA5", wordBreak:"break-all"}}>
          familycare-six.vercel.app/Senior/{profile.familyId}
        </div>
        <div style={{fontSize:"11px", color:"#888", marginTop:"4px"}}>Share this link with {profile.parentName}</div>
      </div>

      <div style={{background:"#f5f5f5", borderRadius:"12px", padding:"20px", marginBottom:"12px"}}>
        <div style={{fontSize:"12px", color:"#888", marginBottom:"12px"}}>ACTIVITY LOG</div>
        {checkins.length === 0 && <div style={{fontSize:"13px", color:"#aaa"}}>No check-ins yet</div>}
        {checkins.map((c, i) => (
          <div key={c.id} style={{
            display:"flex", justifyContent:"space-between", alignItems:"flex-start",
            padding:"10px 0",
            borderBottom: i < checkins.length - 1 ? "1px solid #e5e5e5" : "none"
          }}>
            <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
              <div style={{width:"8px", height:"8px", borderRadius:"50%", background:"#1D9E75", flexShrink:0, marginTop:"4px"}}></div>
              <div style={{fontSize:"13px", fontWeight:"500", color:"#085041"}}>✓ {c.status}</div>
            </div>
            <div style={{fontSize:"11px", color:"#888", textAlign:"right", lineHeight:"1.6"}}>
              {formatDate(c.createdAt, c.timezone)}
            </div>
          </div>
        ))}
      </div>

      <div style={{background:"#FFF8E1", borderRadius:"12px", padding:"20px"}}>
        <div style={{fontSize:"12px", color:"#888", marginBottom:"8px"}}>ALERTS</div>
        <div style={{fontSize:"13px", color:"#854F0B"}}>⚠️ Missed check-in last Sunday</div>
      </div>
    </main>
  );
}