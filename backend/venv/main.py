from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

from database import engine, Base
import models


# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))


# Create database tables
Base.metadata.create_all(bind=engine)


# Groq client setup
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


app = FastAPI()


# Allow React frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AI CRM Backend is Running 🚀"
    }


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(request: ChatRequest):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": request.message
            }
        ]
    )

    ai_reply = response.choices[0].message.content

    return {
        "response": ai_reply
    }