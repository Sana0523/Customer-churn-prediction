# backend/main.py
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import io
import os

app = FastAPI(title="Customer Churn Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup robust paths relative to this file so we can run from anywhere
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "xgb_model.joblib")
PREPROCESSOR_PATH = os.path.join(BASE_DIR, "model", "preprocessor.joblib")

# Load model and preprocessor on startup
try:
    model = joblib.load(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
except FileNotFoundError:
    print("Warning: Model or Preprocessor not found. Ensure you have run preprocess.py and train.py")

# Pydantic schema for individual predictions
class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: str

@app.get("/")
def read_root():
    return {"message": "Customer Churn Prediction API is running!"}

@app.post("/predict")
def predict(customer: CustomerData):
    try:
        # Convert input dictionary into a pandas DataFrame (1 row)
        df = pd.DataFrame([customer.dict()])
        
        # Apply the exact same preprocessing used in Phase 2
        X_processed = preprocessor.transform(df)
        
        # Predict churn binary outcome and probability
        prediction = model.predict(X_processed)[0]
        probability = model.predict_proba(X_processed)[0][1]
        
        return {
            "churn_prediction": "Yes" if prediction == 1 else "No",
            "churn_probability": float(probability)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/batch_predict")
async def batch_predict(file: UploadFile = File(...)):
    try:
        # Read uploaded CSV
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # We need a copy of the original payload for the response
        results_df = df.copy()

        # Check if customerID is in dataset and drop it for prediction
        if 'customerID' in df.columns:
            df.drop('customerID', axis=1, inplace=True)
            
        # Apply preprocessing
        X_processed = preprocessor.transform(df)
        
        # Predict
        preds = model.predict(X_processed)
        probs = model.predict_proba(X_processed)[:, 1]
        
        # Attach predictions to the dataframe
        results_df['Churn_Prediction'] = ["Yes" if p == 1 else "No" for p in preds]
        results_df['Churn_Probability'] = probs
        
        # Return as JSON records
        return results_df.to_dict(orient="records")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
