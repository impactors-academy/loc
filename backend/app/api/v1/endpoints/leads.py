from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination
from app.repositories.inquiry import inquiry_repo

router = APIRouter(prefix="/leads", tags=["leads"])


@router.get("/")
async def list_inquiries(
    source_type: str | None = None,
    source_id: str | None = None,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    """LEAD-3: simple inquiry export for the LOC team."""
    if source_type:
        return inquiry_repo.get_by_source(db, source_type, source_id)
    return inquiry_repo.get_multi(db, pages["skip"], pages["limit"])
