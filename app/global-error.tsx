"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#F6F8FB",
          color: "#0B2035",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 28, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#5A6B7D", maxWidth: 360, marginTop: 12 }}>
            Please try again in a moment.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 24,
              background: "#0B2035",
              color: "#fff",
              border: 0,
              borderRadius: 8,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
