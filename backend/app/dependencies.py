from fastapi import Depends
from sqlalchemy.orm import Session
from .database import get_db
from . import models


def get_current_user(db: Session = Depends(get_db)) -> models.User:
    # Very simple placeholder auth: use or create a default demo user
    user = db.query(models.User).first()
    if not user:
        user = models.User(username="demo", email="demo@example.com", hashed_password="demo")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
