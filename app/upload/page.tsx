"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { uploadDataset } from "@/lib/api";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; accuracy?: number } | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setResult(null);

    const res = await uploadDataset(file);
    setResult(res);
    setIsUploading(false);
    
    if (res.success) {
      setTimeout(() => router.push("/"), 2500);
    }
  };

  return (
    <div className="grid-bg" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 24px" }}>
        
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-muted)", marginBottom: 24, fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            Train ML Model <span style={{ color: "#60a5fa" }}>(Kaggle Dataset)</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 15 }}>
            Upload the Kaggle <strong>"Crop Recommendation Dataset"</strong> to train the local RandomForest model. 
            Once trained, the agent will switch from demo mode to using real ML inference.
          </p>
        </div>

        {/* Upload Area */}
        <div className="glow-card" style={{ padding: 40, border: "2px dashed rgba(96,165,250,0.3)" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ 
              width: 80, height: 80, borderRadius: "50%", 
              background: "rgba(96,165,250,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20
            }}>
              <UploadCloud size={40} color="#60a5fa" />
            </div>

            {!file ? (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Select CSV File</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24, maxWidth: 300 }}>
                  Upload Crop_recommendation.csv. Required columns: N, P, K, temperature, humidity, ph, rainfall, label
                </p>
                <label className="btn-primary" style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", cursor: "pointer" }}>
                  Browse Files
                  <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: "none" }} />
                </label>
              </>
            ) : (
              <div style={{ width: "100%" }}>
                <div style={{ 
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: 24, textAlign: "left"
                }}>
                  <FileText size={24} color="#60a5fa" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{file.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Change
                  </button>
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="btn-primary" 
                  style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}
                >
                  {isUploading ? (
                    <>
                      <div className="spinner-sm" style={{ borderTopColor: "#fff" }} />
                      Training Model...
                    </>
                  ) : (
                    <>
                      <BrainCircuit size={18} />
                      Start Training
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Message */}
        {result && (
          <div className="animate-fadeInUp" style={{ 
            marginTop: 24, padding: 20, borderRadius: 12,
            background: result.success ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
            border: `1px solid ${result.success ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
            display: "flex", gap: 12, alignItems: "flex-start"
          }}>
            {result.success ? (
              <CheckCircle2 size={24} color="#4ade80" style={{ flexShrink: 0 }} />
            ) : (
              <AlertCircle size={24} color="#f87171" style={{ flexShrink: 0 }} />
            )}
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: result.success ? "#4ade80" : "#f87171", marginBottom: 4 }}>
                {result.success ? "Training Complete!" : "Upload Failed"}
              </h4>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {result.message}
              </p>
              {result.success && result.accuracy && (
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <span className="badge badge-green">Accuracy: {result.accuracy}%</span>
                  <span className="badge badge-blue">Ready for Inference</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
