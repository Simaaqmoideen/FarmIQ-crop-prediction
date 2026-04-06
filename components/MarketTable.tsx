"use client";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface MarketItem {
  crop: string;
  msp: number;
  market_price: number;
  demand: number;
  trend: string;
  change: string;
}

interface Props {
  data: MarketItem[];
  isVisible: boolean;
}

const cropEmoji: Record<string, string> = {
  Rice: "🌾", Wheat: "🌿", Maize: "🌽", Soybean: "🫘"
};

export default function MarketTable({ data, isVisible }: Props) {
  if (!isVisible) return (
    <div className="glow-card p-5 flex flex-col items-center justify-center" style={{ opacity: 0.4, minHeight: 120 }}>
      <BarChart3 size={28} color="var(--text-muted)" />
      <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 12 }}>Market data loads after analysis</p>
    </div>
  );

  return (
    <div className="glow-card p-5 animate-fadeInUp delay-300">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <BarChart3 size={16} color="#fbbf24" />
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Live Market Prices</h3>
        <div className="pulse-dot" style={{ marginLeft: 'auto' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map((item) => (
          <div key={item.crop} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.02)', borderRadius: 10,
            padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ fontSize: 20 }}>{cropEmoji[item.crop] || "🌱"}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{item.crop}</p>
              <div className="progress-bar" style={{ width: 80 }}>
                <div className="progress-fill" style={{
                  width: `${item.demand}%`,
                  background: item.demand > 80 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Demand: {item.demand}%</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>₹{item.market_price.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>MSP: ₹{item.msp.toLocaleString()}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end', marginTop: 2 }}>
                {item.trend === "up"
                  ? <TrendingUp size={12} color="#4ade80" />
                  : <TrendingDown size={12} color="#f87171" />}
                <span style={{ fontSize: 11, fontWeight: 700, color: item.trend === "up" ? '#4ade80' : '#f87171' }}>
                  {item.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
