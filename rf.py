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


# Splitting to triggers and prediction
X = df.drop(columns=["Migraine", "date"])
y = df["Migraine"]


# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# Random Forest Classifier Model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

y_pred = rf_model.predict(X_test)


# SHAP Explainer
explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(X_test)


# SHAP 
explainer = shap.Explainer(rf_model, X_train)
shap_values = explainer(X_test, check_additivity=False)

shap_values_class1 = shap_values[..., 1]


# Printing out top 3 triggers
shap_values_class1 = shap_values[..., 1]

shap_values_array = shap_values_class1.values

mean_shap = np.abs(shap_values_array).mean(axis=0)

shap_df = pd.DataFrame({
    'Feature': X_test.columns,
    'Mean_SHAP': mean_shap
}).sort_values(by='Mean_SHAP', ascending=False)

top_3 = shap_df['Feature'].head(3).tolist()

formatted_top_3 = [feat.replace('_', ' ').lower() for feat in top_3]

print(f"Your top 3 triggers are {formatted_top_3[0]}, {formatted_top_3[1]}, and {formatted_top_3[2]}.")