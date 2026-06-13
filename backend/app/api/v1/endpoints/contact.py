from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.schemas.contact import InquiryCreate, InquiryResponse
from app.services.contact import contact_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=InquiryResponse)
async def submit_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    return contact_service.handle_inquiry(db, payload)
