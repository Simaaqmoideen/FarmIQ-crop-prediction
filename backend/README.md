# FarmIQ ML Backend

This is the Python FastAPI ML backend for FarmIQ. It uses a RandomForestClassifier trained on the Kaggle Crop Recommendation dataset.

## Setup

1. Install Python 3.10+
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## API Testing

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Upload Kaggle Dataset:**
You can upload the `Crop_recommendation.csv` via the frontend UI at `http://localhost:3000/upload` or via curl:
```bash
curl -F "file=@/path/to/Crop_recommendation.csv" http://localhost:8000/upload-dataset
```

*(Once the model is trained, the frontend dashboard will automatically switch from Demo Mode to ML Active mode).*
