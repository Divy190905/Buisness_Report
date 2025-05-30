import matplotlib.pyplot as plt
import seaborn as sns
import plotly.io as pio
import plotly.graph_objects as go
import plotly.express as px
import io
import contextlib
import re

def run_code(code: str, df):
    # Remove any attempt to re-read the CSV (e.g., pd.read_csv(...))
    code = re.sub(r"pd\.read_csv\([^)]+\)", "", code)

    # Prepare exec environment
    exec_env = {
        'df': df,
        'pd': __import__('pandas'),
        'plt': plt,
        'sns': sns,
        'px': px,
        'go': go,
        'pio': pio,
    }

    try:
        # Suppress stdout to keep clean UI
        with contextlib.redirect_stdout(io.StringIO()):
            exec(code, exec_env)

        # Display matplotlib plots
        if plt.get_fignums():
            plt.show()
            plt.close("all")

        # Optional: You can also add code here to automatically open plotly visuals if needed

    except Exception as e:
        print(f"❌ Error while executing visualization code:\n{e}")
