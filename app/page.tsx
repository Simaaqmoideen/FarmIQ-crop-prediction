"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import SoilInputForm, { SoilData } from "@/components/SoilInputForm";
import WeatherCard from "@/components/WeatherCard";
import RecommendationsPanel from "@/components/RecommendationsPanel";
import YieldChart from "@/components/YieldChart";
import MarketTable from "@/components/MarketTable";
import { analyzeSoil, getModelStatus, getWeather, AnalysisResult, ModelStatus } from "@/lib/api";
import { soilDefaults, mockWeatherData } from "@/lib/mockData";
import { Brain, Sprout, CloudRain, TrendingUp, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";

const LOAD_STEPS = [
  "🌱 Analyzing soil composition...",
  "🌦️ Fetching 7-day weather forecast...",
  "📊 Querying market prices...",
  "🤖 Generating AI recommendations...",
];

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [liveWeather, setLiveWeather] = useState<typeof mockWeatherData>(mockWeatherData);
  const weatherDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check backend status on mount
  useEffect(() => {
    getModelStatus().then(setModelStatus);
    // Fetch weather for default location
    getWeather(soilDefaults.location).then(setLiveWeather);
  }, []);

  const handleLocationChange = (city: string) => {
    if (weatherDebounce.current) clearTimeout(weatherDebounce.current);
    weatherDebounce.current = setTimeout(() => {
      if (city.trim().length > 2) getWeather(city).then(setLiveWeather);
    }, 600);
  };

  const handleAnalyze = async (soilData: SoilData) => {
    setIsLoading(true);
    setResult(null);
    setLoadStep(0);

    // Animate through load steps
    const stepInterval = setInterval(() => {
      setLoadStep(s => (s < LOAD_STEPS.length - 1 ? s + 1 : s));
    }, 600);

    const data = await analyzeSoil(soilData);
    clearInterval(stepInterval);
    setLoadStep(LOAD_STEPS.length - 1);
    await new Promise(r => setTimeout(r, 300));

    setResult(data);
    setIsLoading(false);
  };

  const hasAnalyzed = !!result;
  const mlMode = modelStatus?.available && modelStatus?.trained;

  return (
    <div className="grid-bg" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero section */}
      <div style={{
        background: "linear-gradient(180deg, rgba(74,222,128,0.04) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(74,222,128,0.08)",
        padding: "36px 24px 28px",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="badge badge-green">
              <div className="pulse-dot" style={{ width: 6, height: 6 }} />
              Agentic AI &amp; Autonomous Systems
            </span>

            {mlMode ? (
              <span className="badge badge-blue">🤖 ML Model Loaded ({modelStatus?.accuracy?.toFixed(1)}% accuracy)</span>
            ) : (
              <Link href="/upload">
                <span className="badge badge-amber" style={{ cursor: "pointer" }}>
                  ⚡ Upload Kaggle Dataset to enable ML →
                </span>
              </Link>
            )}
          </div>

          <h1 className="cyber-text animate-float" style={{
            fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 800,
            color: "var(--text-primary)", marginBottom: 8,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            Autonomous Farmer Decision Intelligence Agent
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.6 }}>
            AI-powered platform integrating weather, soil, and market data to deliver
            real-time crop recommendations, irrigation schedules, and yield forecasts.
          </p>

          {/* Stat pills */}
          <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
            {[
              { icon: Brain,       label: "AI Engine",      value: mlMode ? "RandomForest ML" : "Decision Engine", color: "#60a5fa" },
              { icon: Sprout,      label: "Crops Modeled",  value: mlMode ? `${modelStatus?.crop_classes ?? 22} varieties` : "22 varieties", color: "#4ade80" },
              { icon: CloudRain,   label: "Weather",        value: "7-day forecast",  color: "#38bdf8" },
              { icon: TrendingUp,  label: "ML Accuracy",    value: mlMode ? `${modelStatus?.accuracy?.toFixed(1)}%` : "~99% (Kaggle RF)", color: "#a78bfa" },
              { icon: ShieldCheck, label: "Data Sources",   value: "3 integrated",     color: "#fbbf24" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main dashboard */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 32, alignItems: "flex-start" }}>

          {/* Left — Soil input (sticky) */}
          <div style={{ position: "sticky", top: 80 }}>
            <SoilInputForm
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              defaults={soilDefaults}
              modelStatus={mlMode ? "ml" : hasAnalyzed ? "mock" : null}
              onLocationChange={handleLocationChange}
            />

            {/* Upload dataset shortcut */}
            <Link href="/upload" style={{ textDecoration: "none" }}>
              <div style={{
                marginTop: 12, padding: "12px 16px", borderRadius: 12,
                background: "rgba(96,165,250,0.06)", border: "1px dashed rgba(96,165,250,0.25)",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s"
              }}>
                <Upload size={16} color="#60a5fa" />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>Upload Kaggle Dataset</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Train the ML model with real data</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Right — Results */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Loading state */}
            {isLoading && (
              <div className="glow-card animate-fadeIn" style={{
                padding: 48, textAlign: "center",
                background: "linear-gradient(135deg, rgba(74,222,128,0.05), rgba(96,165,250,0.03))"
              }}>
                <div className="spinner" style={{ width: 56, height: 56, margin: "0 auto 20px" }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  {mlMode ? "Running ML Model..." : "Agent Processing..."}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>
                  {mlMode
                    ? "Running RandomForest inference on your soil parameters..."
                    : "Analyzing soil, fetching weather data, querying market prices, and running yield forecast."}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320, margin: "0 auto" }}>
                  {LOAD_STEPS.map((step, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 14px", borderRadius: 8,
                      background: i <= loadStep ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${i <= loadStep ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.05)"}`,
                      transition: "all 0.4s ease",
                      opacity: i <= loadStep ? 1 : 0.4,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                        background: i < loadStep ? "#4ade80" : i === loadStep ? "#fbbf24" : "var(--text-muted)"
                      }} />
                      <span style={{ fontSize: 12, color: i <= loadStep ? "var(--text-secondary)" : "var(--text-muted)" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Welcome state — only when no result yet */}
            {!isLoading && !hasAnalyzed && (
              <div className="glow-card neon-border scan-container animate-fadeInUp" style={{ padding: 48, textAlign: "center", opacity: 0.9 }}>
                <div className="animate-float" style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: "rgba(74,222,128,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "1px solid rgba(74,222,128,0.15)",
                }}>
                  <Brain size={32} color="#4ade80" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  Ready to Analyze Your Farm
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 20px" }}>
                  Adjust the soil sliders on the left and click{" "}
                  <strong style={{ color: "#4ade80" }}>Analyze &amp; Recommend</strong>{" "}
                  to get {mlMode ? "ML-powered" : "AI-powered"} crop selection, irrigation plans, and yield predictions.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {["🌾 Crop Selection", "💧 Irrigation Plan", "📈 Yield Forecast", "💹 Market Insights"].map(label => (
                    <span key={label} className="badge badge-green" style={{ fontSize: 12 }}>{label}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Results — shown after analysis completes */}
            {!isLoading && hasAnalyzed && result && (
              <div className="animate-fadeInUp" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Source badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {result.source === "ml" ? (
                    <span className="badge badge-green">✓ ML Model Output — RandomForest Classifier</span>
                  ) : (
                    <span className="badge badge-amber">⚠ Demo Mode — Upload a Kaggle CSV to use real ML</span>
                  )}
                </div>

                {/* Weather + Market row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <WeatherCard data={liveWeather} isVisible={true} />
                  <MarketTable data={result.market} isVisible={true} />
                </div>

                {/* Yield chart */}
                <YieldChart data={result.yield_data} isVisible={true} />

                {/* Recommendations */}
                <RecommendationsPanel data={result} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(74,222,128,0.08)", padding: "20px 24px", marginTop: 40, textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          FarmIQ — Autonomous Farmer Decision Intelligence Agent &nbsp;·&nbsp;
          Agriculture, FoodTech &amp; Rural Development &nbsp;·&nbsp; Next.js + scikit-learn
        </p>
      </footer>
    </div>
  );
}
