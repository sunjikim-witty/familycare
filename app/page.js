"use client";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot, orderBy, query, limit, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [checkin, setCheckin] = useState(null);
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
    if (!user) return;
    const q = query(collection(db, "checkins"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) setCheckin(snapshot.docs[0].data());
    });
    return () => unsubscribe();
  }, [user]);

  if (!user || !profile) return null;

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"480px", margin:"40px auto", padding:"0 20px"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px"}}>
        <h1 style={{fontSize:"22px", fontWeight:"500"}}>Senior Dashboard</h1>
        <button onClick={() => signOut(auth)} style={{fontSize:"12px", color:"#888", background:"none", border:"none", cursor:"pointer"}}>Sign out</button>
      </div>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"32px"}}>
        Hi {profile.myName} · Monitoring {profile.parentName}
      </p>
      <div style={{background:"#E1F5EE", borderRadius:"12px", padding:"20px", marginBottom:"12px"}}>
        <div style={{fontSize:"12px", color:"#0F6E56", marginBottom:"4px"}}>STATUS</div>
        <div style={{fontSize:"24px", fontWeight:"500", color:"#085041"}}>
          {checkin ? "✓ " + checkin.status : "Loading..."}
        </div>
        <div style={{fontSize:"13px", color:"#1D9E75", marginTop:"4px"}}>
          Last check-in: {checkin ? checkin.time : "..."}
        </div>
      </div>
      <div style={{background:"#f5f5f5", borderRadius:"12px", padding:"20px", marginBottom:"12px"}}>
        <div style={{fontSize:"12px", color:"#888", marginBottom:"8px"}}>TODAY'S ACTIVITY</div>
        <div style={{fontSize:"13px", marginBottom:"6px"}}>📍 Left home 9:50am · returned 11:14am</div>
        <div style={{fontSize:"13px", marginBottom:"6px"}}>✅ Check-in completed</div>
        <div style={{fontSize:"13px"}}>💊 Medication refill requested</div>
      </div>
      <div style={{background:"#FFF8E1", borderRadius:"12px", padding:"20px"}}>
        <div style={{fontSize:"12px", color:"#888", marginBottom:"8px"}}>ALERTS</div>
        <div style={{fontSize:"13px", color:"#854F0B"}}>⚠️ Missed check-in last Sunday</div>
      </div>
    </main>
  );
}