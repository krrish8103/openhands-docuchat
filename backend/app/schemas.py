




from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class DocumentBase(BaseModel):
    title: str
    file_type: str

class DocumentCreate(DocumentBase):
    content: Optional[str] = None
    metadata: Optional[str] = None

class Document(DocumentBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    sender: str
    content: str

class MessageCreate(MessageBase):
    metadata: Optional[str] = None

class Message(MessageBase):
    id: int
    created_at: datetime
    metadata: Optional[str] = None

    class Config:
        orm_mode = True

class ConversationBase(BaseModel):
    title: Optional[str] = None

class ConversationCreate(ConversationBase):
    document_id: Optional[int] = None

class Conversation(ConversationBase):
    id: int
    user_id: int
    document_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    messages: List[Message] = []

    class Config:
        orm_mode = True



