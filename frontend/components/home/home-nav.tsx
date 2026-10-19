"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound, X } from "lucide-react";
import { useUserAuth } from "@/components/auth/UserAuthContext";
import UserAvatar from "@/components/auth/UserAvatar";

type HomeNavProps = {
  variant?: "dark" | "light";
};

export default function HomeNav({ variant = "dark" }: HomeNavProps) {
  const router = useRouter();
  const { user, loading, logout } = useUserAuth();
  const light = variant === "light";
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
    <header
      className={
        light
          ? "sticky inset-x-0 top-0 z-50 border-b border-black/5 bg-white/92 text-zinc-950 backdrop-blur-md"
          : "absolute inset-x-0 top-0 z-50 text-white"
      }
    >
      <div className="mx-auto flex h-[76px] max-w-[1380px] items-center justify-between px-5 sm:px-8 2xl:max-w-[1580px]">
        <Link
          href="/"
          aria-label="Lestow home"
          className={`relative block h-10 w-[132px] shrink-0 ${light ? "" : "brightness-0 invert"}`}
        >
          <Image
            src="/lestow-logo.svg"
            alt="Lestow AI Website Builder"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        <div className="hidden min-h-11 items-center gap-4 xl:flex">
          {loading ? (
            <div
              aria-hidden
              className="size-11 animate-pulse rounded-full bg-white/15"
            />
          ) : user ? (
            <>
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-label="Open account menu"
                  className={`grid size-11 cursor-pointer place-items-center overflow-hidden rounded-full border backdrop-blur-md transition ${
                    light
                      ? "border-black/10 bg-black/5 hover:bg-black/10"
                      : "border-white/25 bg-white/15 hover:bg-white/25"
                  }`}
                >
                  <UserAvatar
                    name={user.name}
                    email={user.email}
                    avatarUrl={user.avatarUrl}
                    size={44}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[52px] w-56 rounded-2xl border border-zinc-200 bg-white p-2 text-zinc-900 shadow-[0_20px_55px_rgba(39,32,56,0.16)]">
                    <div className="flex items-center gap-3 px-2 py-2.5">
                      <UserAvatar
                        name={user.name}
                        email={user.email}
                        avatarUrl={user.avatarUrl}
                        size={40}
                      />
                      <span className="grid min-w-0">
                        <strong className="truncate text-xs">
                          {user.name || "Account"}
                        </strong>
                        <small className="truncate text-[10px] text-zinc-500">
                          {user.email}
                        </small>
                      </span>
                    </div>
                    <div className="my-1 h-px bg-zinc-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/user/dashboard");
                      }}
                      className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        router.push("/user/profile");
                      }}
                      className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 text-xs text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      <UserRound size={16} /> Profile
                    </button>
                    <div className="my-1 h-px bg-zinc-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        void logout();
                      }}
                      className="flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                aria-label="Sign in or create account"
                title="Account"
                className={`grid size-11 place-items-center rounded-full border backdrop-blur-md transition ${
                  light
                    ? "border-black/10 bg-black/5 text-zinc-900 hover:bg-black/10"
                    : "border-white/25 bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                <UserRound size={20} strokeWidth={2} />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className={`grid size-10 place-items-center rounded-lg border xl:hidden ${
            light
              ? "border-black/10 bg-black/5 text-zinc-900"
              : "border-white/20 bg-white/10"
          }`}
        >
          {menuOpen ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`mx-3 grid gap-1 rounded-b-2xl border border-t-0 p-4 shadow-2xl backdrop-blur-xl xl:hidden ${
            light
              ? "border-black/10 bg-white text-zinc-900"
              : "border-white/15 bg-[#173fdb]/95"
          }`}
        >
          {loading ? (
            <div className={`h-11 animate-pulse rounded-lg ${light ? "bg-black/5" : "bg-white/15"}`} />
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/user/dashboard");
                }}
                className={`rounded-lg px-3 py-3 text-left text-sm ${
                  light ? "text-zinc-800 hover:bg-black/5" : "text-white/90 hover:bg-white/10"
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/user/profile");
                }}
                className={`rounded-lg px-3 py-3 text-left text-sm ${
                  light ? "text-zinc-800 hover:bg-black/5" : "text-white/90 hover:bg-white/10"
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="mt-2 rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-red-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-center text-sm font-semibold ${
                  light
                    ? "border-black/10 bg-black/5 text-zinc-900"
                    : "border-white/20 bg-white/10 text-white"
                }`}
              >
                <UserRound size={18} />
                Account
              </Link>
            </>
          )}
        </div>
      )}
      </header>
    </>
  );
}
