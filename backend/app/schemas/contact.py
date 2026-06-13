from pydantic import BaseModel, EmailStr


class InquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    message: str
    subject: str
    source_type: str = "general"
    source_id: str | None = None


class InquiryResponse(BaseModel):
    success: bool
    message: str = "Your inquiry has been received."
