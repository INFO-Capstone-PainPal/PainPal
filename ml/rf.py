# Imports
import pandas as pd
import numpy as np
import shap
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

# shap.initjs()

def analyze_user_data(df):
    print("➡️ Columns before cleaning:", df.columns.tolist())

    if len(df) < 200:
        return {
            "warning": "⚠️ Log more daily check-ins to receive better analytics.",
            "mean_prediction": None,
            "top_triggers": [],
        }

    # Flatten weather JSON columns
    if "weather" in df.columns:
        weather_df = df["weather"].apply(pd.Series).add_prefix("migraine_weather_")
        df = pd.concat([df.drop(columns=["weather"]), weather_df], axis=1)

    if "weather_checkin" in df.columns:
        weather_checkin_df = df["weather_checkin"].apply(pd.Series).add_prefix("checkin_weather_")
        df = pd.concat([df.drop(columns=["weather_checkin"]), weather_checkin_df], axis=1)

    # Drop target column and non-numeric data
    y = df["had_migraine"]
    X = df.drop(columns=["had_migraine", "start_time", "date", "checkin_date"])

    # Drop any non-numeric columns
    X = X.select_dtypes(include=["number"])

    print("🧪 Cleaned features:", X.columns.tolist())
    print("📐 Shape of X:", X.shape)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Warn if only one class is present
    if len(np.unique(y_train)) < 2:
        print("⚠️ Only one class (all migraines or no migraines) in training data. Model results may be invalid.")
        return {
            "warning": "⚠️ Your recent check-ins all have the same migraine status. Log a mix of migraine and non-migraine days for meaningful insights.",
            "mean_prediction": None,
            "top_triggers": [],
        }

    # Train model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    # SHAP explanations
    explainer = shap.Explainer(rf_model, X_train)
    shap_values = explainer(X_test, check_additivity=False)

    # Safe handling for binary or single-class SHAP output
    if shap_values.values.ndim == 2 and shap_values.values.shape[1] > 1:
        shap_values_class1 = shap_values[..., 1]
        mean_prediction = rf_model.predict_proba(X_test)[:, 1].mean()
    else:
        shap_values_class1 = shap_values
        mean_prediction = rf_model.predict_proba(X_test)[:, 0].mean()

    # SHAP interpretation
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
        "X_test": X_test,
    }


def ml_model(df):
    if len(df) < 200:
        print("⚠️ Log more daily check-ins to receive better analytics.")
        return

    X = df.drop(columns=["had_migraine"])
    X = X.select_dtypes(include=["number"])
    y = df["had_migraine"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    explainer = shap.Explainer(rf_model, X_train)
    shap_values = explainer(X_test, check_additivity=False)

    if shap_values.values.ndim == 2 and shap_values.values.shape[1] > 1:
        # Multi-class (binary) case: use class 1
        shap_values_class1 = shap_values[..., 1]
        mean_prediction = rf_model.predict_proba(X_test)[:, 1].mean()
    else:
        # Single-class case: use the only output
        shap_values_class1 = shap_values
        mean_prediction = rf_model.predict_proba(X_test)[:, 0].mean()

    shap_values_array = shap_values_class1.values
    mean_shap_signed = shap_values_array.mean(axis=0)

    shap_df = pd.DataFrame({
        'Feature': X_test.columns,
        'Mean_SHAP': mean_shap_signed
    }).query("Mean_SHAP > 0").sort_values(by='Mean_SHAP', ascending=False)

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
