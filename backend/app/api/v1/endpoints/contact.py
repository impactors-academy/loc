from fastapi import APIRouter

from app.schemas.contact import InquiryCreate, InquiryResponse
from app.services.contact import contact_service

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=InquiryResponse)
async def submit_inquiry(payload: InquiryCreate):
    return contact_service.handle_inquiry(payload)
