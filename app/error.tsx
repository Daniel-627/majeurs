"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

// Shown when something crashes while a page is rendering. The navbar and
// footer stay visible because this renders inside the root layout.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-center justify-center px-8 text-center">
      <div className="font-serif text-[44px] text-blue sm:text-[56px]">Oops.</div>
      <h1 className="mt-3 text-[26px] sm:text-[30px]">
        Something went wrong on our side.
      </h1>
      <p className="mt-3 max-w-sm text-mute">
        Please try again. If it keeps happening, call us on{" "}
        <a href={site.phoneHref} className="text-blue underline">
          {site.phone}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-line px-6 py-3 text-sm font-semibold"
        >
          Back to homepage
        </Link>
      </div>
      {error.digest && (
        <p className="mt-8 text-[11.5px] text-mute">Reference: {error.digest}</p>
      )}
    </div>
  );
}
