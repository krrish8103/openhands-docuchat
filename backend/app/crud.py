





from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_document(db: Session, document_id: int):
    return db.query(models.Document).filter(models.Document.id == document_id).first()

def get_documents_by_user(db: Session, user_id: int):
    return db.query(models.Document).filter(models.Document.user_id == user_id).all()

def create_document(db: Session, document: schemas.DocumentCreate, user_id: int):
    db_document = models.Document(
        title=document.title,
        file_type=document.file_type,
        content=document.content,
        metadata=document.metadata,
        user_id=user_id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def get_conversation(db: Session, conversation_id: int):
    return db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()

def get_conversations_by_user(db: Session, user_id: int):
    return db.query(models.Conversation).filter(models.Conversation.user_id == user_id).all()

def create_conversation(db: Session, conversation: schemas.ConversationCreate, user_id: int):
    db_conversation = models.Conversation(
        title=conversation.title,
        document_id=conversation.document_id,
        user_id=user_id
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def create_message(db: Session, message: schemas.MessageCreate, conversation_id: int):
    db_message = models.Message(
        sender=message.sender,
        content=message.content,
        metadata=message.metadata,
        conversation_id=conversation_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message




