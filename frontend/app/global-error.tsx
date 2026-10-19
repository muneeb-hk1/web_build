"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
          <h1>Something went wrong</h1>
          <p>Please try again.</p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: 12,
              color: "#7f1d1d",
              background: "#fef2f2",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {error?.message || "Unknown error"}
          </pre>
          <button
            type="button"
            onClick={() => {
              reset();
              window.location.reload();
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
