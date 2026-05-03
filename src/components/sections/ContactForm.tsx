'use client';

import { useState, type FormEvent } from 'react';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const services = [
  'AI / LLM Development',
  'AI Chatbots',
  'AI Automation (n8n / Node.js)',
  'Web App (React / Angular / Next.js)',
  'Backend / API (Python, FastAPI, Django / DRF)',
  'Mobile App (Flutter)',
  'Shopify E-commerce',
  'WordPress / WooCommerce',
  'Digital Marketing & SEO',
  'DevOps & Cloud Deployment',
  'Other / Not sure yet',
];

const budgets = [
  'Under $5k',
  '$5k – $15k',
  '$15k – $40k',
  '$40k – $100k',
  '$100k+',
];

/** FastAPI exposes friendly `detail`; fall back to nested Pydantic error rows. */
function extractContactApiError(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const body = payload as Record<string, unknown>;
  const detail = body.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail) && detail.length > 0) {
    const row = detail[0] as Record<string, unknown>;
    if (typeof row.msg === 'string') return row.msg;
  }
  if (typeof body.error === 'string') return body.error;
  return undefined;
}

/**
 * Default matches local FastAPI (`uvicorn main:app --port 8000`).
 * Docker Compose overrides via build-arg `/backend/contact` proxied through nginx.
 */
const CONTACT_ENDPOINT =
  (typeof process.env.NEXT_PUBLIC_CONTACT_API_URL === 'string'
    ? process.env.NEXT_PUBLIC_CONTACT_API_URL.trim()
    : '') || 'http://localhost:8000/contact';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // React clears `e.currentTarget` after awaits; keep a stable reference for `reset()`.
    const form = e.currentTarget;
    setStatus('submitting');
    setError(null);

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          extractContactApiError(body) ||
          (res.status === 422
            ? 'Please check required fields — name, email & message.'
            : 'Something went wrong. Please try again or email us directly.');
        throw new Error(msg);
      }

      form.reset();
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (status === 'success') {
    return (
      <div className="card-glass rounded-3xl p-10 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-fg">
          Message sent successfully
        </h3>
        <p className="mt-2 text-fg/70">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="btn-secondary mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card-glass relative rounded-3xl p-5 sm:p-8"
      noValidate
    >
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required placeholder="Jane Doe" />
        <Field
          label="Work email"
          name="email"
          type="email"
          required
          placeholder="jane@company.com"
        />
        <Field label="Company" name="company" placeholder="Company name" />
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          placeholder="+1 555 000 0000"
        />

        <Select label="Service" name="service" options={services} required />
        <Select label="Budget" name="budget" options={budgets} />
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-medium text-fg/80"
        >
          Project details <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project, goals and timeline."
          className="w-full resize-none rounded-2xl border border-fg/10 bg-fg/[0.03] px-4 py-3 text-sm text-fg placeholder:text-fg/40 outline-none transition-colors focus:border-primary-400 focus:bg-fg/[0.05]"
        />
      </div>

      {error ? (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-fg/50">
          By submitting, you agree to our{' '}
          <a href="/privacy" className="text-fg/80 hover:text-fg">
            privacy policy
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full justify-center sm:w-auto"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send message
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-fg/80"
      >
        {label} {required ? <span className="text-rose-400">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-2xl border border-fg/10 bg-fg/[0.03] px-4 py-3 text-sm text-fg placeholder:text-fg/40 outline-none transition-colors focus:border-primary-400 focus:bg-fg/[0.05]"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
}: {
  label: string;
  name: string;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-fg/80"
      >
        {label} {required ? <span className="text-rose-400">*</span> : null}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          defaultValue=""
          className="w-full appearance-none rounded-2xl border border-fg/10 bg-fg/[0.03] px-4 py-3 pr-10 text-sm text-fg outline-none transition-colors focus:border-primary-400 focus:bg-fg/[0.05]"
        >
          <option value="" disabled className="bg-surface text-fg/50">
            Select…
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-surface text-fg">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/50"
          aria-hidden
        />
      </div>
    </div>
  );
}
