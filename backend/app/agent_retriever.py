from google.adk.agents.llm_agent import Agent
import pandas as pd
import requests

# Tool 1: Excel
def fetch_from_excel(file_path: str, sheet: str = "Sheet1"):
    df = pd.read_excel(file_path, sheet_name=sheet)
    return df.tail(12).to_json()

# Tool 2: SQL
from sqlalchemy import create_engine
def fetch_from_sql(query: str, db_url: str):
    engine = create_engine(db_url)
    df = pd.read_sql(query, engine)
    return df.tail(12).to_json()

# Tool 3: PowerBI (Simplified DAX call)
def fetch_from_powerbi(dataset_id: str, table: str):
    # Logic from previous step: Execute DAX EVALUATE
    return f"Raw data for {table} from PBI Dataset {dataset_id} (Last 12 rows)"

retriever_agent = Agent(
    name="data_retriever",
    model="gemini-1.5-flash",
    instruction="""You are a Data Integration Specialist. 
    Your goal is to fetch the most recent 12 data points from specified sources (SQL, Excel, PBI).
    Return only the raw data in JSON format.""",
    tools=[fetch_from_excel, fetch_from_sql, fetch_from_powerbi]
)

