from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from datetime import datetime

from ml.crop_recommender import train_from_csv, predict, get_meta

# Add your OpenWeatherMap API key here, or as an environment variable
OPENWEATHERMAP_API_KEY = os.environ.get("OPENWEATHERMAP_API_KEY", "")

# Weather condition code → description + emoji
def _wmo_label(code: int):
    if code == 0:   return ("Clear Sky", "☀️")
    if code <= 2:   return ("Partly Cloudy", "🌤️")
    if code == 3:   return ("Overcast", "☁️")
    if code <= 49:  return ("Foggy", "🌫️")
    if code <= 57:  return ("Drizzle", "🌦️")
    if code <= 67:  return ("Rain", "🌧️")
    if code <= 77:  return ("Snow", "❄️")
    if code <= 82:  return ("Rain Showers", "🌧️")
    if code <= 99:  return ("Thunderstorm", "⛈️")
    return ("Unknown", "🌡️")

def _get_season(lat: float) -> str:
    month = datetime.now().month
    if lat >= 0:  # Northern hemisphere
        return "Kharif" if 6 <= month <= 11 else "Rabi"
    else:
        return "Kharif" if month <= 5 or month == 12 else "Rabi"

app = FastAPI(title="FarmIQ ML Backend")

# Allow Next.js frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoilParams(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture: float
    temperature: float
    organic_matter: float
    location: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/weather/{city}")
def get_weather(city: str):
    """Fetch real weather for any city using free Open-Meteo APIs (no key needed)."""
    try:
        # Step 1: Geocode city → lat/lon
        geo = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": city, "count": 1, "language": "en", "format": "json"},
            timeout=5,
        ).json()

        results = geo.get("results")
        if not results:
            raise HTTPException(status_code=404, detail=f"City '{city}' not found")

        loc = results[0]
        lat, lon = loc["latitude"], loc["longitude"]
        loc_name = f"{loc['name']}, {loc.get('country', '')}"

        # Step 2: Fetch current + 7-day forecast from Open-Meteo
        weather = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index",
                "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
                "timezone": "auto",
                "forecast_days": 7,
            },
            timeout=5,
        ).json()

        curr = weather["current"]
        daily = weather["daily"]

        condition, _ = _wmo_label(curr["weather_code"])

        DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        forecast = []
        for i in range(7):
            _, icon = _wmo_label(daily["weather_code"][i])
            forecast.append({
                "day": DAY_LABELS[i],
                "high": round(daily["temperature_2m_max"][i]),
                "low": round(daily["temperature_2m_min"][i]),
                "rain": daily["precipitation_probability_max"][i] or 0,
                "icon": icon,
            })

        return {
            "location": loc_name,
            "temperature": round(curr["temperature_2m"], 1),
            "feels_like": round(curr["apparent_temperature"], 1),
            "humidity": curr["relative_humidity_2m"],
            "wind_speed": round(curr["wind_speed_10m"]),
            "uv_index": round(curr.get("uv_index", 0)),
            "rainfall_mm": 0,
            "condition": condition,
            "season": _get_season(lat),
            "forecast": forecast,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch failed: {str(e)}")

@app.get("/model/status")
def model_status():
    meta = get_meta()
    if meta:
        return {"trained": True, **meta}
    return {"trained": False}

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        content = await file.read()
        meta = train_from_csv(content)
        return {
            "success": True,
            "message": f"Model successfully trained with {meta['accuracy']}% accuracy.",
            **meta
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/predict/crop")
def predict_crop(params: SoilParams):
    try:
        # 1. Try to fetch live weather data if API key is present
        humidity_to_use = params.moisture + 20  # Default fallback proxy
        temperature_to_use = params.temperature
        
        if OPENWEATHERMAP_API_KEY and params.location:
            try:
                # Geocoding - get lat/lon for the location string
                geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={params.location}&limit=1&appid={OPENWEATHERMAP_API_KEY}"
                geo_resp = requests.get(geo_url, timeout=3).json()
                
                if geo_resp and isinstance(geo_resp, list) and len(geo_resp) > 0:
                    lat = geo_resp[0]["lat"]
                    lon = geo_resp[0]["lon"]
                    
                    # Fetch current weather
                    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={OPENWEATHERMAP_API_KEY}"
                    weather_resp = requests.get(weather_url, timeout=3).json()
                    
                    if "main" in weather_resp:
                        humidity_to_use = weather_resp["main"]["humidity"]
                        temperature_to_use = weather_resp["main"]["temp"]
            except Exception as e:
                    print(f"Warning: Failed to fetch live weather data: {e}")

            # Simulated rainfall (Kaggle dataset needs rainfall in mm/month, typically 50-300mm)
        simulated_rainfall = 200.0

        recommendations = predict(
            N=params.nitrogen,
            P=params.phosphorus,
            K=params.potassium,
            temperature=temperature_to_use,
            humidity=humidity_to_use,
            ph=params.ph,
            rainfall=simulated_rainfall
        )

        return {
            "recommended_crops": recommendations,
            "irrigation_schedule": {
                 "frequency": "Every 4 days",
                 "amount_liters_per_acre": 1500,
                 "method": "Drip Irrigation",
                 "next_irrigation": "2026-03-31",
                 "weekly_schedule": [
                     {"day": "Mon", "irrigate": True, "amount": 1500},
                     {"day": "Tue", "irrigate": False, "amount": 0},
                     {"day": "Wed", "irrigate": False, "amount": 0},
                     {"day": "Thu", "irrigate": True, "amount": 1500},
                     {"day": "Fri", "irrigate": False, "amount": 0},
                     {"day": "Sat", "irrigate": False, "amount": 0},
                     {"day": "Sun", "irrigate": True, "amount": 1500},
                 ]
            },
            "harvest_window": {
                "start": "October 20, 2026",
                "end": "November 10, 2026",
                "optimal_day": "October 28, 2026",
                "weather_risk": "Low"
            },
            "soil_insights": {
                "overall_health": 82,
                "nitrogen_status": "Adequate" if params.nitrogen > 40 else "Low",
                "phosphorus_status": "Good" if params.phosphorus > 25 else "Low",
                "potassium_status": "Optimal" if params.potassium > 50 else "Adequate",
                "ph_status": "Optimal" if 6.0 <= params.ph <= 7.5 else "Suboptimal",
                "recommendations": [
                    "Maintain current nutrient application schedule.",
                    "Monitor soil moisture levels closely next week."
                ]
            },
            "market_insight": "Market prices for the top recommended crop are stable. Consider forward contracts.",
            "confidence_score": recommendations[0]["probability"] if recommendations else 0.85,
            "agent_reasoning": "Determined via RandomForest classifier based on historical Kaggle dataset relationships."
        }
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
