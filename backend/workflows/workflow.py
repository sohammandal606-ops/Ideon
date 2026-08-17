from langgraph.graph import END, StateGraph

from workflows.agents.idea_validator import idea_validator_node
from workflows.state import StartupState


def create_workflow():
    """
    Creates and compiles the IDEON LangGraph workflow.
    """
    workflow = StateGraph(StartupState)

    # Add nodes
    workflow.add_node("idea_validator", idea_validator_node)

    # Add edges
    workflow.set_entry_point("idea_validator")

    # For now, end after idea validation since we are moving step-by-step
    workflow.add_edge("idea_validator", END)

    return workflow.compile()


# This is the instance imported by analysis_service.py
startup_workflow = create_workflow()
