from datetime import datetime
from langchain_core.tools import tool


@tool
def log_interaction(name: str, email: str, interaction_type: str, date: str, time: str,
                    attendees: str, topics: str, samples: str, sentiment: str,
                    outcomes: str, follow_up: str):
    """
    Log HCP interaction details into CRM system with full field capture.
    """
    return {
        "status": "success",
        "tool": "Log Interaction",
        "hcp_name": name,
        "email": email,
        "interaction_type": interaction_type,
        "date": date,
        "time": time,
        "attendees": attendees,
        "topics": topics,
        "samples": samples,
        "sentiment": sentiment,
        "outcomes": outcomes,
        "follow_up": follow_up,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


@tool
def edit_interaction(interaction_id: int, updated_notes: str):
    """
    Edit an existing HCP interaction record.
    """
    return {
        "status": "success",
        "tool": "Edit Interaction",
        "interaction_id": interaction_id,
        "updated_notes": updated_notes
    }


@tool
def fetch_hcp_profile(name: str):
    """
    Fetch HCP profile and past interaction history from CRM.
    """
    return {
        "status": "success",
        "tool": "Fetch HCP Profile",
        "hcp_name": name,
        "specialty": "Cardiologist",
        "hospital": "City General Hospital",
        "past_interactions": 5,
        "last_interaction": "2024-12-01",
        "preferred_contact": "Morning visits"
    }


@tool
def check_sample_inventory(sample_name: str):
    """
    Check if material or sample is available in inventory.
    """
    inventory = {
        "brochure": 150,
        "sample": 40,
        "product x": 25,
        "product y": 0
    }
    key = sample_name.lower()
    stock = next((v for k, v in inventory.items() if k in key), 10)
    return {
        "status": "success",
        "tool": "Sample Inventory Check",
        "sample": sample_name,
        "stock": stock,
        "available": stock > 0
    }


@tool
def create_followup_task(hcp_name: str, follow_up_notes: str, due_date: str = ""):
    """
    Create an automated follow-up task or reminder for the HCP.
    """
    return {
        "status": "success",
        "tool": "Follow-up Task Creator",
        "hcp_name": hcp_name,
        "task": follow_up_notes or "Schedule next meeting",
        "due_date": due_date or "Within 7 days",
        "reminder_set": True
    }
