from langgraph.graph import StateGraph, START, END
from typing import TypedDict

from tools import (
    log_interaction,
    edit_interaction,
    summarize_interaction,
    recommend_next_action,
    extract_entities,
)


class GraphState(TypedDict):
    name: str
    email: str
    notes: str
    result: dict


def extract_node(state: GraphState):
    result = extract_entities(state["notes"])

    state["result"] = {
        "entities": result
    }

    return state


def summarize_node(state: GraphState):
    result = summarize_interaction(state["notes"])

    state["result"]["summary"] = result

    return state


def log_node(state: GraphState):
    result = log_interaction(
        state["name"],
        state["email"],
        state["notes"]
    )

    state["result"]["log"] = result

    return state


def recommend_node(state: GraphState):
    result = recommend_next_action()

    state["result"]["recommendation"] = result

    return state


def edit_node(state: GraphState):
    result = edit_interaction(
        1,
        state["notes"]
    )

    state["result"]["edit"] = result

    return state


def build_graph():

    workflow = StateGraph(GraphState)

    workflow.add_node(
        "extract_entities",
        extract_node
    )

    workflow.add_node(
        "summarize",
        summarize_node
    )

    workflow.add_node(
        "log_interaction",
        log_node
    )

    workflow.add_node(
        "recommend_action",
        recommend_node
    )

    workflow.add_node(
        "edit_interaction",
        edit_node
    )


    workflow.add_edge(
        START,
        "extract_entities"
    )

    workflow.add_edge(
        "extract_entities",
        "summarize"
    )

    workflow.add_edge(
        "summarize",
        "log_interaction"
    )

    workflow.add_edge(
        "log_interaction",
        "recommend_action"
    )

    workflow.add_edge(
        "recommend_action",
        "edit_interaction"
    )

    workflow.add_edge(
        "edit_interaction",
        END
    )


    return workflow.compile()


graph = build_graph()