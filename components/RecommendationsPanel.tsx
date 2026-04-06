"use client";
import { Sprout, Droplets, Calendar, TrendingUp, AlertCircle, Brain, CheckCircle, Star } from "lucide-react";

interface Crop {
  name: string;
  match_score: number;
  water_need: string;
  growth_days: number;
  expected_yield: string;
  profit_estimate: string;
  reason: string;
}

interface Recommendation {
  recommended_crops: Crop[];
  irrigation_schedule: {
    frequency: string;
    amount_liters_per_acre: number;
    method: string;
    next_irrigation: string;
    weekly_schedule: { day: string; irrigate: boolean; amount: number }[];
  };
  harvest_window: {
    start: string;
    end: string;
    optimal_day: string;
    weather_risk: string;
  };
  soil_insights: {
    overall_health: number;
    nitrogen_status: string;
    phosphorus_status: string;
    potassium_status: string;
    ph_status: string;
    recommendations: string[];
  };
  market_insight: string;
  confidence_score: number;
  agent_reasoning: string;
}

interface Props {
  data: Recommendation | null;
}

const statusColor = (status: string) => {
  if (status === "Adequate" || status === "Good" || status === "Optimal") return "#4ade80";
  if (status === "Low") return "#fbbf24";
  return "#f87171";
};

const waterColor = (need: string) => {
  if (need === "High") return "#60a5fa";
  if (need === "Medium") return "#4ade80";
  return "#fbbf24";
};

export default function RecommendationsPanel({ data }: Props) {
  if (!data) return (
    <div className="glow-card p-8 flex flex-col items-center justify-center" style={{ minHeight: 300, opacity: 0.4 }}>
      <Sprout size={48} color="var(--text-muted)" />
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
        Submit your soil data to receive AI-powered crop recommendations
      </p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Confidence Banner */}
      <div className="glow-card animate-fadeInUp" style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(74,222,128,0.08), rgba(96,165,250,0.05))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="pulse-dot" />
          <Brain size={16} color="#4ade80" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>AI Agent Analysis Complete</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Confidence Score</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4ade80', fontFamily: "'Space Grotesk'" }}>
            {Math.round(data.confidence_score * 100)}%
          </span>
        </div>
      </div>

      {/* Crop Recommendations */}
      <div className="glow-card p-6 animate-fadeInUp delay-100">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sprout size={18} color="#4ade80" />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Recommended Crops</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.recommended_crops.map((crop, i) => (
            <div key={crop.name} style={{
              background: i === 0 ? 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(74,222,128,0.02))' : 'rgba(255,255,255,0.02)',
              border: i === 0 ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: 16, position: 'relative', overflow: 'hidden'
            }}>
              {i === 0 && (
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{crop.name}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span className="badge" style={{
                      padding: '2px 8px', fontSize: 10,
                      background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)'
                    }}>
                      {crop.growth_days}d growth
                    </span>
                    <span className="badge" style={{
                      padding: '2px 8px', fontSize: 10,
                      background: `rgba(${waterColor(crop.water_need) === '#60a5fa' ? '96,165,250' : waterColor(crop.water_need) === '#4ade80' ? '74,222,128' : '251,191,36'},0.1)`,
                      color: waterColor(crop.water_need),
                      border: `1px solid ${waterColor(crop.water_need)}33`
                    }}>
                      💧 {crop.water_need} Water
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', fontFamily: "'Space Grotesk'" }}>
                    {crop.match_score}%
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>match</p>
                </div>
              </div>
              {/* Score bar */}
              <div className="progress-bar" style={{ marginBottom: 10 }}>
                <div className="progress-fill" style={{
                  width: `${crop.match_score}%`,
                  background: i === 0 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #475569, #94a3b8)'
                }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expected Yield</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{crop.expected_yield}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Est. Profit</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{crop.profit_estimate}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{crop.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation + Harvest Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Irrigation */}
        <div className="glow-card p-5 animate-fadeInUp delay-200">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Droplets size={16} color="#38bdf8" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Irrigation Plan</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[
              { label: "Frequency", value: data.irrigation_schedule.frequency },
              { label: "Amount", value: `${data.irrigation_schedule.amount_liters_per_acre.toLocaleString()} L/acre` },
              { label: "Method", value: data.irrigation_schedule.method },
              { label: "Next Session", value: data.irrigation_schedule.next_irrigation },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
          {/* Weekly schedule */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {data.irrigation_schedule.weekly_schedule.map(({ day, irrigate }) => (
              <div key={day} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 4 }}>{day[0]}</p>
                <div style={{
                  width: '100%', aspectRatio: '1',
                  borderRadius: 4,
                  background: irrigate ? 'rgba(56,189,248,0.3)' : 'rgba(255,255,255,0.04)',
                  border: irrigate ? '1px solid rgba(56,189,248,0.5)' : '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {irrigate && <Droplets size={10} color="#38bdf8" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Harvest window */}
        <div className="glow-card p-5 animate-fadeInUp delay-300">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Calendar size={16} color="#fbbf24" />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Harvest Window</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[
              { label: "Window Opens", value: data.harvest_window.start },
              { label: "Window Closes", value: data.harvest_window.end },
              { label: "Optimal Day", value: data.harvest_window.optimal_day },
              { label: "Weather Risk", value: data.harvest_window.weather_risk },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: label === "Weather Risk" ? '#4ade80' : 'var(--text-primary)' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
            borderRadius: 8, padding: 10
          }}>
            <p style={{ fontSize: 11, color: '#fbbf24', fontWeight: 600 }}>⭐ Best Harvest Day</p>
            <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 700, marginTop: 2 }}>{data.harvest_window.optimal_day}</p>
          </div>
        </div>
      </div>

      {/* Soil Health */}
      <div className="glow-card p-5 animate-fadeInUp delay-400">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <TrendingUp size={16} color="#a78bfa" />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Soil Health Report</h3>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Overall</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa', fontFamily: "'Space Grotesk'" }}>
              {data.soil_insights.overall_health}%
            </span>
          </div>
        </div>
        <div className="progress-bar" style={{ marginBottom: 14 }}>
          <div className="progress-fill" style={{
            width: `${data.soil_insights.overall_health}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)'
          }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: "Nitrogen", status: data.soil_insights.nitrogen_status },
            { label: "Phosphorus", status: data.soil_insights.phosphorus_status },
            { label: "Potassium", status: data.soil_insights.potassium_status },
            { label: "pH", status: data.soil_insights.ph_status },
          ].map(({ label, status }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px',
              border: `1px solid ${statusColor(status)}22`, textAlign: 'center'
            }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: statusColor(status) }}>{status}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.soil_insights.recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <CheckCircle size={13} color="#4ade80" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Market Insight */}
      <div className="glow-card p-5 animate-fadeInUp delay-500" style={{
        background: 'linear-gradient(135deg, rgba(74,222,128,0.05), rgba(96,165,250,0.03))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <AlertCircle size={16} color="#60a5fa" />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Market Intelligence</h3>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{data.market_insight}</p>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12, borderLeft: '3px solid #4ade80' }}>
          <p style={{ fontSize: 11, color: '#4ade80', fontWeight: 600, marginBottom: 4 }}>🤖 Agent Reasoning</p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.agent_reasoning}</p>
        </div>
      </div>
    </div>
  );
}
