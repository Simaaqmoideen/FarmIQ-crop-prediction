"use client";
import { Cloud, Droplets, Wind, Thermometer, Eye, Sun } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  rainfall_mm: number;
  wind_speed: number;
  uv_index: number;
  season: string;
  condition: string;
  forecast: { day: string; high: number; low: number; rain: number; icon: string }[];
}

interface Props {
  data: WeatherData;
  isVisible: boolean;
}

export default function WeatherCard({ data, isVisible }: Props) {
  if (!isVisible) return (
    <div className="glow-card p-6 flex flex-col items-center justify-center" style={{ minHeight: 200, opacity: 0.4 }}>
      <Cloud size={40} color="var(--text-muted)" />
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13 }}>Run analysis to fetch weather data</p>
    </div>
  );

  const stats = [
    { icon: Droplets, label: "Humidity", value: `${data.humidity}%`, color: "#38bdf8" },
    { icon: Wind, label: "Wind", value: `${data.wind_speed} km/h`, color: "#94a3b8" },
    { icon: Cloud, label: "Rainfall (7d)", value: `${data.rainfall_mm} mm`, color: "#60a5fa" },
    { icon: Sun, label: "UV Index", value: data.uv_index.toString(), color: "#fbbf24" },
  ];

  return (
    <div className="glow-card neon-border scan-container p-6 animate-fadeInUp">
      {/* Main weather */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span className="badge badge-blue">{data.season} Season</span>
          </div>
          <h3 style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4 }}>{data.location}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.temperature}°
            </span>
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{data.condition}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Feels like {data.feels_like}°C</p>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 56, lineHeight: 1 }}>🌤️</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10, padding: '10px 12px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Icon size={14} color={color} />
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 7-day forecast */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>7-Day Forecast</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {data.forecast.map((day) => (
            <div key={day.day} style={{
              textAlign: 'center',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 8, padding: '8px 4px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{day.day}</p>
              <p style={{ fontSize: 16 }}>{day.icon}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{day.high}°</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{day.low}°</p>
              {day.rain > 0 && (
                <p style={{ fontSize: 10, color: '#60a5fa', marginTop: 2 }}>{day.rain}%</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
