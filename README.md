# AI CRM HCP Module

## About the Project

This project is an AI-powered CRM module developed for Healthcare Professionals (HCPs). The main idea of this project is to make interaction logging easier by using AI. Instead of filling every field manually, users can simply describe their interaction in the AI chat. The AI understands the message, extracts the important details, and fills the interaction form automatically.

After reviewing the details, the user can submit the form, and the backend processes the data using a LangGraph workflow.

## Technologies Used

### Frontend
- React
- Redux Toolkit
- Vite
- CSS

### Backend
- Python
- FastAPI
- LangGraph
- Groq API
- SQLAlchemy
- SQLite

## Project Structure

ai-crm-hcp/
│
├── backend/
│ ├── main.py
│ ├── graph.py
│ ├── tools.py
│ ├── models.py
│ ├── database.py
│ ├── requirements.txt
│ └── .env
│
└── frontend/
├── src/
│ ├── components/
│ ├── slices/
│ ├── store/
│ ├── App.jsx
│ ├── App.css
│ └── main.jsx

## Features

- AI Chat Assistant
- Automatic form filling from chat
- Redux state management
- FastAPI backend
- LangGraph workflow
- SQLite database
- Interaction logging
- Entity extraction
- Interaction summary
- Next action recommendation
- Edit interaction

## LangGraph Workflow

The workflow follows these steps:

1. Extract Entities
2. Summarize Interaction
3. Log Interaction
4. Recommend Next Action
5. Edit Interaction

## How to Run the Project

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run at:

http://127.0.0.1:8000

Swagger Documentation:

http://127.0.0.1:8000/docs
Frontend
cd frontend
npm install
npm run dev

Frontend will run at:

http://localhost:5173
Environment Variables

Create a .env file inside the backend folder.

GROQ_API_KEY=your_groq_api_key
How the Project Works

First, the user opens the application and enters the interaction details through the AI chat. The chat message is sent to the backend, where the AI generates a response and extracts important information such as the HCP name, email, and interaction notes. These extracted details are automatically filled into the interaction form using Redux.

After checking the details, the user submits the form. The backend then runs a LangGraph workflow, which extracts entities, summarizes the interaction, logs the interaction, recommends the next action, and updates the interaction details. Finally, the processed results are displayed to the user.
