# Imports
import pandas as pd
import numpy as np
import shap
shap.initjs 
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix


# Reading Data
df = pd.read_csv('mig_data_test.csv')


def ml_model(df):
    # Check if data is too small
    if len(df) < 200:
        print("⚠️ Log more daily check-ins to receive better analytics.")
        return

    # Split features and target
    X = df.drop(columns=["Migraine", "date"])
    y = df["Migraine"]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    # SHAP explanation
    explainer = shap.Explainer(rf_model, X_train)
    shap_values = explainer(X_test, check_additivity=False)
    shap_values_class1 = shap_values[..., 1]
    shap_values_array = shap_values_class1.values

    # Mean predicted migraine risk across user data
    mean_prediction = rf_model.predict_proba(X_test)[:, 1].mean()

    # Mean SHAP values (keep sign to preserve direction)
    mean_shap_signed = shap_values_array.mean(axis=0)

    # Create DataFrame of increasing-risk triggers
    shap_df = pd.DataFrame({
        'Feature': X_test.columns,
        'Mean_SHAP': mean_shap_signed
    }).query("Mean_SHAP > 0").sort_values(by='Mean_SHAP', ascending=False)

    # Output for user
    print(f"Based on your recent check-ins, your average daily migraine risk is {mean_prediction:.2%}.")

    if shap_df.empty:
        print("No triggers found that are consistently increasing your migraine risk.")
    else:
        print("Your top 3 contributing triggers are:")
        for _, row in shap_df.head(3).iterrows():
            name = row['Feature'].replace('_', ' ').lower()
            print(f" - {name}")
        print("\n These are the patterns most associated with an increased migraine risk in your recent check-ins.")
        print("Try to be mindful of them in your daily routine — reducing or avoiding them may help lower your risk over time.")

ml_model(df)

# Updated version
shap.initjs()


def analyze_user_data(df):
    if len(df) < 200:
        return {
            "warning": "⚠️ Log more daily check-ins to receive better analytics.",
            "mean_prediction": None,
            "top_triggers": [],
        }

    X = df.drop(columns=["Migraine", "date"])
    y = df["Migraine"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    explainer = shap.Explainer(rf_model, X_train)
    shap_values = explainer(X_test, check_additivity=False)
    shap_values_class1 = shap_values[..., 1]

    mean_prediction = rf_model.predict_proba(X_test)[:, 1].mean()
    mean_shap_signed = shap_values_class1.values.mean(axis=0)

    shap_df = pd.DataFrame({
        "Feature": X_test.columns,
        "Mean_SHAP": mean_shap_signed
    }).query("Mean_SHAP > 0").sort_values("Mean_SHAP", ascending=False)

    top_3 = shap_df["Feature"].head(3).tolist()
    top_3_readable = [t.replace("_", " ").lower() for t in top_3]

    return {
        "mean_prediction": round(mean_prediction, 4),
        "top_triggers": top_3_readable,
        "shap_df": shap_df,
        "shap_values": shap_values,
        "X_test": X_test
    }
