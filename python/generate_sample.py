import pandas as pd
import numpy as np
import os

def generate_sample_data(filename="data/sample.csv"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)  # ✅ Create 'data/' folder if it doesn't exist
    
    np.random.seed(42)
    size = 100

    df = pd.DataFrame({
        "Product": np.random.choice(["A", "B", "C"], size=size),
        "Region": np.random.choice(["North", "South", "East", "West"], size=size),
        "Quarter": np.random.choice(["Q1", "Q2", "Q3", "Q4"], size=size),
        "Marketing Spend": np.random.randint(5000, 20000, size=size),
        "Sales": np.random.randint(20000, 50000, size=size),
        "Customer Retention Rate": np.random.uniform(0.5, 1.0, size=size),
        "Churn Rate": np.random.uniform(0.0, 0.5, size=size)
    })

    df["Revenue"] = df["Sales"] + (df["Marketing Spend"] * 0.1)
    df.to_csv(filename, index=False)
    print(f"✅ Sample data saved to {filename}")
