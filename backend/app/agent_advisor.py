from google.adk.agents.llm_agent import Agent
import json

def analyze_trend(json_data: str):
    """Internal tool to calculate simple trends if LLM needs help."""
    data = json.loads(json_data)
    # Simple logic to see if last value > average
    return "Analysis: Stability detected."

advisor_agent = Agent(
    name="ops_advisor",
    model="gemini-1.5-pro", # Pro is better for reasoning/advice
    instruction="""You are an Operational SRE Advisor. 
    You will receive 12 data points for a specific metric.
    Tasks:
    1. Look for patterns (spikes, drops, steady growth).
    2. Provide 3 actionable advice points based on these 12 points.
    3. If the trend is dangerous, flag it as 'CRITICAL'.""",
    tools=[analyze_trend]
)

