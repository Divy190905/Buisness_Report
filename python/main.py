from summarizer import get_business_summary
from generate_sample import generate_sample_data
from nlp_processor import chat_loop
from visualiser import run_code

file_path = "python/data/sample.csv"
generate_sample_data(file_path)
get_business_summary(file_path)
chat_loop(file_path, run_code)
