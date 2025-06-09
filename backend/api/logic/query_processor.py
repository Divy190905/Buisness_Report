# api/logic/query_processor.py

import os
import pandas as pd
import re
from groq import Groq
from dotenv import load_dotenv
from .visualiser import run_code_and_save


load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

print("Loaded API Key:", os.getenv("GROQ_API_KEY"))

# Global chat history per file path
chat_sessions = {}

def clean_code_response(code: str):
    code = re.sub(r"```[a-zA-Z]*", "", code).strip("`")
    lines = code.splitlines()
    cleaned_lines = [
        line for line in lines if not line.strip().lower().startswith(("to ", "this ", "🤖"))
    ]
    return "\n".join(cleaned_lines).strip()


def process_query(file_path, query):
    if file_path not in chat_sessions:
        chat_sessions[file_path] = []

    if query.strip().lower() == "done":
        chat_sessions[file_path] = []
        return "Conversation context has been reset."

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()
    columns = ", ".join(df.columns.tolist())

    base_prompt = (
        f"You are a Python data analyst. A DataFrame named `df` is already loaded with the following columns: {columns}.\n"
        f"- Use only Python libraries like pandas, seaborn, matplotlib, or plotly.\n"
        f"- Only return valid, executable Python code. Do not include explanations.\n"
        f"- Always reference columns as given.\n"
        f"- If needed, use inline comments only with `#`.\n"
        f"- Do NOT use markdown code blocks or any extra formatting."
    )

    history = [{"role": "system", "content": base_prompt}] + chat_sessions[file_path]
    history.append({"role": "user", "content": query})

    try:
        response = client.chat.completions.create(
            model="compound-beta",
            messages=history,
            temperature=0.7,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
        )

        raw_code = response.choices[0].message.content
        code = clean_code_response(raw_code)

        image_url = run_code_and_save(code, df)

        # Add assistant response to history
        chat_sessions[file_path].append({"role": "user", "content": query})
        chat_sessions[file_path].append({"role": "assistant", "content": code})

        return {"code": code, "image": image_url}

    except Exception as e:
        raise RuntimeError(f"Query processing failed: {e}")

def get_query_answer(question: str, file_path: str) -> str:
    if file_path not in chat_sessions:
        chat_sessions[file_path] = []

    if question.strip().lower() == "done":
        chat_sessions[file_path] = []
        return "Conversation context has been reset."

    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()
    columns = ", ".join(df.columns.tolist())

    base_prompt = (
        f"You are a helpful data analyst. A pandas DataFrame `df` is already loaded with the following columns: {columns}.\n"
        f"Use the DataFrame to answer the user's question.\n"
        f"If the answer requires statistics or analysis, explain them clearly in natural language.\n"
        f"Do not generate code unless specifically asked."
    )

    history = [{"role": "system", "content": base_prompt}] + chat_sessions[file_path]
    history.append({"role": "user", "content": question})

    try:
        response = client.chat.completions.create(
            model="compound-beta",
            messages=history,
            temperature=0.5,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
        )

        content = response.choices[0].message.content.strip()

        # Add assistant response to history
        chat_sessions[file_path].append({"role": "user", "content": question})
        chat_sessions[file_path].append({"role": "assistant", "content": content})

        return content

    except Exception as e:
        raise RuntimeError(f"Answer generation failed: {e}")
