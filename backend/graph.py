from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Any

from tools import (
    log_interaction,
    edit_interaction,
    fetch_hcp_profile,
    check_sample_inventory,
    create_followup_task,
)


class GraphState(TypedDict):
    name: str
    email: str
    interaction_type: str
    date: str
    time: str
    attendees: str
    topics: str
    samples: str
    sentiment: str
    outcomes: str
    follow_up: str
    interaction_id: int
    result: dict[str, Any]


def fetch_profile_node(state: GraphState):
    profile = fetch_hcp_profile.invoke({"name": state["name"]})
    state["result"] = {"profile": profile}
    return state


def log_node(state: GraphState):
    log = log_interaction.invoke({
        "name": state["name"],
        "email": state["email"],
        "interaction_type": state.get("interaction_type", "Meeting"),
        "date": state.get("date", ""),
        "time": state.get("time", ""),
        "attendees": state.get("attendees", ""),
        "topics": state.get("topics", ""),
        "samples": state.get("samples", ""),
        "sentiment": state.get("sentiment", "Neutral"),
        "outcomes": state.get("outcomes", ""),
        "follow_up": state.get("follow_up", "")
    })
    state["result"]["log"] = log
    return state


def inventory_node(state: GraphState):
    sample_name = state.get("samples", "brochure")
    inventory = check_sample_inventory.invoke({"sample_name": sample_name or "brochure"})
    state["result"]["inventory"] = inventory
    return state


def followup_node(state: GraphState):
    task = create_followup_task.invoke({
        "hcp_name": state["name"],
        "follow_up_notes": state.get("follow_up", ""),
        "due_date": ""
    })
    state["result"]["followup_task"] = task
    return state


def edit_node(state: GraphState):
    edit = edit_interaction.invoke({
        "interaction_id": state.get("interaction_id", 1),
        "updated_notes": state.get("outcomes", "")
    })
    state["result"]["edit"] = edit
    return state


def build_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("fetch_profile", fetch_profile_node)
    workflow.add_node("log_interaction", log_node)
    workflow.add_node("check_inventory", inventory_node)
    workflow.add_node("create_followup", followup_node)
    workflow.add_node("edit_interaction", edit_node)

    workflow.add_edge(START, "fetch_profile")
    workflow.add_edge("fetch_profile", "log_interaction")
    workflow.add_edge("log_interaction", "check_inventory")
    workflow.add_edge("check_inventory", "create_followup")
    workflow.add_edge("create_followup", "edit_interaction")
    workflow.add_edge("edit_interaction", END)

    return workflow.compile()


graph = build_graph()
