"""
SMTP email delivery for Hostinger mail (supports STARTTLS on port 587).

Credentials and host are supplied via environment variables (see `.env.example`).
"""

from __future__ import annotations

import logging
import os
import smtplib
import ssl
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from schemas.contact import ContactSubmission
from services.contact_email_html import render_contact_notification_html

logger = logging.getLogger(__name__)

# Reasonable timeouts so misconfigured SMTP doesn't hang forever.
SMTP_TIMEOUT_SEC = float(os.getenv("SMTP_TIMEOUT_SECONDS", "20"))


def _build_plain_body(data: ContactSubmission) -> str:
    """Render submission as plain text body for inbox operators."""
    lines = [
        f"Name: {data.name}",
        f"Email: {data.email!s}",
    ]
    if data.company:
        lines.append(f"Company: {data.company}")
    if data.phone:
        lines.append(f"Phone: {data.phone}")
    if data.service:
        lines.append(f"Service interest: {data.service}")
    if data.budget:
        lines.append(f"Budget: {data.budget}")
    lines.extend(["", "Message:", data.message])
    return "\n".join(lines)


def send_contact_notification(data: ContactSubmission) -> None:
    """
    Send the contact submission to ``EMAIL_USER`` with ``Reply-To`` set to the visitor.

    Raises on SMTP / network failure so callers can log (including background hooks).
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    email_user = os.getenv("EMAIL_USER")
    email_pass = os.getenv("EMAIL_PASS")

    missing = [
        key
        for key, val in (
            ("SMTP_HOST", smtp_host),
            ("EMAIL_USER", email_user),
            ("EMAIL_PASS", email_pass),
        )
        if not val
    ]
    if missing:
        raise RuntimeError(f"Missing required env vars: {', '.join(missing)}")

    recipient = email_user
    reply_to_addr = str(data.email)

    plain = _build_plain_body(data)
    html_body = render_contact_notification_html(data)

    mime = MIMEMultipart("alternative")
    mime["Subject"] = "New inquiry — Qubix Solutions"
    mime["From"] = email_user

    mime["To"] = recipient

    mime["Reply-To"] = reply_to_addr
    mime.attach(MIMEText(plain, "plain", "utf-8"))
    mime.attach(MIMEText(html_body, "html", "utf-8"))

    envelope = mime.as_string()
    logger.info("Sending SMTP message from %s subject=%s", email_user, mime["Subject"])

    try:
        with smtplib.SMTP(
            smtp_host,
            smtp_port,
            timeout=SMTP_TIMEOUT_SEC,
        ) as smtp:
            smtp.ehlo()
            if smtp.has_extn("STARTTLS"):
                tls_ctx = ssl.create_default_context()
                smtp.starttls(context=tls_ctx)
                smtp.ehlo()

            assert email_pass is not None

            password = "".join(email_pass.splitlines())

            assert email_user is not None

            smtp.login(email_user, password)

            refused = smtp.sendmail(email_user, [recipient], envelope)
            if refused:
                raise RuntimeError(f"SMTP recipients refused by server: {refused}")

    except smtplib.SMTPAuthenticationError as exc:
        logger.error(
            "SMTP authentication rejected (wrong EMAIL_PASS or mailbox user): %s",
            getattr(exc, "smtp_error", exc) if hasattr(exc, "smtp_error") else exc,
        )
        raise
    except smtplib.SMTPRecipientsRefused:
        logger.error("SMTP server refused recipient inbox %s — check EMAIL_USER mailbox exists.", recipient)
        raise
    except (OSError, smtplib.SMTPException) as exc:
        logger.exception("SMTP send failed: %s", exc)
        raise
