from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from graph import graph
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class WorkflowRequest(BaseModel):
    name: str
    email: str
    interaction_type: str = "Meeting"
    date: str = ""
    time: str = ""
    attendees: str = ""
    topics: str = ""
    samples: str = ""
    sentiment: str = "Neutral"
    outcomes: str = ""
    follow_up: str = ""


@app.get("/")
def home():
    return {"message": "AI CRM Backend is Running 🚀"}


@app.post("/chat")
def chat(request: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": request.message}]
    )
    return {"response": response.choices[0].message.content}


@app.post("/extract-form")
def extract_form(request: ChatRequest):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a CRM data extractor. Extract fields from the user message. "
                    "Return ONLY valid JSON with these keys: "
                    "name, email, interaction_type, date, time, attendees, topics, samples, sentiment, outcomes, follow_up. "
                    "sentiment must be one of: Positive, Neutral, Negative. "
                    "interaction_type must be one of: Meeting, Call, Email, Conference. "
                    "date must be in YYYY-MM-DD format (e.g. 2025-07-10). "
                    "time must be in HH:MM 24-hour format (e.g. 15:00). "
                    "Use empty string for missing fields. No markdown, no explanation."
                )
            },
            {"role": "user", "content": request.message}
        ]
    )
    return {"data": response.choices[0].message.content}


@app.post("/ai-workflow")
def ai_workflow(request: WorkflowRequest):
    result = graph.invoke({
        "name": request.name,
        "email": request.email,
        "interaction_type": request.interaction_type,
        "date": request.date,
        "time": request.time,
        "attendees": request.attendees,
        "topics": request.topics,
        "samples": request.samples,
        "sentiment": request.sentiment,
        "outcomes": request.outcomes,
        "follow_up": request.follow_up,
        "interaction_id": 1,
        "result": {}
    })
    return {"result": result["result"]}
