from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.orm import Session

from app.core.deps import get_db
from app.core.rate_limit import limiter
from app.schemas.contact import InquiryCreate, InquiryResponse
from app.services.contact import contact_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=InquiryResponse)
@limiter.limit("5/minute")
async def submit_inquiry(
    request: Request,
    payload: InquiryCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    return contact_service.handle_inquiry(db, payload, background_tasks)
