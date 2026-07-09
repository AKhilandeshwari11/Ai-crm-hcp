from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from graph import graph


# Load .env file
load_dotenv()


print(os.getenv("GROQ_API_KEY"))


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI app
app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# -------------------------
# Request Models
# -------------------------

class ChatRequest(BaseModel):
    message: str


class HCPRequest(BaseModel):
    name: str
    email: str
    specialty: str | None = None
    hospital: str | None = None
    location: str | None = None
    notes: str | None = None


class WorkflowRequest(BaseModel):
    name: str
    email: str
    notes: str


# -------------------------
# Home Route
# -------------------------

@app.get("/")
def home():
    return {
        "message": "AI CRM Backend is Running 🚀"
    }


# -------------------------
# Chat Route (Groq AI)
# -------------------------

@app.post("/chat")
def chat(request: ChatRequest):

    try:
        print("Using Groq API")

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": request.message
                }
            ]
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# -------------------------
# Save HCP Data
# -------------------------

@app.post("/hcp")
def create_hcp(data: HCPRequest):

    db: Session = SessionLocal()

    try:

        hcp = models.HCP(
            name=data.name,
            email=data.email,
            specialty=data.specialty,
            hospital=data.hospital,
            location=data.location,
            notes=data.notes
        )

        db.add(hcp)
        db.commit()
        db.refresh(hcp)

        return {
            "message": "HCP saved successfully",
            "id": hcp.id
        }

    except Exception as e:

        db.rollback()

        return {
            "error": str(e)
        }

    finally:
        db.close()


# -------------------------
# LangGraph AI Workflow
# -------------------------

@app.post("/ai-workflow")
def run_workflow(data: WorkflowRequest):

    try:

        result = graph.invoke(
            {
                "name": data.name,
                "email": data.email,
                "notes": data.notes
            }
        )

        return result

    except Exception as e:

        return {
            "error": str(e)
        }