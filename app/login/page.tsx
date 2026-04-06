"use client";
import { useState, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, Mail, Lock, User, LogIn } from "lucide-react";
import Link from "next/link";

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;
    
    // Extract name from email if logging in
    const displayName = isLogin 
      ? email.split('@')[0].split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : name;

    // Simulate API call and success
    login(email, displayName);
    router.push(redirectTo);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto 0", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, margin: "0 auto 16px",
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(74,222,128,0.3)'
        }}>
          <Sprout size={24} color="#fff" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'Space Grotesk'" }}>
          {isLogin ? "Welcome back to FarmIQ" : "Create FarmIQ Account"}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8 }}>
          {isLogin ? "Enter your credentials to access your dashboard" : "Join the autonomous farming revolution"}
        </p>
      </div>

      <div className="glow-card" style={{ padding: 32 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="input-field"
                  style={{ paddingLeft: 36 }}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="input-field"
                style={{ paddingLeft: 36 }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: 36 }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8, justifyContent: "center" }}>
            <LogIn size={16} />
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: "none", border: "none", color: "#4ade80", fontWeight: 600, cursor: "pointer" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
      
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "underline" }}>
          Return to home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid-bg" style={{ minHeight: "100vh" }}>
      <Suspense fallback={<div className="spinner" style={{ margin: "100px auto" }} />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
