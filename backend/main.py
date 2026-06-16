from fastapi import FastAPI
from app.agent_retriever import retriever_agent
from app.agent_advisor import advisor_agent

app = FastAPI()

@app.get("/analyze-metric")
async def get_ops_advice(metric_name: str, source_info: str):
    # 1. Ask retriever to get the data
    raw_data = retriever_agent.run(f"Fetch the last 12 points for {metric_name} from {source_info}")
    
    # 2. Pass that data to the advisor
    advice = advisor_agent.run(f"Here is the data for {metric_name}: {raw_data}. Provide operational advice.")
    
    return {
        "metric": metric_name,
        "raw_data_summary": raw_data[:100], # Snippet
        "operational_advice": advice
    }

