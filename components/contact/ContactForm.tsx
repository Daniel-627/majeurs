"use client";

import { useState } from "react";

const needs = [
  "Accounting & Bookkeeping",
  "Tax Services",
  "Payroll",
  "Audit & Assurance",
  "Business Advisory",
  "Financial Reporting",
  "Not sure yet",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    serviceInterest: needs[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 py-16 text-center sm:p-9">
        <div className="font-serif text-xl">Thank you.</div>
        <p className="mt-2 text-sm text-mute">
          We&apos;ve received your request and will be in touch within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-6 sm:p-9"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Wanjiru"
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="Business / Organization">
          <input
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            placeholder="Optional"
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+254 7..."
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="What do you need help with?">
          <select
            value={form.serviceInterest}
            onChange={(e) => update("serviceInterest", e.target.value)}
            className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          >
            {needs.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Tell us a bit more">
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="A short description of your business and what you're looking for."
            className="min-h-[100px] w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none"
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-600">
          Something went wrong — please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-lg bg-navy py-3.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request Consultation"}
      </button>
      <div className="mt-3.5 text-center text-xs text-mute">
        We&apos;ll respond within one business day.
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-mute">
        {label}
      </label>
      {children}
    </div>
  );
}