"""Public URLs surfaced in outbound mail (canonical contact form location)."""

from __future__ import annotations

import os


def public_contact_form_url() -> str:
    """
    Canonical /contact URL for attribution in notifications.

    Set ``PUBLIC_SITE_URL`` in backend env (no trailing slash), e.g.
    ``https://qubixsolution.com`` — used so staging and production show the
    correct link instead of a hard-coded domain.
    """
    raw = os.getenv("PUBLIC_SITE_URL") or "https://qubixsolution.com"
    base = raw.strip().rstrip("/")
    return f"{base}/contact"
