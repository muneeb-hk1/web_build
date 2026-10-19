"use client";

import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import Link from "next/link";
import { Caveat } from "next/font/google";
import {
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import HomeNav from "@/components/home/home-nav";
import HomeFooter from "@/components/layout/home-footer";
import { UserAuthProvider } from "@/components/auth/UserAuthContext";

const script = Caveat({
  subsets: ["latin"],
  weight: "600",
});

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const emptyForm: ContactForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const fieldClass =
  "box-border h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10";

export default function ContactUs() {
  return (
    <UserAuthProvider>
      <div className="min-h-dvh bg-white text-zinc-950">
        <HomeNav variant="light" />
        <ContactSection />
        <HomeFooter />
      </div>
    </UserAuthProvider>
  );
}

function ContactSection() {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField =
    (field: keyof ContactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your message.");
      }

      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your message.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#f7f9fc]">
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

      <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-[1380px] items-center gap-10 px-5 py-4 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)] lg:gap-16 lg:py-20 xl:grid-cols-[minmax(0,1fr)_minmax(0,640px)] xl:pr-44 2xl:max-w-[1580px]">
        <div className="min-w-0 max-w-[500px]">
          <p className="inline-flex rounded-full bg-[#e8f1ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3b82f6]">
            Contact
          </p>
          <h1 className="mt-5 text-[2.65rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0f172a] sm:text-[3.5rem] lg:text-[3.75rem]">
            Have a
            <br />
            <span className="text-[#2563eb]">question?</span>
          </h1>
          <p className="mt-5 max-w-[390px] text-[15px] leading-7 text-slate-500">
            We&apos;re here to help. Send us a message and we&apos;ll get back
            to you within one business day.
          </p>

          <div className="mt-9 space-y-5">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2563eb]">
                <MapPin size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="pt-0.5">
                <span className="block text-[15px] font-semibold text-[#0f172a]">Address:</span>
                <span className="mt-0.5 block text-sm leading-6 text-slate-500">
                  Cranford Business Park
                  <br />
                  20 Commerce Drive Suite 135 Cranford New Jersey 07016
                  <br />
                  United States of America.
                </span>
              </span>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#2563eb]">
                <Mail size={20} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="pt-0.5">
                <span className="block text-[15px] font-semibold text-[#0f172a]">Email:</span>
                <a href="mailto:info@lestow.com" className="mt-0.5 block text-sm leading-6 text-slate-500 hover:text-[#2563eb]">
                  info@lestow.com
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1 hidden w-[9rem] text-[#3b82f6] xl:block">
            <p
              className={`${script.className} text-right text-[1.55rem] font-semibold leading-[1.12]`}
            >
              Let&apos;s build something great together.
            </p>
            <svg
              aria-hidden
              viewBox="0 0 92 68"
              className="-ml-1 mt-1 h-16 w-[5.75rem] text-[#60a5fa]"
            >
              <path
                d="M78 10C52 6 32 22 18 48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M8 34C12 44 16 50 20 54"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M6 36C14 40 18 48 20 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <section className="w-full min-w-0 rounded-[28px] bg-white px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 sm:px-8 sm:py-8">
            <h2 className="text-lg font-bold tracking-[-0.02em] text-[#0f172a]">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Fill out the form and we&apos;ll get back to you soon.
            </p>

            {submitted ? (
              <p
                role="status"
                className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800"
              >
                Thanks. Your message is with the Lestow team.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name" icon={<User size={16} aria-hidden />}>
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={updateField("name")}
                      placeholder="Alex Rivera"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Email" icon={<Mail size={16} aria-hidden />}>
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={updateField("email")}
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </Field>
                </div>

                <Field
                  label="Phone number"
                  icon={<Phone size={16} aria-hidden />}
                >
                  <input
                    required
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                    placeholder="+91 98765 43210"
                    className={fieldClass}
                  />
                </Field>

                <Field
                  label="Message"
                  iconAlign="top"
                  icon={<MessageSquare size={16} aria-hidden />}
                >
                  <textarea
                    required
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={updateField("message")}
                    placeholder="Tell us what you need help with..."
                    className={`${fieldClass} h-auto min-h-[132px] resize-y py-3 leading-6`}
                  />
                </Field>

                {error ? (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full min-w-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2563eb] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)] transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send message"}
                  {loading ? null : <ArrowRight size={16} aria-hidden />}
                </button>
              </form>
            )}

            <p className="mt-4 text-center text-xs text-slate-400">
              By contacting us, you agree to our{" "}
              <Link
                href="/privacy"
                className="font-medium text-[#2563eb] hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  iconAlign = "center",
  children,
}: {
  label: string;
  icon: ReactNode;
  iconAlign?: "center" | "top";
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <div className="relative">
        <span
          className={`pointer-events-none absolute left-3.5 text-slate-400 ${
            iconAlign === "top" ? "top-3.5" : "top-1/2 -translate-y-1/2"
          }`}
        >
          {icon}
        </span>
        {children}
      </div>
    </label>
  );
}
