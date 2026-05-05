"use client";
import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleEmailLogin() {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main style={{fontFamily:"sans-serif", maxWidth:"380px", margin:"80px auto", padding:"0 20px", textAlign:"center"}}>
      <h1 style={{fontSize:"26px", fontWeight:"500", marginBottom:"8px"}}>Senior Dashboard</h1>
      <p style={{color:"#888", fontSize:"14px", marginBottom:"32px"}}>Sign in to check on your loved one</p>

      <div style={{background:"#f5f5f5", borderRadius:"12px", padding:"24px", marginBottom:"16px", textAlign:"left"}}>
        <div style={{marginBottom:"12px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}} />
        </div>
        <div style={{marginBottom:"16px"}}>
          <label style={{fontSize:"12px", color:"#888", display:"block", marginBottom:"4px"}}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            style={{width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1px solid #ddd", fontSize:"14px", boxSizing:"border-box"}} />
        </div>
        {error && <div style={{fontSize:"12px", color:"#E24B4A", marginBottom:"12px"}}>{error}</div>}
        <button onClick={handleEmailLogin} style={{width:"100%", background:"#1D9E75", color:"#fff", border:"none", borderRadius:"8px", padding:"12px", fontSize:"15px", fontWeight:"500", cursor:"pointer"}}>
          {isSignUp ? "Create account" : "Sign in"}
        </button>
        <div style={{textAlign:"center", marginTop:"12px"}}>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{fontSize:"13px", color:"#1D9E75", background:"none", border:"none", cursor:"pointer"}}>
            {isSignUp ? "Already have an account? Sign in" : "No account? Create one"}
          </button>
        </div>
      </div>

      <div style={{color:"#ccc", fontSize:"13px", marginBottom:"16px"}}>or</div>

      <button onClick={handleGoogleLogin} style={{display:"flex", alignItems:"center", gap:"12px", background:"#fff", border:"1px solid #ddd", borderRadius:"8px", padding:"12px 24px", fontSize:"15px", cursor:"pointer", margin:"0 auto", boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <img src="https://www.google.com/favicon.ico" width="20" height="20" />
        Sign in with Google
      </button>
    </main>
  );
}