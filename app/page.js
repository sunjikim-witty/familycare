"use client";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";

export default function Home() {
  const [checkin, setCheckin] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "checkins"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setCheckin(snapshot.docs[0].data());
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"480px", margin:"40px auto", padding:"0 20px"}}>
      <h1 style={{fontSize:"22px", fontWeight:"500", marginBottom:"4px"}}>Senior Dashboard</h1>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"32px"}}>
        {checkin ? checkin.name : "Loading..."}
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