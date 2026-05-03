"""Contact submission route — validates JSON, sends email via SMTP (failures return HTTP errors)."""

from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, HTTPException

from schemas.contact import ContactSubmission
from services.email_service import send_contact_notification

logger = logging.getLogger(__name__)

router = APIRouter(tags=["contact"])
logger.info("Contact router loaded (POST /contact → SMTP only; honeypot removed).")


@router.post("/contact", summary="Receive contact-form submission and send email.")
async def submit_contact(payload: ContactSubmission) -> dict[str, bool | str]:
    """
    Send mail in a worker thread so the event loop stays responsive, but only return
    success after SMTP accepts — so the UI is not falsely green when mail fails.
    """

    try:
        await asyncio.to_thread(send_contact_notification, payload)
    except Exception:
        logger.exception("Contact SMTP delivery failed")
        raise HTTPException(
            status_code=503,
            detail=(
                "We could not deliver your message. Please try again shortly or "
                "email support directly."
            ),
        ) from None

    logger.info("Contact email dispatched for <%s>", payload.email)
    return {"ok": True, "detail": "Message sent successfully"}
