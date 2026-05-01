import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message?: string;
  website?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    if (body.website && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, message, service } = body;
    if (!name || !email || !message || !service) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    if (message.length > 5000 || name.length > 200) {
      return NextResponse.json(
        { error: 'Submission is too large.' },
        { status: 400 },
      );
    }

    console.info('[contact] new lead', {
      name,
      email,
      company: body.company,
      service,
      budget: body.budget,
      ts: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] failed', err);
    return NextResponse.json(
      { error: 'Unexpected error. Please email us directly.' },
      { status: 500 },
    );
  }
}
