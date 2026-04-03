# Customer Churn Prediction App

A full-stack machine learning application to predict customer churn, built with React, Tailwind CSS, FastAPI, and XGBoost.

## Features
- **Machine Learning**: XGBoost model trained on the Telco Customer Churn dataset.
- **Backend API**: High-performance FastAPI endpoints.
- **Frontend Dashboard**: Interactive React UI with feature importance visualizations.
- **Containerized**: Easy deployment using Docker & Docker Compose.

## Running Locally (Development)

1. **Backend**:
   ```bash
   pip install -r requirements.txt
   cd backend
   python -m uvicorn main:app --reload
