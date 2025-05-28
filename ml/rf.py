# Imports
import pandas as pd
import numpy as np
import shap
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

def analyze_user_data(df):
    print("➡️ Columns before cleaning:", df.columns.tolist())

    if len(df) < 50:
        return {
            "warning": "⚠️ Log more daily check-ins to receive better analytics.",
            "mean_prediction": None,
            "top_triggers": [],
        }

    # Prepare data
    target_col = "Migraine" if "Migraine" in df.columns else "migraine"
    y = df[target_col]
    X = df.drop(columns=[target_col, "date"], errors="ignore")
    X = X.select_dtypes(include=["number"])

    print("🧪 Cleaned features:", X.columns.tolist())
    print("📐 Shape of X:", X.shape)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    if len(np.unique(y_train)) < 2:
        return {
            "warning": "⚠️ Your recent check-ins all have the same migraine status. Log a mix of migraine and non-migraine days for meaningful insights.",
            "mean_prediction": None,
            "top_triggers": [],
        }

    # Train model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)

    # Predict
    y_pred_prob = rf_model.predict_proba(X_test)
    mean_prediction = y_pred_prob[:, 1].mean() if y_pred_prob.shape[1] > 1 else y_pred_prob[:, 0].mean()

    # SHAP explanation
    explainer = shap.Explainer(rf_model, X_train)
    shap_values = explainer(X_test, check_additivity=False)

    # Resolve SHAP dimensionality
    shap_array = shap_values.values
    print(f"# of SHAP values: {shap_array.shape[0]}")
    print(f"# of features: {X_test.shape[1]}")

    if shap_array.ndim == 3:
        shap_array = shap_array[:, 1, :]  # class 1
    elif shap_array.ndim != 2:
        raise ValueError("Unexpected SHAP shape")

    if shap_array.shape[1] != X_test.shape[1]:
        # Align manually if mismatch (rare but SHAP can skip samples)
        if shap_array.shape[1] != X_test.shape[1]:
            print("⚠️ SHAP and feature mismatch. Aligning by min length.")
        min_len = min(shap_array.shape[0], X_test.shape[0])
        shap_array = shap_array[:min_len, :]
        X_test_aligned = X_test.iloc[:min_len]
    else:
        X_test_aligned = X_test

    # Mean SHAP values
    mean_shap_signed = np.mean(shap_array, axis=0)

    # Safety check
    if len(mean_shap_signed) != len(X_test_aligned.columns):
        print("⚠️ SHAP and feature mismatch. Forcing alignment.")
        min_len = min(len(mean_shap_signed), len(X_test_aligned.columns))
        features = X_test_aligned.columns[:min_len]
        shap_vals = mean_shap_signed[:min_len]
    else:
        features = X_test_aligned.columns
        shap_vals = mean_shap_signed

    shap_df = pd.DataFrame({
        "Feature": features,
        "Mean_SHAP": shap_vals
    }).sort_values(by="Mean_SHAP", ascending=False)


    top_3 = shap_df["Feature"].head(3).tolist()
    top_3_readable = [t.replace("_", " ").lower() for t in top_3]

    return {
    "mean_prediction": round(mean_prediction, 4),
    "top_triggers": top_3_readable
}

# def ml_model(df):
#     if len(df) < 200:
#         print("⚠️ Log more daily check-ins to receive better analytics.")
#         return

#     X = df.drop(columns=["had_migraine"])
#     X = X.select_dtypes(include=["number"])
#     y = df["had_migraine"]

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
#     rf_model.fit(X_train, y_train)

#     explainer = shap.Explainer(rf_model, X_train)
#     shap_values = explainer(X_test, check_additivity=False)

#     if shap_values.values.ndim == 2 and shap_values.values.shape[1] > 1:
#         # Multi-class (binary) case: use class 1
#         shap_values_class1 = shap_values[..., 1]
#         mean_prediction = rf_model.predict_proba(X_test)[:, 1].mean()
#     else:
#         # Single-class case: use the only output
#         shap_values_class1 = shap_values
#         mean_prediction = rf_model.predict_proba(X_test)[:, 0].mean()

#     shap_values_array = shap_values_class1.values
#     mean_shap_signed = shap_values_array.mean(axis=0)

#     shap_df = pd.DataFrame({
#         'Feature': X_test.columns,
#         'Mean_SHAP': mean_shap_signed
#     }).query("Mean_SHAP > 0").sort_values(by='Mean_SHAP', ascending=False)

#     print(f"Based on your recent check-ins, your average daily migraine risk is {mean_prediction:.2%}.")

#     if shap_df.empty:
#         print("No triggers found that are consistently increasing your migraine risk.")
#     else:
#         print("Your top 3 contributing triggers are:")
#         for _, row in shap_df.head(3).iterrows():
#             name = row['Feature'].replace('_', ' ').lower()
#             print(f" - {name}")
#         print("\n These are the patterns most associated with an increased migraine risk in your recent check-ins.")
#         print("Try to be mindful of them in your daily routine — reducing or avoiding them may help lower your risk over time.")
