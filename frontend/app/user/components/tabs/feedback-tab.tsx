"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ImagePlus,
  MessageSquareHeart,
  Star,
  X,
} from "lucide-react";

const AREAS = [
  {
    id: "create-ai",
    label: "Create New Website — AI",
    hint: "Create with AI flow, chat refine, preview",
  },
  {
    id: "create-custom",
    label: "Create New Website — Custom",
    hint: "Template / custom builder experience",
  },
  {
    id: "redesign",
    label: "Redesign",
    hint: "Reference clone / redesign build",
  },
  {
    id: "overall",
    label: "Overall product",
    hint: "Dashboard, billing, domains, or general",
  },
] as const;

type PendingShot = {
  id: string;
  file: File;
  previewUrl: string;
};

type UploadedAttachment = {
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
};

const MAX_SHOTS = 5;
const MAX_BYTES = 8 * 1024 * 1024;

function isImageFile(file: File) {
  return /^image\//i.test(file.type) || /\.(png|jpe?g|webp|gif)$/i.test(file.name);
}

export default function FeedbackTab() {
  const [area, setArea] = useState<(typeof AREAS)[number]["id"] | "">("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [shots, setShots] = useState<PendingShot[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pasteHint, setPasteHint] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const revokeAll = useCallback((items: PendingShot[]) => {
    items.forEach((s) => URL.revokeObjectURL(s.previewUrl));
  }, []);

  useEffect(() => {
    return () => revokeAll(shots);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on unmount
  }, []);

  const addFiles = useCallback(
    (list: FileList | File[]) => {
      const incoming = Array.from(list).filter(isImageFile);
      if (!incoming.length) {
        setError("Only image files are allowed (PNG, JPG, WebP).");
        return;
      }
      setError("");
      setShots((prev) => {
        const room = MAX_SHOTS - prev.length;
        if (room <= 0) {
          setError(`You can attach up to ${MAX_SHOTS} screenshots.`);
          return prev;
        }
        const next: PendingShot[] = [];
        for (const file of incoming.slice(0, room)) {
          if (file.size > MAX_BYTES) {
            setError("Each image must be under 8 MB.");
            continue;
          }
          next.push({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            file,
            previewUrl: URL.createObjectURL(file),
          });
        }
        return [...prev, ...next];
      });
    },
    [],
  );

  const removeShot = (id: string) => {
    setShots((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items?.length) return;
      const files: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            files.push(
              new File(
                [file],
                `screenshot-${Date.now()}.${file.type.split("/")[1] || "png"}`,
                { type: file.type },
              ),
            );
          }
        }
      }
      if (!files.length) return;
      event.preventDefault();
      addFiles(files);
      setPasteHint(true);
      window.setTimeout(() => setPasteHint(false), 1800);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles]);

  const submit = async () => {
    if (!area) {
      setError("Please select an area.");
      return;
    }
    if (!rating) {
      setError("Please rate your experience.");
      return;
    }
    if (!message.trim()) {
      setError("Please write your experience and what we can improve.");
      return;
    }
    if (sending) return;

    setSending(true);
    setError("");
    try {
      let attachments: UploadedAttachment[] = [];
      if (shots.length) {
        const form = new FormData();
        form.set("ticketId", "feedback");
        shots.forEach((s) => form.append("files", s.file));
        const uploadRes = await fetch("/api/user/support/upload", {
          method: "POST",
          credentials: "include",
          body: form,
        });
        const uploadData = (await uploadRes.json().catch(() => ({}))) as {
          attachments?: UploadedAttachment[];
          message?: string;
        };
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Unable to upload screenshots.");
        }
        attachments = Array.isArray(uploadData.attachments)
          ? uploadData.attachments
          : [];
      }

      const areaLabel = AREAS.find((a) => a.id === area)?.label || area;
      const response = await fetch("/api/user/feedback", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area: areaLabel,
          rating,
          message: message.trim(),
          attachments,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(data.message || "Unable to send feedback.");
      }
      revokeAll(shots);
      setShots([]);
      setSent(true);
      setMessage("");
      setRating(0);
      setArea("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send feedback.",
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section className="relative min-h-full overflow-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
        <div className="relative mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-emerald-100 bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(15,23,42,.06)]">
          <CheckCircle2 className="mb-4 size-12 text-emerald-500" />
          <h2 className="text-xl font-semibold tracking-[-.03em] text-zinc-950">
            Thanks for your feedback
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Your note helps us improve Create AI, Custom, and Redesign. We
            read every submission.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 cursor-pointer rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Send another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-full overflow-hidden px-4 py-7 sm:px-6 sm:py-9 lg:px-9">
      <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-violet-100/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-72 size-72 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">
            <MessageSquareHeart size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-[-.04em] text-zinc-950">
              Feedback
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-zinc-500">
              Tell us how Create New Website (AI / Custom) or Redesign felt —
              and what we should improve next.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,.05)] sm:p-7">
          <label className="block text-sm font-medium text-zinc-800">
            What are you giving feedback on?
          </label>
          <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup">
            {AREAS.map((item) => {
              const active = area === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setArea(item.id)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
                    active
                      ? "border-violet-400 bg-violet-50/80 ring-1 ring-violet-300"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 ${
                      active
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-zinc-300 bg-white text-transparent"
                    }`}
                    aria-hidden
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-zinc-900">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500">
                      {item.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-6 block text-sm font-medium text-zinc-800">
            How was your experience?
          </label>
          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (hoverRating || rating) >= n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className="cursor-pointer rounded-lg p-1.5 transition-transform hover:scale-110"
                >
                  <Star
                    size={26}
                    className={
                      filled
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300"
                    }
                  />
                </button>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-sm text-zinc-500">{rating}/5</span>
            )}
          </div>

          <label
            htmlFor="feedback-message"
            className="mt-6 block text-sm font-medium text-zinc-800"
          >
            Your experience &amp; what we can improve
          </label>
          <textarea
            id="feedback-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. AI create was fast but contact section broke; Redesign preview was good — want clearer steps…"
            className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />

          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-medium text-zinc-800">
                Screenshots / images
              </label>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600">
                Tip: Ctrl + V to paste a screenshot
              </span>
            </div>
            <div
              ref={dropRef}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
              }}
              className={`mt-2 rounded-xl border border-dashed px-4 py-5 transition-colors ${
                pasteHint
                  ? "border-violet-400 bg-violet-50"
                  : "border-zinc-300 bg-zinc-50/60"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <ImagePlus className="mb-2 size-7 text-zinc-400" />
                <p className="text-sm text-zinc-700">
                  Upload images or paste with{" "}
                  <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700">
                    V
                  </kbd>
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Up to {MAX_SHOTS} images · max 8 MB each
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-3 cursor-pointer rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  Choose files
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.length) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {shots.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {shots.map((shot) => (
                  <div
                    key={shot.id}
                    className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shot.previewUrl}
                      alt={shot.file.name}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove screenshot"
                      onClick={() => removeShot(shot.id)}
                      className="absolute right-1.5 top-1.5 grid size-7 cursor-pointer place-items-center rounded-full bg-zinc-950/70 text-white hover:bg-zinc-950"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            disabled={sending}
            onClick={() => void submit()}
            className="mt-5 cursor-pointer rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit feedback"}
          </button>
        </div>
      </div>
    </section>
  );
}
