"use client";
import { Sprout, Activity, Globe, User as UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'rgba(8,12,20,0.9)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(74,222,128,0.1)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(74,222,128,0.3)'
          }}>
            <Sprout size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
              Farm<span style={{ color: '#4ade80' }}>IQ</span>
            </span>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>DECISION INTELLIGENCE</p>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span className="badge badge-green">
              <Activity size={12} />
              Agent Active
            </span>

            {/* <span className="badge badge-purple" style={{ textTransform: "none" }}>📍 Punjab, India</span> */}
          </div>

          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(74,222,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserIcon size={16} color="#4ade80" />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{user.name}</span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Farmer</span>
                </div>
              </div>
              <button 
                onClick={logout} 
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: 8, color: "var(--text-secondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
