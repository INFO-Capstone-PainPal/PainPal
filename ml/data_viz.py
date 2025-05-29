import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go


# df = pd.read_csv('mig_data_test.csv')


def plot_monthly_migraines(df):
    df['date'] = pd.to_datetime(df['date'])

    df['month'] = df['date'].dt.to_period('M').astype(str)

    monthly_migraine_counts = df[df['Migraine'] == 1]['month'].value_counts().sort_index()

    month_names = pd.to_datetime(monthly_migraine_counts.index).strftime('%b')

    fig = go.Figure(data=[
        go.Bar(
            x=month_names,
            y=monthly_migraine_counts.values,
            marker_color="#675FA6"
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
    counts['month'] = pd.to_datetime(counts['month'])
    counts['label'] = counts['month'].dt.strftime('%b %Y')

    fig = px.bar(counts, x='label', y='Migraine', title='Monthly Migraines')

    fig.update_layout(
        font=dict(size=16, color="white"),
        plot_bgcolor="#4D4471",
        paper_bgcolor="#4D4471",
        xaxis_title='Month',
        yaxis_title='Number of Migraines'
    )

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
    
    fig.update_layout(
        font=dict(size=16, color="white"),
        xaxis_tickangle=45,
        plot_bgcolor="#4D4471",
        paper_bgcolor="#4D4471"
    )

    return fig

# Top 10 Triggers Visualization (slightly edited for backend)
def top_10_triggers(df):
    binary_trigger_cols = [
        col for col in df.columns
        if df[col].dropna().isin([0, 1]).all() and col != 'Migraine'
    ]

    trigger_counts = df[binary_trigger_cols].sum().sort_values(ascending=False)
    top10 = trigger_counts.head(10)
    formatted_names = [name.replace('_', ' ').title() for name in top10.index]

    fig = go.Figure(data=[
        go.Bar(
            x=formatted_names,
            y=top10.values,
            marker_color="#675FA6"
        )
    ])

    fig.update_layout(
        title="Top 10 Migraine Triggers by Count",
        xaxis_title="Trigger",
        yaxis_title="Count",
        xaxis_tickangle=45,
        font=dict(size=16, color="white"),
        plot_bgcolor="#4D4471",
        paper_bgcolor="#4D4471"
    )

    return fig