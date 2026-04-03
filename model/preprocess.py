# model/preprocess.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import joblib

def load_and_preprocess_data(file_path):
    print("Loading dataset...")
    # Using the standard Telco Customer Churn dataset
    df = pd.read_csv(file_path)

    # 1. Clean Data
    # Drop customer ID as it's not useful for prediction
    if 'customerID' in df.columns:
        df.drop('customerID', axis=1, inplace=True)

    # Fix TotalCharges: convert blank strings to NaN, then numeric
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    
    # 2. Define Features and Target
    X = df.drop('Churn', axis=1)
    # Convert 'Yes'/'No' target to 1/0
    y = df['Churn'].map({'Yes': 1, 'No': 0})

    # Define numeric and categorical columns
    numeric_features = ['tenure', 'MonthlyCharges', 'TotalCharges']
    categorical_features = [col for col in X.columns if col not in numeric_features]

    # 3. Create Preprocessing Pipelines
    # Pipeline for numeric features: fill missing values (NaNs from TotalCharges) with median, then scale
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # Pipeline for categorical features: fill missing values with mode, then one-hot encode
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', drop='first'))
    ])

    # Combine preprocessing steps using ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])

    # 4. Train-Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Fitting preprocessing pipeline...")
    # Fit and transform the training data
    X_train_processed = preprocessor.fit_transform(X_train)
    # Only transform the test data to prevent data leakage
    X_test_processed = preprocessor.transform(X_test)

    # 5. Save the pipeline and processed data
    print("Saving pipeline and processed data...")
    joblib.dump(preprocessor, 'model/preprocessor.joblib')
    
    # We save these for the next phase to train our model
    joblib.dump((X_train_processed, X_test_processed, y_train, y_test), 'model/processed_data.joblib')
    
    print("Preprocessing complete!")

if __name__ == "__main__":
    # Assuming you have downloaded the dataset as 'telco_churn.csv' in the model folder
    # You can download it from Kaggle: https://www.kaggle.com/datasets/blastchar/telco-customer-churn
    try:
        load_and_preprocess_data('model/telco_churn.csv')
    except FileNotFoundError:
        print("Please download 'telco_churn.csv' and place it in the 'model/' directory.")
