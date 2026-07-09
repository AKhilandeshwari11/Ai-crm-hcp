from datetime import datetime


def log_interaction(name, email, notes):
    return {
        "status": "success",
        "tool": "Log Interaction",
        "customer_name": name,
        "email": email,
        "notes": notes,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


def edit_interaction(interaction_id, updated_notes):
    return {
        "status": "success",
        "tool": "Edit Interaction",
        "interaction_id": interaction_id,
        "updated_notes": updated_notes
    }


def summarize_interaction(notes):
    return {
        "tool": "Summarize Interaction",
        "summary": notes[:100]
    }


def recommend_next_action():
    return {
        "tool": "Recommend Next Action",
        "recommendation": "Schedule a follow-up meeting with the HCP."
    }


def extract_entities(notes):
    return {
        "tool": "Extract Entities",
        "entities": [
            "Doctor",
            "Medicine",
            "Hospital"
        ]
    }