import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, LayoutDashboard } from "lucide-react";
import HomeNav from "@/components/home/home-nav";
import { UserAuthProvider } from "@/components/auth/UserAuthContext";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <UserAuthProvider>
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white text-zinc-950">
      <HomeNav variant="light" />
      <main className="relative flex min-h-0 flex-1 items-center overflow-hidden bg-[#f7f9fc]">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[6%] top-24 hidden h-[380px] w-[min(42%,520px)] lg:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d5deea 1.15px, transparent 1.2px)",
            backgroundSize: "16px 16px",
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 16%, #000 62%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 16%, #000 62%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[8%] top-[18%] h-[560px] w-[min(640px,52%)] rounded-full bg-[radial-gradient(circle_at_40%_45%,#d4e6ff_0%,#e8f1ff_46%,transparent_74%)]"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:px-10">
          <div className="min-w-0">
            <span className="bg-gradient-to-b from-[#0f172a] via-[#1e3a8a] to-[#93c5fd] bg-clip-text text-[clamp(7.5rem,16vw,13.5rem)] font-black leading-[0.82] tracking-[-0.08em] text-transparent">
              404
            </span>
            <p className="mt-5 inline-flex rounded-full bg-[#e8f1ff] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#2563eb]">
              Error 404
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
              We checked every corner, but this address does not lead to a live
              page right now.
            </p>
          </div>

          <section className="w-full min-w-0 rounded-[2rem] bg-white px-6 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 sm:px-9 sm:py-10">
            <h1 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.04em] text-[#0f172a] sm:text-4xl">
              This page took a{" "}
              <span className="text-[#2563eb]">wrong turn.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base sm:leading-7">
              The link may be incorrect, moved, or no longer available. Head
              home to continue building your website.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(37,99,235,0.22)] transition hover:bg-[#1d4ed8]"
              >
                <Home size={17} aria-hidden />
                Go to homepage
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link
                href="/user/dashboard"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0f172a] transition hover:border-[#2563eb] hover:text-[#2563eb]"
              >
                <LayoutDashboard size={17} aria-hidden />
                Dashboard
              </Link>
            </div>

            <p className="mt-7 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-400">
              Check the URL for a typo, or use one of the safe routes above.
            </p>
          </section>
        </div>
      </main>
    </div>
    </UserAuthProvider>
  );
}
