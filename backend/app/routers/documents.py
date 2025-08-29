





from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..services.document_processing import process_document
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/documents",
    tags=["documents"]
)

@router.post("/", response_model=schemas.Document)
def create_document(
    title: str,
    file_type: str,
    content: str = None,
    metadata: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    document_create = schemas.DocumentCreate(
        title=title,
        file_type=file_type,
        content=content,
        metadata=metadata
    )
    return crud.create_document(db=db, document=document_create, user_id=current_user.id)

@router.post("/upload", response_model=schemas.Document)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    content = await file.read()
    processed_data = process_document(content, file.content_type, file.filename)

    document_create = schemas.DocumentCreate(
        title=file.filename,
        file_type=file.content_type,
        content=processed_data.get('content'),
        metadata=processed_data.get('metadata')
    )
    return crud.create_document(db=db, document=document_create, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Document])
def read_documents(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_documents_by_user(db, user_id=current_user.id)

@router.get("/{document_id}", response_model=schemas.Document)
def read_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    document = crud.get_document(db, document_id=document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return document





