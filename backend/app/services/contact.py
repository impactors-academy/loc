from app.schemas.contact import InquiryCreate, InquiryResponse


class ContactService:
    def handle_inquiry(self, payload: InquiryCreate) -> InquiryResponse:
        # TODO: send email notification to LOC team (e.g. via SendGrid or SMTP)
        return InquiryResponse(success=True)


contact_service = ContactService()
