import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go


df = pd.read_csv('mig_data_test.csv')

# Monthly Migraine Count Visualization
def plot_monthly_migraines(df):
    df['date'] = pd.to_datetime(df['date'])

    df['month'] = df['date'].dt.to_period('M').astype(str)

    monthly_migraine_counts = df[df['Migraine'] == 1]['month'].value_counts().sort_index()

    month_names = pd.to_datetime(monthly_migraine_counts.index).strftime('%b')

    fig = go.Figure(data=[
        go.Bar(
            x=month_names,
            y=monthly_migraine_counts.values,
            marker_color="#665EA5"
        )
    ])

    fig.update_layout(
        title="Number of Migraines per Month",
        xaxis_title="Month",
        yaxis_title="Number of Migraines"
    )

    fig.show()

# Top 10 Triggers Visualization
def top_10_triggers(df):
    binary_trigger_cols = [
        col for col in df.columns
        if df[col].dropna().isin([0, 1]).all()
        and col not in ['Migraine']  # Exclude target column
    ]

    # Sum counts of 1s and get top 10 triggers
    trigger_counts = df[binary_trigger_cols].sum().sort_values(ascending=False)
    top10 = trigger_counts.head(10)
    formatted_names = [name.replace('_', ' ').title() for name in top10.index]

    fig = go.Figure(data=[
        go.Bar(
            x=formatted_names,
            y=top10.values,
            marker_color="#665EA5"
        )
    ])

    fig.update_layout(
        title="Top 10 Migraine Triggers by Count",
        xaxis_title="Trigger",
        yaxis_title="Count",
        xaxis_tickangle=45
    )

    fig.show()
