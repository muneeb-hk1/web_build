"use client";

import { CreditCard, X } from "lucide-react";

function StripeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98.84 1.545 2.214 1.545 1.8 0 4.01-.824 5.707-1.873l.975 5.35C20.848 23.4 17.696 24 14.184 24c-2.72 0-4.974-.687-6.599-1.978-1.777-1.39-2.7-3.53-2.7-6.177 0-4.154 2.533-5.895 6.591-7.355z" />
    </svg>
  );
}

function RazorpayMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M22.436 0l-11.91 7.626-1.433 4.158L22.436 0zM14.326 13.242L3.564 24h4.735l9.027-10.758-3 0zM5.789 7.626L0 24h3.758l6.946-16.374H5.789z" />
    </svg>
  );
}

type PaymentGatewayPickerProps = {
  open: boolean;
  busy?: boolean;
  dark?: boolean;
  onClose: () => void;
  onStripe: () => void;
  onRazorpay: () => void;
};

export default function PaymentGatewayPicker({
  open,
  busy = false,
  dark = false,
  onClose,
  onStripe,
  onRazorpay,
}: PaymentGatewayPickerProps) {
  if (!open) return null;

  const panel = dark
    ? "border-white/10 bg-[#101827] text-white"
    : "border-zinc-200 bg-white text-zinc-900";
  const sub = dark ? "text-white/50" : "text-zinc-500";
  const cancelBtn = dark
    ? "border-white/15 text-white/70 hover:bg-white/5"
    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50";
  const closeBtn = dark
    ? "border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
    : "border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700";
  const iconWrap = dark
    ? "bg-white/8 text-[#9ec0ff]"
    : "bg-blue-50 text-[#315ff4]";

  return (
    <div className="fixed inset-0 z-[10040] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close payment options"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !busy && onClose()}
      />
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border p-5 shadow-2xl ${panel}`}
      >
        <button
          type="button"
          aria-label="Close"
          disabled={busy}
          onClick={onClose}
          className={`absolute right-3 top-3 grid size-8 place-items-center rounded-full border transition disabled:opacity-50 ${closeBtn}`}
        >
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-3 grid size-12 place-items-center rounded-2xl ${iconWrap}`}
          >
            <CreditCard size={22} strokeWidth={2} />
          </div>
          <h3 className="text-base font-semibold tracking-tight">
            Choose payment method
          </h3>
          <p className={`mt-1 max-w-[18rem] text-xs leading-5 ${sub}`}>
            Stripe and Razorpay are separate gateways — pick whichever is easier
            for you.
          </p>
        </div>

        <div className="mt-5 grid gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={onStripe}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#635bff] text-sm font-semibold text-white transition hover:bg-[#4f46e5] disabled:opacity-60"
          >
            <StripeMark className="size-5 shrink-0 opacity-95" />
            Pay with Stripe
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onRazorpay}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#0c2454] text-sm font-semibold text-white transition hover:bg-[#081a3d] disabled:opacity-60"
          >
            <RazorpayMark className="size-5 shrink-0 opacity-95" />
            Pay with Razorpay
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className={`h-10 w-full rounded-xl border text-sm font-medium transition disabled:opacity-50 ${cancelBtn}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
