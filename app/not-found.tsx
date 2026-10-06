import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-6xl flex-col items-center justify-center px-8 text-center">
      <div className="font-serif text-[56px] text-blue sm:text-[72px]">404</div>
      <h1 className="mt-3 text-[26px] sm:text-[30px]">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-3 max-w-sm text-mute">
        The page you&apos;re looking for may have moved, or no longer
        exists.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white"
        >
          Back to homepage
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-line px-6 py-3 text-sm font-semibold"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}