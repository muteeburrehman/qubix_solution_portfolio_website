import { NextRequest, NextResponse } from 'next/server';

/** Server-side only — Docker uses `http://api:8000/contact`. Local dev defaults to loopback FastAPI. */
const BACKEND =
  typeof process.env.CONTACT_BACKEND_URL === 'string'
    ? process.env.CONTACT_BACKEND_URL.trim()
    : 'http://127.0.0.1:8000/contact';

export async function POST(request: NextRequest) {
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ detail: 'Invalid request body' }, { status: 400 });
  }

  try {
    const res = await fetch(BACKEND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(25_000),
    });

    const payload = await res.text();
    const contentType =
      res.headers.get('content-type') || 'application/json; charset=utf-8';

    return new NextResponse(payload, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          'The contact service is temporarily unavailable. Please email us directly and we will get back to you.',
      },
      { status: 503 },
    );
  }
}
