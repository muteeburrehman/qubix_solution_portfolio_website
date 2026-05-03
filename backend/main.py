"""
FastAPI entrypoint — contact email API with CORS + health check.

Environment variables load from ``.env`` via ``python-dotenv`` alongside process env.
"""

from __future__ import annotations

import logging
import os
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.contact import router as contact_router


def _bootstrap_config() -> None:
    """Load ``backend/.env`` then optional repo-root ``.env`` (non-overriding)."""
    here = Path(__file__).resolve().parent
    load_dotenv(here / ".env")
    load_dotenv(here.parent / ".env", override=False)


# Load `.env` first so logging level & CORS derive from secrets file on disk.
_bootstrap_config()

_logging_level = getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper(), logging.INFO)
logging.basicConfig(
    level=_logging_level,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """One-time SMTP configuration sanity check logged at startup."""
    _required = ["SMTP_HOST", "EMAIL_USER", "EMAIL_PASS"]
    missing_mail = [k for k in _required if not os.getenv(k)]
    if missing_mail:
        logger.warning(
            "SMTP not fully configured (missing env: %s) — outbound mail will "
            "fail until `backend/.env` is populated.",
            ", ".join(missing_mail),
        )
    else:
        logger.info(
            "SMTP relay targeted at %s — credentials present.",
            os.getenv("SMTP_HOST"),
        )
    yield


app = FastAPI(
    title="Qubix Contact API",
    version="1.0.0",
    description="Receives portfolio contact submissions and delivers them via SMTP.",
    lifespan=lifespan,
)

_origins_raw = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)

_origins = [o.strip() for o in _origins_raw.split(",") if o.strip()]

if not _origins:
    logger.warning("CORS_ORIGINS empty — defaulting to localhost origins only.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=("GET", "POST", "OPTIONS"),
    allow_headers=("*"),
)

app.include_router(contact_router)


@app.get("/healthz", summary="Container / load-balancer probes.")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
