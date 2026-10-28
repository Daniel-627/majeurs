"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoFull } from "@/components/ui/Logo";

const RESTRICTED_MESSAGE = "Only restricted authorisation.";

// Public sign-in for staff and clients. Access isn't open yet, so every
// attempt gets the same answer. Nothing is sent anywhere: the email and
// password never leave this browser tab.
//
// When the client portal is built, replace handleSubmit with a real call.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const failed = attempts > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPassword("");
    setAttempts((n) => n + 1);
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-blue";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="rise rise-1 w-full max-w-sm rounded-2xl border border-line bg-white p-8"
      >
        <LogoFull height={36} />
        <h1 className="mt-5 text-2xl font-serif">Sign in</h1>
        <p className="mt-1 text-sm text-mute">For Majeurs staff and clients.</p>

        <div className="mt-6">
          <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold text-mute">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={failed}
            aria-describedby={failed ? "login-error" : undefined}
            className={inputClass}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold text-mute">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={failed}
            aria-describedby={failed ? "login-error" : undefined}
            className={inputClass}
          />
        </div>

        {failed && (
          // key={attempts} restarts the shake on every new attempt
          <div
            key={attempts}
            id="login-error"
            role="alert"
            className="shake mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-[13.5px] font-medium text-red-700"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 flex-shrink-0" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5V8.5M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {RESTRICTED_MESSAGE}
          </div>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-navy py-3 text-sm font-semibold text-white"
        >
          Sign in
        </button>

        <p className="mt-5 text-center text-[13px] text-mute">
          Need access?{" "}
          <Link href="/contact" className="font-semibold text-blue underline">
            Get in touch
          </Link>
        </p>
      </form>
    </div>
  );
}
