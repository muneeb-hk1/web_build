"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function Redirect({ to }: { to: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `${to}?${qs}` : to);
  }, [router, searchParams, to]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white text-neutral-500">
      Redirecting…
    </main>
  );
}

export default function LegacyPaymentSuccessRedirect() {
  return (
    <Suspense fallback={null}>
      <Redirect to="/payment-success" />
    </Suspense>
  );
}
