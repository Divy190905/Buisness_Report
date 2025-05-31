import pandas as pd
import re
from groq import Groq
import os
from dotenv import load_dotenv

# Load API key from environment
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def clean_code_response(code: str):
    # Remove markdown code blocks and leading explanation lines
    code = re.sub(r"```[a-zA-Z]*", "", code).strip("`")
    lines = code.splitlines()
    cleaned_lines = [
        line for line in lines if not line.strip().lower().startswith("to ") 
        and not line.strip().lower().startswith("this ")
        and not line.strip().lower().startswith("🤖")
    ]
    return "\n".join(cleaned_lines).strip()


def chat_loop(file_path, visualizer_callback):
    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()

    

    print("\n📌 Enter your query to generate Python code (type 'done' to reset, 'exiit' to quit).")

    # Columns formatted as string
    columns = ", ".join(df.columns.tolist())

    base_prompt = (
        f"You are a Python data analyst. A DataFrame named `df` is already loaded with the following columns: {columns}.\n"
        f"- Use only Python libraries like pandas, seaborn, matplotlib, or plotly.\n"
        f"- Only return valid, executable Python code. Do not include explanations.\n"
        f"- Always reference columns as given.\n"
        f"- If needed, use inline comments only with `#`.\n"
        f"- Do NOT use markdown code blocks or any extra formatting."
    )

    chat_history = [{"role": "system", "content": base_prompt}]

    while True:
        user_input = input("\n🧑 Query: ")

        if user_input.strip().lower() == "exiit":
            print("👋 Exiting NLP processor.")
            break

        if user_input.strip().lower() == "done":
            print("🔄 Context reset. Start a new query.")
            chat_history = [{"role": "system", "content": base_prompt}]
            continue

        chat_history.append({"role": "user", "content": user_input})

        try:
            response = client.chat.completions.create(
                model="compound-beta",
                messages=chat_history,
                temperature=0.7,
                max_completion_tokens=1024,
                top_p=1,
                stream=False,
            )

            raw_code = response.choices[0].message.content
            code = clean_code_response(raw_code)

            print("\n🤖 Generated Python Code:\n")
            print(code)

            chat_history.append({"role": "assistant", "content": raw_code})

            # 🔥 Run the generated code using visualizer
            visualizer_callback(code, df)

            # 🪄 Prompt user for next step
            print("\n💬 You can now enter a follow-up query or type 'done' to reset context.")

        except Exception as e:
            print(f"❌ Error communicating with Groq API: {e}")