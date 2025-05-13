import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import plotly.express as px
import plotly.graph_objects as go


df = pd.read_csv('mig_data_test.csv')


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