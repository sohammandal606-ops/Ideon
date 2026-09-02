import asyncio
import sys
import os

# Ensure the backend directory is in the path for absolute imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from workflows.workflow import startup_workflow
from workflows.state import StartupState

async def run_workflow_test():
    print("\n🚀 Starting IDEON AI Startup Builder Test...\n")
    
    # Initialize with a dummy startup idea
    initial_state: StartupState = {
        "startup_name": "EcoBite",
        "description": "A mobile app that connects users with local restaurants to buy surplus food at a discount before it gets thrown away.",
        "industry": "FoodTech & Sustainability",
        "target_market": "College students and budget-conscious millennials in urban areas.",
        "additional_info": "We want to take a 10% commission on every order.",
        # Initialize empty state fields
        "idea_validation": None,
        "market_research": None,
        "competitor_analysis": None,
        "business_model": None,
        "financial_analysis": None,
        "mvp_plan": None,
        "gtm_strategy": None,
        "final_verdict": None,
        "current_agent": "Initialization",
        "progress_percentage": 0,
    }

    try:
        # Stream the graph execution
        async for output in startup_workflow.astream(initial_state):
            for node_name, state_update in output.items():
                print(f"✅ Agent Completed: [{node_name.upper()}]")
                print(f"   Progress: {state_update.get('progress_percentage')}% | Status: {state_update.get('current_agent')}")
                
                # If it's the final verdict, let's print the decision!
                if node_name == "final_verdict":
                    verdict = state_update.get("final_verdict", {})
                    print("\n==================================================")
                    print("📊 FINAL VERDICT SUMMARY:")
                    print(f"   Viability Score: {verdict.get('overall_score')}/100")
                    print(f"   Decision: {'GO 🚀' if verdict.get('go_no_go_decision') else 'NO-GO 🛑'}")
                    print(f"   Summary: {verdict.get('executive_summary')}")
                    print("==================================================\n")
                else:
                    print("   Data Extracted Successfully.\n")

    except Exception as e:
        print(f"\n❌ Workflow Failed: {e}")

if __name__ == "__main__":
    # Fix for Windows asyncio loop policy if needed
    if sys.platform.startswith('win'):
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    asyncio.run(run_workflow_test())
