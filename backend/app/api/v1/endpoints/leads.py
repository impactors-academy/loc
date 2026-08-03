import csv
import io
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.deps import get_db, pagination, require_editor_key
from app.repositories.inquiry import inquiry_repo

router = APIRouter(prefix="/leads", tags=["leads"], dependencies=[Depends(require_editor_key)])


@router.get("/")
async def list_inquiries(
    source_type: str | None = None,
    source_id: str | None = None,
    db: Session = Depends(get_db),
    pages: dict = Depends(pagination),
):
    """LEAD-3: inquiry list (JSON). Use /leads/export.csv for CSV download."""
    if source_type:
        return inquiry_repo.get_by_source(db, source_type, source_id)
    return inquiry_repo.get_multi(db, pages["skip"], pages["limit"])


@router.get("/export.csv", response_class=StreamingResponse)
async def export_inquiries_csv(
    source_type: str | None = None,
    source_id: str | None = None,
    db: Session = Depends(get_db),
):
    """LEAD-3: StreamingResponse CSV export of all matching inquiries."""
    if source_type:
        rows = inquiry_repo.get_by_source(db, source_type, source_id)
    else:
        rows = inquiry_repo.get_multi(db, skip=0, limit=10_000)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "name", "email", "phone", "subject", "message", "source_type", "source_id", "created_at"])
    for row in rows:
        writer.writerow([
            row.id,
            row.name,
            row.email,
            row.phone or "",
            row.subject,
            row.message,
            row.source_type,
            row.source_id or "",
            row.created_at.isoformat() if row.created_at else "",
        ])

    output.seek(0)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    filename = f"loc-leads-{timestamp}.csv"

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
