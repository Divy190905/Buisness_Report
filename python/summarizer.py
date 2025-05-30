import pandas as pd
import numpy as np
from groq import Groq
import os

client = Groq(api_key="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")

def get_business_summary(file_path):
    df = pd.read_csv(file_path)

    # Extract columns
    column_names = df.columns.tolist()

    # Correlation matrix
    numeric_df = df.select_dtypes(include=[np.number])
    correlation_matrix = numeric_df.corr()
    strong_corrs = {}

    for col in correlation_matrix.columns:
        for idx in correlation_matrix.index:
            if col != idx and abs(correlation_matrix[col][idx]) > 0.7:
                strong_corrs[f"{col} ↔ {idx}"] = correlation_matrix[col][idx]

    # Prepare message for Groq
    column_str = ", ".join(column_names)
    corr_str = ", ".join([f"{pair} ({round(val,2)})" for pair, val in strong_corrs.items()])
    summary_prompt = (
    f"You are a business analyst. Given the dataset with columns: {column_str}, "
    f"and observed correlations: {corr_str if corr_str else 'No strong correlations'}, "
    f"write a business-oriented summary focusing on key performance drivers, trends, and relationships. "
    f"Additionally, suggest specific plots (e.g., scatter plots, heatmaps, line charts) that can be used to visually support and validate the insights. "
    f"The summary should be insightful, practical, and suitable for business decision-making. Do not include code."
    )


    print("\n🔍 Asking Groq to summarize based on columns and correlation...")

    try:
        completion = client.chat.completions.create(
            model="compound-beta",
            messages=[{"role": "user", "content": summary_prompt}],
            temperature=1,
            max_completion_tokens=1024,
            top_p=1,
            stream=True,
        )

        summary = ""
        for chunk in completion:
            summary += chunk.choices[0].delta.content or ""

        print("\n📊 Business Summary:\n")
        print(summary)

        return summary

    except Exception as e:
        print(f"❌ Error communicating with Groq API: {e}")
        return None
