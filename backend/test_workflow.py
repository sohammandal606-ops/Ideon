import asyncio
from workflows.workflow import startup_workflow

async def main():
    initial_state = {
        "startup_id": "test-123",
        "startup_name": "EcoBite",
        "description": "A mobile app that connects users with local restaurants to buy surplus food at a discount before it gets thrown away at the end of the day.",
        "industry": "FoodTech & Sustainability",
        "target_market": "College students and budget-conscious millennials in urban areas.",
        "additional_info": "We want to take a 10% commission on every order.",
        "idea_validation": None,
        "market_research": None,
        "competitor_analysis": None,
        "business_model": None,
        "financial_analysis": None,
        "mvp_plan": None,
        "gtm_strategy": None,
        "final_verdict": None,
        "current_agent": None,
        "progress_percentage": 0,
    }

    print("\nStarting LangGraph AI Workflow...")
    
    try:
        async for output in startup_workflow.astream(initial_state):
            for node_name, state_update in output.items():
                print(f"Agent Completed: {node_name} | Overall Progress: {state_update.get('progress_percentage')}%\n")
                if node_name == "final_verdict":
                    print("\nFINAL VERDICT SUMMARY:")
                    print(state_update["final_verdict"]["executive_summary"])
                    print("\nSCORE:", state_update["final_verdict"]["overall_score"])
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(main())
