from langgraph.graph import END, StateGraph

from workflows.agents.idea_validator import idea_validator_node
from workflows.state import StartupState
from workflows.agents.market_research import market_research_node
from workflows.agents.compititor_analysis import competitor_analysis_node
from workflows.agents.business_model import business_model_node

def create_workflow():
    """
    Creates and compiles the IDEON LangGraph workflow.
    """
    workflow = StateGraph(StartupState)

    # Add nodes
    workflow.add_node(
        "idea_validator", 
         idea_validator_node
         )
    
    workflow.add_node(
       "market_research",
       idea_validator_node,
   )
    workflow.add_node(
            "market_research",
            market_research_node,
        )
    workflow.add_node(
        "competitor_analysis",
        competitor_analysis_node,
    )
    workflow.add_node(
        "business_model",
        business_model_node,
    )
    workflow.set_entry_point("idea_validator")
#paralle execution..

    workflow.add_edge(
    "idea_validator",
    "market_research",
    )
    
    workflow.add_edge(
        "idea_validator",
        "competitor_analysis",
    )
    workflow.add_edge(
        "market_research",
        "business_model",
    )

    workflow.add_edge(
        "competitor_analysis",
        "business_model",
    )
    workflow.add_edge(
        "business_model",
        END,
    )
    return workflow.compile()


# This is the instance imported by analysis_service.py
startup_workflow = create_workflow()
