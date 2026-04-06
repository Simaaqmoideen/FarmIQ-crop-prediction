"""
FarmIQ — ML Crop Recommender
Trains a RandomForestClassifier on the Kaggle Crop Recommendation dataset.

Expected CSV columns:
  N, P, K, temperature, humidity, ph, rainfall, label
  (https://www.kaggle.com/datasets/atharvakadam/crop-recommendation-dataset)
"""

import os, io
import numpy as np
import pandas as pd
import joblib
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

MODEL_PATH  = "ml/models/crop_model.pkl"
ENCODER_PATH = "ml/models/label_encoder.pkl"
META_PATH   = "ml/models/meta.json"

# ── Nutrient + water hints per crop ────────────────────────────────────────────
CROP_INFO: dict[str, dict] = {
    "rice":        {"water_need": "High",   "growth_days": 120},
    "maize":       {"water_need": "Medium", "growth_days": 90 },
    "wheat":       {"water_need": "Medium", "growth_days": 110},
    "chickpea":    {"water_need": "Low",    "growth_days": 100},
    "kidneybeans": {"water_need": "Medium", "growth_days": 90 },
    "pigeonpeas":  {"water_need": "Low",    "growth_days": 150},
    "mothbeans":   {"water_need": "Low",    "growth_days": 75 },
    "mungbean":    {"water_need": "Low",    "growth_days": 65 },
    "blackgram":   {"water_need": "Low",    "growth_days": 80 },
    "lentil":      {"water_need": "Low",    "growth_days": 100},
    "pomegranate": {"water_need": "Low",    "growth_days": 180},
    "banana":      {"water_need": "High",   "growth_days": 300},
    "mango":       {"water_need": "Medium", "growth_days": 365},
    "grapes":      {"water_need": "Medium", "growth_days": 180},
    "watermelon":  {"water_need": "High",   "growth_days": 80 },
    "muskmelon":   {"water_need": "Medium", "growth_days": 75 },
    "apple":       {"water_need": "Medium", "growth_days": 365},
    "orange":      {"water_need": "Medium", "growth_days": 300},
    "papaya":      {"water_need": "High",   "growth_days": 240},
    "coconut":     {"water_need": "High",   "growth_days": 365},
    "cotton":      {"water_need": "Medium", "growth_days": 180},
    "jute":        {"water_need": "High",   "growth_days": 120},
    "coffee":      {"water_need": "High",   "growth_days": 365},
    "soybean":     {"water_need": "Medium", "growth_days": 100},
}

REQUIRED_COLS = {"N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"}


def _ensure_dirs():
    os.makedirs("ml/models", exist_ok=True)


def train_from_csv(csv_bytes: bytes) -> dict:
    """
    Train RandomForestClassifier from raw CSV bytes.
    Returns metadata dict with accuracy, classes, sample count.
    """
    _ensure_dirs()

    df = pd.read_csv(io.BytesIO(csv_bytes))
    df.columns = df.columns.str.strip()

    # Validate columns
    missing = REQUIRED_COLS - set(df.columns)
    if missing:
        raise ValueError(f"CSV is missing columns: {missing}. Expected: {REQUIRED_COLS}")

    df = df.dropna()
    X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]].values

    le = LabelEncoder()
    y  = le.fit_transform(df["label"].str.lower().str.strip())

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
    clf.fit(X_train, y_train)

    acc = accuracy_score(y_test, clf.predict(X_test)) * 100

    joblib.dump(clf, MODEL_PATH)
    joblib.dump(le,  ENCODER_PATH)

    import json
    meta = {
        "accuracy": round(acc, 2),
        "crop_classes": len(le.classes_),
        "training_samples": len(X_train),
        "classes": list(le.classes_),
        "trained_at": datetime.utcnow().isoformat(),
    }
    with open(META_PATH, "w") as f:
        json.dump(meta, f)

    return meta


def load_model():
    """Load saved model + encoder. Returns (clf, le) or (None, None)."""
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        return joblib.load(MODEL_PATH), joblib.load(ENCODER_PATH)
    return None, None


def predict(N: float, P: float, K: float, temperature: float,
            humidity: float, ph: float, rainfall: float) -> list[dict]:
    """
    Return top-3 crop recommendations with probabilities.
    Raises RuntimeError if model not trained yet.
    """
    clf, le = load_model()
    if clf is None:
        raise RuntimeError("Model not trained. Upload a Kaggle CSV first.")

    feats = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    probs  = clf.predict_proba(feats)[0]

    # Top-3 indices
    top3_idx = np.argsort(probs)[::-1][:3]
    results  = []

    yield_estimates = {
        "High": ("55–65 qtl/acre", "₹80,000–₹95,000/acre"),
        "Medium": ("35–45 qtl/acre", "₹55,000–₹70,000/acre"),
        "Low":  ("18–28 qtl/acre", "₹35,000–₹50,000/acre"),
    }

    for rank, idx in enumerate(top3_idx):
        name = le.classes_[idx]
        info = CROP_INFO.get(name, {"water_need": "Medium", "growth_days": 100})
        wn   = info["water_need"]
        yld, profit = yield_estimates[wn]

        score = round(float(probs[idx]) * 100, 1)
        results.append({
            "name": name.title(),
            "match_score": score,
            "probability": round(float(probs[idx]), 4),
            "water_need": wn,
            "growth_days": info["growth_days"],
            "expected_yield": yld,
            "profit_estimate": profit,
            "reason": _build_reason(name, rank, N, P, K, ph, humidity, score),
        })

    return results


def _build_reason(crop: str, rank: int, N, P, K, ph, humidity, score) -> str:
    reasons = {
        0: f"Best match at {score:.0f}% confidence. Soil NPK profile (N={N}, P={P}, K={K}) and pH {ph:.1f} are ideal for {crop.title()} cultivation.",
        1: f"Strong alternative at {score:.0f}% confidence. Lower risk option given current humidity ({humidity:.0f}%). Good rotation crop.",
        2: f"Viable option at {score:.0f}% confidence. Consider this if primary recommendations face market saturation.",
    }
    return reasons.get(rank, "Suitable based on soil and climate parameters.")


def get_meta() -> dict | None:
    """Return model metadata if available."""
    import json
    if os.path.exists(META_PATH):
        with open(META_PATH) as f:
            return json.load(f)
    return None
