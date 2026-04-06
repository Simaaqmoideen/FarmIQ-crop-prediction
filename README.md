# 🌾 FarmIQ (Farmer Agent)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-Next.js_16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white)

FarmIQ is an intelligent, full-stack web application designed to help farmers make data-driven decisions. By leveraging a machine learning pipeline powered by a Random Forest Classifier trained on Kaggle crop datasets, FarmIQ recommends the best crops to plant based on various environmental inputs.

## ✨ Key Features

- **🌾 AI Crop Recommendation**: Upload data and get real-time recommendations for crop suitability based on Nitrogen (N), Phosphorous (P), Potassium (K), temperature, humidity, pH, and rainfall.
- **📊 Beautiful Dashboard**: A highly responsive, animated frontend built with Framer Motion, Tailwind CSS, and Recharts.
- **⚡ Fast backend access**: Features a highly performant API powered by Python, FastAPI, and Uvicorn.
- **📂 Dynamic CSV Uploading**: Directly upload Kaggle datasets to actively train the models dynamically.

## 🛠️ Tech Stack

**Frontend**
- Next.js (React Server Components, App Router)
- React & TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend (Machine Learning)**
- Python 3.10+
- FastAPI & Uvicorn (API framework)
- Scikit-Learn (RandomForestClassifier model)
- Pandas & NumPy (Data processing)
- Joblib (Model serialization)

## 📂 Project Structure

```
farmer-agent/
├── app/               # Next.js frontend application structure (Pages, layouts)
├── components/        # Reusable React components (UI, charts, forms)
├── public/            # Static assets
└── backend/           # Python FastAPI application
    ├── ml/            # Machine Learning scripts and trained models
    ├── main.py        # FastAPI server entry point
    └── requirements.txt # Python dependencies
```

## 🚀 Getting Started

To run this project locally, you will need to start both the Python Backend and the Next.js Frontend.

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)

### 1. Setup the Machine Learning Backend

Open a new terminal and navigate to the backend folder:

```bash
cd backend
```

*(Optional but recommended: Create a virtual environment)*
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install the dependencies:
```bash
pip install -r requirements.txt
```

Start the API Server:
```bash
python -m uvicorn main:app --reload --port 8000
```
*The backend should now be running at `http://localhost:8000`*

### 2. Setup the Next.js Frontend

Open a second terminal window at the project root (`farmer-agent/`):

```bash
# Install NPM dependencies
npm install

# Start the development server
npm run dev
```

*The frontend application should now be running at `http://localhost:3000`*

## 💡 How to Use

1. Navigate to `http://localhost:3000`.
2. To train the model, go to the Upload section (`http://localhost:3000/upload`) and upload the `Crop_recommendation.csv` dataset.
3. Once the dataset is uploaded and the model is trained, the application will switch from "Demo Mode" to "ML Active Mode," and you can start getting live predictions.

You can also interact directly with the API:
```bash
# Health Check API
curl http://localhost:8000/health

# Upload Dataset API
curl -F "file=@/path/to/Crop_recommendation.csv" http://localhost:8000/upload-dataset
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/farmer-agent/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.