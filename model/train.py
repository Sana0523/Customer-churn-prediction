# model/train.py

import joblib
import json
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report

def train_and_evaluate():
    print("Loading preprocessed data...")
    try:
        # Load the data generated from Phase 2
        X_train, X_test, y_train, y_test = joblib.load('model/processed_data.joblib')
    except FileNotFoundError:
        print("Error: Processed data not found. Please run 'python model/preprocess.py' first.")
        return

    print("Training XGBoost Classifier...")
    # Initialize XGBoost model
    # We use standard hyperparameters that perform well generally
    model = XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss' 
    )

    # Train the model on the preprocessed training set
    model.fit(X_train, y_train)

    print("Evaluating model...")
    # Make predictions for evaluation
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]

    # Calculate Evaluation Metrics
    accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    
    print("\n--- Model Performance ---")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"ROC-AUC:   {roc_auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save evaluation metrics to a file (useful for the dashboard later on)
    metrics = {
        'accuracy': float(accuracy),
        'roc_auc': float(roc_auc)
    }
    with open('model/metrics.json', 'w') as f:
        json.dump(metrics, f)

    print("Saving trained model...")
    # Save the trained model for the FastAPI backend
    joblib.dump(model, 'model/xgb_model.joblib')
    print("Model training complete and successfully saved as 'model/xgb_model.joblib'")

if __name__ == "__main__":
    train_and_evaluate()
