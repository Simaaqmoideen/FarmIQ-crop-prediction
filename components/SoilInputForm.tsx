"use client";
import { useState } from "react";
import { MapPin, Beaker, Droplets, Thermometer, Zap, Layers, Leaf, Search } from "lucide-react";

export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  moisture: number;
  temperature: number;
  organic_matter: number;
  location: string;
}

interface Props {
  onAnalyze: (data: SoilData) => void;
  isLoading: boolean;
  defaults: SoilData;
  modelStatus?: "ml" | "mock" | null;
  onLocationChange?: (city: string) => void;
}

const fields = [
  { key: "nitrogen",       label: "Nitrogen (N)",    icon: Zap,         unit: "kg/ha", min: 0,  max: 200, step: 1,   color: "#4ade80" },
  { key: "phosphorus",     label: "Phosphorus (P)",  icon: Beaker,      unit: "kg/ha", min: 0,  max: 200, step: 1,   color: "#60a5fa" },
  { key: "potassium",      label: "Potassium (K)",   icon: Layers,      unit: "kg/ha", min: 0,  max: 200, step: 1,   color: "#fbbf24" },
  { key: "ph",             label: "Soil pH",          icon: Beaker,      unit: "pH",    min: 0,  max: 14,  step: 0.1, color: "#a78bfa" },
  { key: "moisture",       label: "Moisture",         icon: Droplets,    unit: "%",     min: 0,  max: 100, step: 1,   color: "#38bdf8" },
  { key: "temperature",    label: "Soil Temp",        icon: Thermometer, unit: "°C",   min: 0,  max: 60,  step: 0.5, color: "#fb923c" },
  { key: "organic_matter", label: "Organic Matter",   icon: Leaf,        unit: "%",     min: 0,  max: 10,  step: 0.1, color: "#34d399" },
] as const;

export default function SoilInputForm({ onAnalyze, isLoading, defaults, modelStatus, onLocationChange }: Props) {
  const [data, setData] = useState<SoilData>(defaults);

  const getBarWidth = (key: string, value: number) => {
    const field = fields.find(f => f.key === key);
    if (!field) return 0;
    return ((value - field.min) / (field.max - field.min)) * 100;
  };

  return (
    <div className="glow-card neon-border" style={{ background: "var(--bg-card)", padding: 24, zIndex: 5 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(74,222,128,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Beaker size={20} color="#4ade80" />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Soil Analysis Input</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Enter your field sensor data</p>
        </div>
      </div>

      {/* Model status badge */}
      {modelStatus && (
        <div style={{ marginBottom: 16 }}>
          {modelStatus === "ml" ? (
            <span className="badge badge-green" style={{ fontSize: 11 }}>
              <div className="pulse-dot" style={{ width: 6, height: 6 }} />
              ML Model Active
            </span>
          ) : (
            <span className="badge badge-amber" style={{ fontSize: 11 }}>⚠ Using Demo Data</span>
          )}
        </div>
      )}

      {/* Location */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          fontSize: 11, fontWeight: 600, color: "var(--text-secondary)",
          display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase"
        }}>
          Farm Location
        </label>
        <div style={{ position: "relative" }}>
          <MapPin size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={data.location}
            onChange={e => {
              const city = e.target.value;
              setData({ ...data, location: city });
              onLocationChange?.(city);
            }}
            placeholder="e.g. Punjab, India"
            className="input-field"
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Soil fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {fields.map(({ key, label, icon: Icon, unit, min, max, step, color }) => {
          const val = data[key as keyof SoilData] as number;
          const barW = getBarWidth(key, val);
          return (
            <div key={key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon size={13} color={color} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "monospace" }}>
                  {val} <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 11 }}>{unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={min} max={max} step={step}
                value={val}
                onChange={e => setData({ ...data, [key]: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: color, cursor: "pointer", marginBottom: 4, display: "block" }}
              />
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${barW}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analyze button */}
      <button
        onClick={() => onAnalyze(data)}
        disabled={isLoading}
        className="btn-primary"
        style={{ width: "100%", marginTop: 24, justifyContent: "center" }}
      >
        {isLoading ? (
          <>
            <div className="spinner-sm" />
            Agent Analyzing...
          </>
        ) : (
          <>
            <Search size={16} />
            Analyze &amp; Recommend
          </>
        )}
      </button>
    </div>
  );
}
