import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.io as pio
import plotly.graph_objects as go
import plotly.express as px
import io
import contextlib
import re
import uuid
import os
from django.conf import settings

def run_code_and_save(code: str, df) -> str:
    # Remove attempts to re-read the CSV
    code = re.sub(r"pd\.read_csv\([^)]+\)", "", code)

    # Prepare execution environment
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
        # Suppress stdout
        with contextlib.redirect_stdout(io.StringIO()):
            exec(code, exec_env)

        # Save matplotlib figure if exists
        if plt.get_fignums():
            fig_id = uuid.uuid4().hex
            filename = f"{fig_id}.png"
            path = os.path.join(settings.MEDIA_ROOT, filename)
            plt.savefig(path, bbox_inches='tight')
            plt.close("all")
            return os.path.join(settings.MEDIA_URL, filename)

        # Add plotly export logic if needed

    except Exception as e:
        print(f"❌ Error while executing visualization code:\n{e}")

    return None
