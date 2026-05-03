"""
Pydantic models for inbound contact payloads (used by POST /contact).
"""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactSubmission(BaseModel):
    """
    Public contact endpoint body.

    ``name``, ``email``, and ``message`` match the advertised API contract.
    Extra fields preserve richer form data and unknown keys (e.g. stale ``website``
    honeypots from old cached bundles)—those extras are ignored; only ``hp`` is used
    for spam checks so password managers can't block delivery via a filled ``website``.
    """

    model_config = ConfigDict(str_strip_whitespace=True, extra="allow")

    name: str = Field(..., min_length=2, max_length=200, description="Submitter display name.")
    email: EmailStr = Field(..., description="Submitter reply address.")
    message: str = Field(..., min_length=10, max_length=5000, description="User message.")

    company: str | None = Field(default=None, max_length=200)
    phone: str | None = Field(default=None, max_length=50)
    service: str | None = Field(default=None, max_length=200)
    budget: str | None = Field(default=None, max_length=100)
    hp: str | None = Field(
        default=None,
        max_length=500,
        description='Honeypot (JSON key `hp`); must stay empty for humans.',
    )
