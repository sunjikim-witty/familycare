"use client";
import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

export default function Senior() {
  const [done, setDone] = useState(false);
  const { familyId } = useParams();

  async function handleCheckin() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await addDoc(collection(db, "families", familyId, "checkins"), {
      status: "OK",
      time: new Date().toLocaleTimeString(),
      createdAt: Date.now(),
      timezone,
    });
    setDone(true);
  }

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"380px", margin:"80px auto", padding:"0 20px", textAlign:"center"}}>
      <h1 style={{fontSize:"22px", fontWeight:"500", marginBottom:"8px"}}>Good morning!</h1>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"48px"}}>Tap the button to let your family know you are OK</p>
      {done ? (
        <div style={{background:"#E1F5EE", borderRadius:"16px", padding:"32px"}}>
          <div style={{fontSize:"48px", marginBottom:"12px"}}>OK</div>
          <div style={{fontSize:"18px", fontWeight:"500", color:"#085041"}}>Family notified!</div>
          <div style={{fontSize:"13px", color:"#1D9E75", marginTop:"8px"}}>Your check-in has been sent</div>
        </div>
      ) : (
        <button onClick={handleCheckin} style={{
          background:"#1D9E75", color:"#fff", border:"none",
          borderRadius:"50%", width:"200px", height:"200px",
          fontSize:"18px", fontWeight:"500", cursor:"pointer"
        }}>
          I am OK
        </button>
      )}
    </main>
  );
}