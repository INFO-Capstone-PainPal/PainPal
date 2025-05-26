import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go


df = pd.read_csv('mig_data_test.csv')


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

# Refactored for dynamic DataFrame input
def plot_monthly_migraines(df: pd.DataFrame) -> go.Figure:
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.to_period('M').astype(str)
    counts = df.groupby('month')['Migraine'].sum().reset_index()
    fig = px.bar(counts, x='month', y='Migraine', title='Monthly Migraines')
    return fig


def plot_trigger_heatmap(df: pd.DataFrame) -> go.Figure:
    trigger_cols = df.columns.difference(['Migraine', 'date', 'Total_sleep', 'Temperature', 'Pressure', 'Preventative_medication', 'Bedtime', 'Wake_time'])
    if trigger_cols.empty:
        return go.Figure()
    correlations = df[trigger_cols].corrwith(df['Migraine'])
    fig = px.imshow([correlations], 
                    labels=dict(x="Trigger", y="Correlation"), 
                    x=correlations.index,
                    y=["Migraine Correlation"],
                    title="Trigger Correlation Heatmap")
    return fig