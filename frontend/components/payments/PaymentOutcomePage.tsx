"use client";

import Link from "next/link";
import { Suspense, useMemo, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Clock, LifeBuoy, X } from "lucide-react";
import { UserAuthProvider } from "@/components/auth/UserAuthContext";
import HomeNav from "@/components/home/home-nav";
import GoogleAdsPurchaseConversion from "@/components/GoogleAdsPurchaseConversion";

export type PaymentOutcomeKind = "success" | "failed" | "cancel" | "pending";

const COPY: Record<
  PaymentOutcomeKind,
  {
    eyebrow: string;
    title: ReactNode;
    bodyFallback: string;
    bodyExtra: string;
    primaryLabel: string;
    icon: "check" | "x" | "clock";
    iconClass: string;
    amountLabel: string;
  }
> = {
  success: {
    eyebrow: "Payment confirmed",
    title: (
      <>
        Thank <span className="text-blue-600">you.</span>
      </>
    ),
    bodyFallback: "Thanks for choosing Lestow. Your payment is confirmed.",
    bodyExtra: "A receipt has been sent to your email. You can continue building anytime.",
    primaryLabel: "Continue",
    icon: "check",
    iconClass: "bg-blue-600 text-white",
    amountLabel: "Amount paid",
  },
  failed: {
    eyebrow: "Payment failed",
    title: (
      <>
        Payment <span className="text-red-600">failed.</span>
      </>
    ),
    bodyFallback:
      "Something went wrong while processing your payment. You can try again anytime.",
    bodyExtra: "No charge was completed. Check your card or try another method.",
    primaryLabel: "Try again",
    icon: "x",
    iconClass: "bg-red-600 text-white",
    amountLabel: "Attempted amount",
  },
  cancel: {
    eyebrow: "Payment cancelled",
    title: (
      <>
        Payment <span className="text-amber-600">cancelled.</span>
      </>
    ),
    bodyFallback:
      "You closed checkout before completing payment. No charge was made.",
    bodyExtra: "You can restart checkout whenever you are ready — nothing was billed.",
    primaryLabel: "Back to plans",
    icon: "x",
    iconClass: "bg-amber-500 text-white",
    amountLabel: "Attempted amount",
  },
  pending: {
    eyebrow: "Payment pending",
    title: (
      <>
        Payment <span className="text-blue-600">pending.</span>
      </>
    ),
    bodyFallback:
      "Your payment is still being processed. This usually takes a few moments.",
    bodyExtra: "We will confirm as soon as the bank responds. You can safely leave this page.",
    primaryLabel: "Check billing",
    icon: "clock",
    iconClass: "bg-blue-600 text-white",
    amountLabel: "Amount",
  },
};

function PaymentOutcomeContent({ kind }: { kind: PaymentOutcomeKind }) {
  const searchParams = useSearchParams();
  const copy = COPY[kind];

  const amount = searchParams.get("amount")?.trim() || "";
  const product = searchParams.get("product")?.trim() || "";
  const site = searchParams.get("site")?.trim() || "";
  const provider = searchParams.get("provider")?.trim() || "";
  const reason = searchParams.get("reason")?.trim() || "";
  const continueUrl = useMemo(() => {
    const raw = searchParams.get("continue")?.trim() || "";
    if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
    return kind === "pending" ? "/user/billing" : "/user/plan";
  }, [searchParams, kind]);

  const detail = [
    product,
    site ? `for “${site}”` : "",
    provider ? `via ${provider}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const body =
    kind === "success"
      ? detail
        ? `${detail} is all set. Thanks for choosing Lestow.`
        : copy.bodyFallback
      : kind === "pending"
        ? reason ||
          (detail
            ? `${detail} is waiting for confirmation.`
            : copy.bodyFallback)
        : reason ||
          (detail
            ? kind === "cancel"
              ? `${detail} was not completed.`
              : `${detail} could not be completed.`
            : copy.bodyFallback);

  return (
    <div className="fixed inset-0 flex h-dvh flex-col overflow-hidden bg-white text-zinc-950 [&>header]:shrink-0">
      {kind === "success" ? <GoogleAdsPurchaseConversion /> : null}
      <HomeNav variant="light" />

      <main className="min-h-0 flex-1 [container-type:size]">
        <section className="relative isolate flex h-full items-center px-5 py-[clamp(12px,3cqh,40px)] sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-b from-white via-blue-50 to-[#dcecff]"
          />

          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-[clamp(12px,3cqh,28px)] text-center [@container(max-height:320px)]:gap-2">
            <div className="relative mx-auto flex size-24 items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_12px_40px_-12px_rgba(45,123,255,0.35)] sm:size-28 [@container(max-height:620px)]:size-[76px] [@container(max-height:480px)]:hidden">
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-full bg-blue-50"
              />
              <div
                className={`relative flex size-14 items-center justify-center rounded-full sm:size-16 ${copy.iconClass}`}
              >
                {copy.icon === "check" ? (
                  <Check
                    aria-hidden="true"
                    className="size-7 sm:size-8"
                    strokeWidth={2.5}
                  />
                ) : copy.icon === "clock" ? (
                  <Clock
                    aria-hidden="true"
                    className="size-7 sm:size-8"
                    strokeWidth={2.5}
                  />
                ) : (
                  <X
                    aria-hidden="true"
                    className="size-7 sm:size-8"
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600 [@container(max-height:320px)]:hidden">
              {copy.eyebrow}
            </p>
            <h1 className="whitespace-nowrap text-[clamp(2.25rem,min(7vw,8cqh),4.5rem)] font-medium leading-[1.04] tracking-[-0.065em]">
              {copy.title}
            </h1>
            <div className="mx-auto max-w-[460px] space-y-2">
              <p className="text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 [@container(max-height:480px)]:text-sm [@container(max-height:480px)]:leading-[1.5]">
                {body}
              </p>
              <p className="text-sm leading-6 text-neutral-500 [@container(max-height:480px)]:hidden">
                {copy.bodyExtra}
              </p>
            </div>

            {amount ? (
              <div
                className={`mx-auto w-full max-w-[320px] rounded-2xl border bg-white/90 px-5 py-4 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.15)] ${
                  kind === "success"
                    ? "border-blue-100"
                    : "border-neutral-200"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-[0.16em] ${
                    kind === "success" ? "text-blue-600" : "text-neutral-500"
                  }`}
                >
                  {copy.amountLabel}
                </p>
                <p className="mt-1 text-3xl font-medium tracking-[-0.05em] text-zinc-950 sm:text-4xl">
                  {amount}
                </p>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={continueUrl}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-black px-7 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:w-auto"
              >
                {copy.primaryLabel}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              {kind === "success" ? (
                <Link
                  href="/user/billing"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 text-sm font-medium text-zinc-800 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:w-auto"
                >
                  View billing
                </Link>
              ) : kind === "pending" ? null : (
                <Link
                  href="/"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-7 text-sm font-medium text-zinc-800 transition hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:w-auto"
                >
                  Back to home
                </Link>
              )}
            </div>

            <div className="mx-auto flex w-full max-w-[500px] items-center gap-3 rounded-2xl border border-white bg-white/85 p-4 text-left shadow-[0_8px_30px_-20px_rgba(0,0,0,0.15)] sm:gap-5 sm:p-6 [@container(max-height:620px)]:px-4 [@container(max-height:620px)]:py-3 [@container(max-height:480px)]:px-3 [@container(max-height:480px)]:py-2 [@container(max-height:320px)]:border-0 [@container(max-height:320px)]:bg-transparent [@container(max-height:320px)]:px-3 [@container(max-height:320px)]:py-0 [@container(max-height:320px)]:shadow-none">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 [@container(max-height:480px)]:hidden">
                <LifeBuoy aria-hidden="true" className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-medium">Need a hand along the way?</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500 [@container(max-height:480px)]:hidden">
                  Find answers in our help center.
                </p>
              </div>
              <Link
                href="/help-center"
                aria-label="Visit the help center"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-blue-100 text-blue-600 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function PaymentOutcomePage({ kind }: { kind: PaymentOutcomeKind }) {
  return (
    <UserAuthProvider>
      <Suspense
        fallback={
          <main className="flex min-h-dvh items-center justify-center bg-white text-neutral-500">
            Loading…
          </main>
        }
      >
        <PaymentOutcomeContent kind={kind} />
      </Suspense>
    </UserAuthProvider>
  );
}
