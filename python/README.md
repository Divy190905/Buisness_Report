# Business Report Data Analysis Tool

A prototype tool that allows users to analyze Excel and CSV files using natural language questions.

## Features

- Upload Excel or CSV files
- Get automatic data summaries
- Ask questions in natural language (e.g., "Show me product-wise sales in Q1")
- Generate Python code for the requested analysis
- Visualize results as tables or charts

## Setup

1. Clone this repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. The Groq API key is already configured in the application.
4. Generate sample data (optional):
   ```
   python generate_sample_data.py
   ```

## Usage

Run the main script to start the application:

```
python main.py
```

Follow the prompts to:
1. Load your data file (you can use the generated sample_sales_data.csv)
2. View the automatic summary
3. Ask questions about your data
4. View and execute the generated code

## Sample Data

The repository includes a script to generate sample business data with:
- Sales information across different products and regions
- Time-based data including year, month, and quarter
- Performance metrics like revenue, cost, profit, and margin
- Customer segments and sales channels

## Example Questions

- "Show me product-wise sales in Q1"
- "What was the total revenue by region in 2022?"
- "Create a bar chart of monthly expenses"
- "Compare sales performance across quarters" 
- "Which product had the highest growth from 2021 to 2022?"
- "Show me the top 5 customers by order value"
- "What's the average profit margin by product category?"
- "Display quarterly trends in profit margin as a line chart"

## File Structure

- `main.py`: Entry point for the application
- `file_handler.py`: Handles file loading and validation
- `data_analyzer.py`: Generates data summaries
- `nlp_processor.py`: Processes natural language questions
- `code_generator.py`: Generates Python code for analysis
- `visualizer.py`: Creates visualizations and executes code
- `generate_sample_data.py`: Script to generate sample business data
- `requirements.txt`: Required dependencies

## Requirements

- Python 3.7+
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Groq
- OpenPyXL
- python-dotenv

## Future Improvements

- Implement more sophisticated NLP for better question understanding
- Add support for more file formats and data sources
- Improve code generation capabilities
- Build a web-based interface
