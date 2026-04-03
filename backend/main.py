from fastapi import FastAPI

app = FastAPI(title="Customer Churn Prediction API")

@app.get("/")
def read_root():
    return {"message": "Customer Churn Prediction API is running."}
