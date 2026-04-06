"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  data: { year: string; rice: number; maize: number; soybean: number }[];
  isVisible: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d1421', border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: 10, padding: '12px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: p.color, textTransform: 'capitalize' }}>{p.name}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.value} qtl/acre</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function YieldChart({ data, isVisible }: Props) {
  if (!isVisible) return (
    <div className="glow-card p-6 flex flex-col items-center justify-center" style={{ minHeight: 200, opacity: 0.4 }}>
      <TrendingUp size={40} color="var(--text-muted)" />
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13 }}>Yield predictions will appear after analysis</p>
    </div>
  );

  return (
    <div className="glow-card p-6 animate-fadeInUp delay-200">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} color="#4ade80" />
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Crop Yield Prediction</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Historical + ML-projected yields (qtl/acre)</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-purple">ML Forecast</span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {/* Projection label */}
        <div style={{
          position: 'absolute', right: 0, top: 0, zIndex: 10,
          background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 6, padding: '3px 8px', fontSize: 11, color: '#a78bfa', fontWeight: 600
        }}>
          Last 2 years = Predicted
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="riceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="maizeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="soybeanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 12, fontSize: 12, color: '#94a3b8' }}
              formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12, textTransform: 'capitalize' }}>{value}</span>}
            />
            <Area type="monotone" dataKey="rice" name="Rice" stroke="#4ade80" strokeWidth={2.5} fill="url(#riceGrad)" dot={{ fill: '#4ade80', r: 3, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="maize" name="Maize" stroke="#60a5fa" strokeWidth={2.5} fill="url(#maizeGrad)" dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="soybean" name="Soybean" stroke="#fbbf24" strokeWidth={2.5} fill="url(#soybeanGrad)" dot={{ fill: '#fbbf24', r: 3, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stat Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
        {[
          { label: "Rice '26 (P)", value: "52 qtl", change: "+4%", color: "#4ade80" },
          { label: "Maize '26 (P)", value: "38 qtl", change: "+2.7%", color: "#60a5fa" },
          { label: "Soybean '26 (P)", value: "23 qtl", change: "+4.5%", color: "#fbbf24" },
        ].map(({ label, value, change, color }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '10px 12px',
            border: `1px solid ${color}22`, textAlign: 'center'
          }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "'Space Grotesk'" }}>{value}</p>
            <p style={{ fontSize: 11, color: '#4ade80', marginTop: 2 }}>{change} YoY</p>
          </div>
        ))}
      </div>
    </div>
  );
}
