"use client";

import { useActionState } from "react";
import { submitEnquiry, type FormState } from "@/app/actions";

const input =
  "w-full rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sand-500 focus:ring-2 focus:ring-sand-200";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      {children}
      {error && <span className="block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export default function EnquiryForm({ propertyId, propertyTitle }: { propertyId?: number; propertyTitle?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitEnquiry, {});
  const today = new Date().toISOString().slice(0, 10);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-white border border-sand-200 p-6 text-center space-y-2">
        <p className="font-display text-2xl">Thank you!</p>
        <p className="text-sm text-ink-soft">An agent will call you shortly{propertyTitle ? ` about “${propertyTitle}”` : ""}.</p>
      </div>
    );
  }

  const f = state.fields ?? {};
  return (
    <form action={action} className="rounded-2xl bg-white border border-sand-200 p-5 space-y-3" noValidate>
      {propertyId && <input type="hidden" name="propertyId" value={propertyId} />}
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <Field label="Full name" error={f.name}>
        <input name="name" required autoComplete="name" className={input} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Phone / WhatsApp" error={f.phone}>
          <input name="phone" required type="tel" autoComplete="tel" placeholder="+971 5x xxx xxxx" className={input} />
        </Field>
        <Field label="Email (optional)" error={f.email}>
          <input name="email" type="email" autoComplete="email" className={input} />
        </Field>
      </div>
      {propertyId && (
        <Field label="Preferred viewing date (optional)" error={f.preferredDate}>
          <input name="preferredDate" type="date" min={today} className={input} />
        </Field>
      )}
      <Field label="Message" error={f.message}>
        <textarea
          name="message"
          rows={3}
          className={input}
          defaultValue={propertyTitle ? `I'm interested in “${propertyTitle}”. Please contact me.` : ""}
        />
      </Field>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full rounded-xl bg-ink text-white py-3 text-sm font-semibold hover:bg-ink/85 disabled:opacity-60"
      >
        {pending ? "Sending…" : propertyId ? "Request a viewing" : "Send enquiry"}
      </button>
    </form>
  );
}
