"""Contact submission route — validates JSON, enqueue SMTP via FastAPI BackgroundTasks."""

from __future__ import annotations

import logging

from fastapi import APIRouter, BackgroundTasks

from schemas.contact import ContactSubmission
from services.email_service import send_contact_notification

logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact"])


def _background_send(payload: ContactSubmission) -> None:
    """
    Isolate exceptions from FastAPI BackgroundTasks so failures are logged
    (queued tasks swallow errors otherwise).
    """
    try:
        send_contact_notification(payload)
        logger.info("Background email dispatched for <%s>", payload.email)
    except Exception:
        logger.exception("Background SMTP task failed")


@router.post("/contact", summary="Receive contact-form submission (email dispatched async).")
async def submit_contact(
    payload: ContactSubmission,
    bg: BackgroundTasks,
) -> dict[str, bool | str]:
    """Queue SMTP delivery via ``BackgroundTasks`` and return immediately."""

    # Honeypot: bots should see the same UX as legit users — no SMTP (mirrors legacy Next handler).
    if payload.website and payload.website.strip():
        logger.info("[contact] honeypot filled; rejecting silently without email")
        return {"ok": True}

    bg.add_task(_background_send, payload)

    return {"ok": True, "detail": "Message sent successfully"}
