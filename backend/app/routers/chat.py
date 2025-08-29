





from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..services.ai_service import get_ai_response
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

@router.post("/conversations", response_model=schemas.Conversation)
def create_conversation(
    conversation: schemas.ConversationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_conversation(db=db, conversation=conversation, user_id=current_user.id)

@router.get("/conversations", response_model=List[schemas.Conversation])
def read_conversations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_conversations_by_user(db, user_id=current_user.id)

@router.get("/conversations/{conversation_id}", response_model=schemas.Conversation)
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    conversation = crud.get_conversation(db, conversation_id=conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conversation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return conversation

@router.post("/conversations/{conversation_id}/messages", response_model=schemas.Message)
def create_message(
    conversation_id: int,
    message: schemas.MessageCreate,
    model: str = "gpt-4o-mini",
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    conversation = crud.get_conversation(db, conversation_id=conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conversation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # If this is an AI response, get the response from the AI service
    if message.sender == "ai":
        ai_response = get_ai_response(message.content, model=model)
        message.content = ai_response
        # store selected model for traceability
        message.message_metadata = (message.message_metadata or "") + f"|model:{model}"

    return crud.create_message(db=db, message=message, conversation_id=conversation_id)





