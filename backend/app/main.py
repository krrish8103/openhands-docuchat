


import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .database import Base, engine

# Load environment variables
load_dotenv()

app = FastAPI()

# Ensure models are imported before creating tables
from . import models  # noqa: F401
# Create all tables on startup (for SQLite demo)
Base.metadata.create_all(bind=engine)

# CORS setup
origins = [
    "http://localhost:52385",
    "http://localhost:56480",
    "http://localhost",
    "http://0.0.0.0"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to DocuChatPro API"}

# Include routers here
from .routers import documents, chat, users
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(users.router)


