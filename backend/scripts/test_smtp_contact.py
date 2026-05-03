#!/usr/bin/env python3
"""
Smoke-test Hostinger SMTP — uses the real ``send_contact_notification`` pipeline.

Usage::
  cd backend && python3 scripts/test_smtp_contact.py

Needs ``pip install -r requirements.txt`` in a venv, and ``backend/.env`` with ``EMAIL_PASS`` set.

Reply-To uses a normal-looking Gmail address so Pydantic’s ``EmailStr`` validates
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from dotenv import load_dotenv  # noqa: E402

load_dotenv(BACKEND_ROOT / ".env")

from schemas.contact import ContactSubmission  # noqa: E402
from services.email_service import send_contact_notification  # noqa: E402


def _fatal(msg: str, code: int = 1) -> int:
    print(f"FAIL: {msg}", file=sys.stderr)
    return code


def main() -> int:
    if not os.getenv("EMAIL_PASS", "").strip():
        return _fatal("EMAIL_PASS is empty — put your mailbox password in backend/.env", 2)

    if not os.getenv("SMTP_HOST", "").strip():
        return _fatal("SMTP_HOST missing", 2)

    inbox = os.getenv("EMAIL_USER", "").strip()
    if not inbox:
        return _fatal("EMAIL_USER missing", 2)

    payload = ContactSubmission.model_validate(
        {
            "name": "SMTP verification probe",
            "email": "qubix.smtp.probe@gmail.com",
            "message": (
                "Automated SMTP smoke test from backend/scripts/test_smtp_contact.py — "
                "safe to discard."
            ),
            "company": "Local QA",
            "service": "Test script",
            "budget": "N/A",
        }
    )

    print(f"Inbox recipient: {inbox}")
    print("Reply-To probe: qubix.smtp.probe@gmail.com")
    print(f"SMTP_HOST: {os.getenv('SMTP_HOST')} port={os.getenv('SMTP_PORT', '587')}")
    print("Sending …")

    try:
        send_contact_notification(payload)
    except Exception as exc:
        print(f"FAIL SMTP: {exc!s}", file=sys.stderr)
        return 3

    print("OK — message accepted by SMTP server.")
    print('Check inbox (and spam) for subject line starting "New inquiry".')
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
