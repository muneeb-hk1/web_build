"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ChevronDown,
  Paperclip,
  SendHorizontal,
  X,
} from "lucide-react";

type Attachment = {
  name: string;
  url: string;
  size?: number;
  mimeType?: string;
};

type TicketReply = {
  id: string;
  authorRole: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
  attachments?: Attachment[] | null;
};

type SupportTicket = {
  id: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
  replies?: TicketReply[];
};

type EditorSupportChatProps = {
  open: boolean;
  onClose: () => void;
  siteId?: string;
  siteTitle?: string;
  editorMode?: "custom" | "redesign";
  userName?: string | null;
  userAvatar?: string | null;
};

const STORAGE_PREFIX = "css-editor-help-ticket:";
const SUPPORT_AVATAR = "/lestow.png";

function ticketStorageKey(siteId?: string) {
  return `${STORAGE_PREFIX}${siteId || "draft"}`;
}

function formatBubbleTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function statusLabel(status: string) {
  if (status === "in_progress") return "In progress";
  if (status === "resolved") return "Resolved";
  if (status === "closed") return "Closed";
  return "Open";
}

function ChatAvatar({
  src,
  name,
  tone = "user",
}: {
  src?: string | null;
  name: string;
  tone?: "user" | "support";
}) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || (tone === "support" ? "S" : "U");

  return (
    <span
      className={`relative mt-0.5 grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white shadow-sm ${
        tone === "support" ? "bg-white text-zinc-600" : "bg-blue-100 text-blue-700"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={
            tone === "support"
              ? "h-[78%] w-[78%] object-contain"
              : "h-full w-full object-cover"
          }
        />
      ) : (
        <span className="text-[10px] font-bold tracking-wide">{initials}</span>
      )}
    </span>
  );
}

export default function EditorSupportChat({
  open,
  onClose,
  siteId,
  siteTitle,
  editorMode = "custom",
  userName,
  userAvatar,
}: EditorSupportChatProps) {
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supportOnline, setSupportOnline] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const displayName = (userName || "You").trim() || "You";

  const loadTicket = useCallback(async (id: string) => {
    const res = await fetch(
      `/api/user/support/tickets/${encodeURIComponent(id)}`,
      { credentials: "include", cache: "no-store" },
    );
    if (res.status === 404) return null;
    const data = (await res.json().catch(() => ({}))) as SupportTicket & {
      message?: string;
    };
    if (!res.ok) throw new Error(data.message || "Unable to load chat");
    return data;
  }, []);

  const refreshPresence = useCallback(async () => {
    try {
      const res = await fetch("/api/user/presence", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        supportOnline?: boolean;
      };
      if (res.ok && typeof data.supportOnline === "boolean") {
        setSupportOnline(data.supportOnline);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setCollapsed(false);
    setError("");
    setLoading(true);
    void (async () => {
      try {
        await refreshPresence();
        const saved =
          typeof window !== "undefined"
            ? window.localStorage.getItem(ticketStorageKey(siteId))
            : null;
        if (saved) {
          const data = await loadTicket(saved);
          if (data && data.status !== "closed") {
            setTicket(data);
          } else {
            window.localStorage.removeItem(ticketStorageKey(siteId));
            setTicket(null);
          }
        } else {
          setTicket(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to open chat");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, siteId, loadTicket, refreshPresence]);

  useEffect(() => {
    if (!open || !ticket?.id) return;
    const timer = window.setInterval(() => {
      void loadTicket(ticket.id)
        .then((data) => {
          if (data) setTicket(data);
        })
        .catch(() => undefined);
      void refreshPresence();
    }, 8000);
    return () => window.clearInterval(timer);
  }, [open, ticket?.id, loadTicket, refreshPresence]);

  useEffect(() => {
    if (!open || collapsed) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, collapsed, ticket?.replies?.length, ticket?.message, sending]);

  useEffect(() => {
    if (!open) return;
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items?.length) return;
      const images: File[] = [];
      for (const item of Array.from(items)) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            images.push(
              new File(
                [file],
                `screenshot-${Date.now()}.${file.type.split("/")[1] || "png"}`,
                { type: file.type },
              ),
            );
          }
        }
      }
      if (!images.length) return;
      event.preventDefault();
      setFiles((current) => [...current, ...images].slice(0, 5));
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open]);

  const uploadFiles = async (ticketId: string) => {
    if (!files.length) return [] as Attachment[];
    const form = new FormData();
    form.set("ticketId", ticketId);
    files.forEach((file) => form.append("files", file));
    const uploadRes = await fetch("/api/user/support/upload", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    const uploadData = (await uploadRes.json().catch(() => ({}))) as {
      attachments?: Attachment[];
      message?: string;
    };
    if (!uploadRes.ok) {
      throw new Error(uploadData.message || "Unable to upload files");
    }
    return Array.isArray(uploadData.attachments) ? uploadData.attachments : [];
  };

  const requestAiReply = async (
    ticketId: string,
    userText: string,
    current: SupportTicket | null,
  ) => {
    // Fresh presence check
    let online = supportOnline;
    try {
      const res = await fetch("/api/user/presence", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        supportOnline?: boolean;
      };
      if (res.ok && typeof data.supportOnline === "boolean") {
        online = data.supportOnline;
        setSupportOnline(data.supportOnline);
      }
    } catch {
      /* keep previous */
    }
    if (online) return;

    const history = (current?.replies || [])
      .filter((r) => r.body)
      .slice(-8)
      .map((r) => ({
        role:
          r.authorRole === "user"
            ? "user"
            : ("assistant" as "user" | "assistant"),
        content: r.body,
      }));
    if (current?.message) {
      history.unshift({ role: "user", content: current.message });
    }

    const aiRes = await fetch("/api/user/support/ai-reply", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticketId,
        message: userText,
        editorMode,
        history,
      }),
    });
    const aiData = (await aiRes.json().catch(() => ({}))) as SupportTicket & {
      skipped?: boolean;
      replies?: TicketReply[];
    };
    if (aiRes.ok && !aiData.skipped && aiData.id) {
      setTicket(aiData);
    } else if (aiRes.ok) {
      const fresh = await loadTicket(ticketId);
      if (fresh) setTicket(fresh);
    }
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if ((!text && !files.length) || sending) return;
    setSending(true);
    setError("");
    try {
      if (!ticket) {
        const topic = siteTitle?.trim()
          ? `Editor Help · ${siteTitle.trim().slice(0, 60)}`
          : "Editor Help";
        const firstMessage = text || "Sent an attachment";
        const createRes = await fetch("/api/user/support/billing", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: "editor_help",
            topic,
            service: "Editor",
            message: firstMessage,
          }),
        });
        const created = (await createRes.json().catch(() => ({}))) as SupportTicket & {
          message?: string;
          id?: string;
        };
        if (!createRes.ok || !created.id) {
          throw new Error(created.message || "Unable to start chat");
        }
        let attachments: Attachment[] = [];
        if (files.length) {
          attachments = await uploadFiles(created.id);
          if (attachments.length) {
            await fetch(
              `/api/user/support/tickets/${encodeURIComponent(created.id)}`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: "Sent an attachment",
                  attachments,
                }),
              },
            );
          }
        }
        window.localStorage.setItem(ticketStorageKey(siteId), created.id);
        const fresh = await loadTicket(created.id);
        setTicket(fresh);
        setDraft("");
        setFiles([]);
        await requestAiReply(created.id, firstMessage, fresh);
        return;
      }

      const attachments = await uploadFiles(ticket.id);
      const outbound =
        text || (attachments.length ? "Sent an attachment" : "");
      const res = await fetch(
        `/api/user/support/tickets/${encodeURIComponent(ticket.id)}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: outbound,
            attachments,
          }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as SupportTicket & {
        message?: string;
      };
      if (!res.ok) {
        throw new Error(data.message || "Unable to send message");
      }
      setTicket(data);
      setDraft("");
      setFiles([]);
      await requestAiReply(ticket.id, outbound, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message");
    } finally {
      setSending(false);
    }
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  if (!open) return null;

  const replies = ticket?.replies || [];
  const canReply = !ticket || !["closed", "resolved"].includes(ticket.status);

  return (
    <div
      className={`fixed bottom-16 right-4 z-[10050] flex w-[min(100vw-1.5rem,420px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,.28)] sm:bottom-20 sm:right-6 ${
        collapsed
          ? ""
          : "h-[min(70dvh,560px)] max-h-[calc(100dvh-5.5rem)] sm:h-[min(72dvh,580px)] sm:max-h-[calc(100dvh-6.5rem)]"
      }`}
    >
      {/* Outer header */}
      <div className="flex shrink-0 items-start gap-3 border-b border-zinc-100 bg-white px-3.5 py-3">
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
          <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-zinc-950">Support reply</p>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
              Support reply
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-500">
            {siteTitle?.trim() || "Editor Help"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            {ticket ? (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">
                {statusLabel(ticket.status)}
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                New chat
              </span>
            )}
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="inline-flex cursor-pointer items-center gap-1 font-medium text-blue-600 hover:text-blue-700"
            >
              {collapsed ? "Show conversation" : "Hide conversation"}
              <ChevronDown
                size={13}
                className={`transition ${collapsed ? "" : "rotate-180"}`}
              />
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close support chat"
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          <X size={16} />
        </button>
      </div>

      {!collapsed ? (
        <>
          {/* Chat header */}
          <div className="flex shrink-0 items-center gap-3 bg-[#f0f2f5] px-3 py-2.5">
            <ChatAvatar src={SUPPORT_AVATAR} name="Support team" tone="support" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                Support team
              </p>
              <p
                className={`text-[11px] ${
                  supportOnline ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {supportOnline
                  ? "online"
                  : "offline · Lestow Assist answering"}
              </p>
            </div>
            {ticket ? (
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-zinc-500 shadow-sm">
                {statusLabel(ticket.status)}
              </span>
            ) : null}
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="relative min-h-0 flex-1 overflow-y-auto px-2.5 py-3 [scrollbar-width:thin]"
            style={{
              backgroundColor: "#efeae2",
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.035) 0 1px, transparent 1px), radial-gradient(circle at 80% 40%, rgba(0,0,0,0.03) 0 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            {loading ? (
              <p className="py-12 text-center text-xs text-zinc-500">
                Opening chat…
              </p>
            ) : (
              <>
                <div className="mb-3 flex justify-center">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-zinc-500 shadow-sm">
                    Today
                  </span>
                </div>

                {!ticket ? (
                  <div className="mb-3 flex justify-center">
                    <div className="max-w-[90%] rounded-lg bg-[#ffeeba]/95 px-3 py-2 text-center text-[11px] leading-4 text-zinc-700 shadow-sm">
                      <p className="font-semibold">Need help with the editor?</p>
                      <p className="mt-0.5">
                        Ask anything — layout, publish, images, or bugs. You can
                        also paste a screenshot with Ctrl + V.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 flex justify-center">
                    <div className="max-w-[90%] rounded-lg bg-[#ffeeba]/95 px-3 py-2 text-center text-[11px] leading-4 text-zinc-700 shadow-sm">
                      {ticket.topic ? (
                        <p className="font-semibold">{ticket.topic}</p>
                      ) : null}
                      <p className="mt-0.5 whitespace-pre-wrap">{ticket.message}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  {replies.map((reply) => {
                    const isAdmin =
                      reply.authorRole === "admin" ||
                      reply.authorRole === "ai";
                    const isAi = reply.authorRole === "ai";
                    const attachments = Array.isArray(reply.attachments)
                      ? reply.attachments
                      : [];
                    const hideBody =
                      (!reply.body || reply.body === "Sent an attachment") &&
                      attachments.length > 0;
                    return (
                      <div
                        key={reply.id}
                        className={`flex items-end gap-1.5 ${
                          isAdmin ? "justify-start" : "justify-end"
                        }`}
                      >
                        {isAdmin ? (
                          <ChatAvatar
                            src={SUPPORT_AVATAR}
                            name={isAi ? "Lestow Assist" : "Support team"}
                            tone="support"
                          />
                        ) : (
                          <span className="size-9 shrink-0" />
                        )}
                        <div
                          className={`relative max-w-[82%] px-2.5 pb-1.5 pt-1.5 text-[13.5px] leading-5 shadow-sm ${
                            isAdmin
                              ? "rounded-2xl rounded-bl-md bg-white text-zinc-800"
                              : "rounded-2xl rounded-br-md bg-[#d9fdd3] text-zinc-900"
                          }`}
                        >
                          {isAdmin ? (
                            <p className="mb-0.5 text-[11px] font-semibold text-[#00a884]">
                              {isAi ? "Lestow Assist" : "Support team"}
                            </p>
                          ) : null}
                          {attachments.length ? (
                            <div className="mb-1 space-y-1">
                              {attachments.map((file) =>
                                /^image\//i.test(file.mimeType || "") ||
                                /\.(png|jpe?g|webp|gif)(\?|$)/i.test(file.url) ? (
                                  <a
                                    key={file.url}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block overflow-hidden rounded-lg"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="max-h-40 w-full object-cover"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    key={file.url}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-[12px] text-blue-600 underline"
                                  >
                                    {file.name}
                                  </a>
                                ),
                              )}
                            </div>
                          ) : null}
                          {!hideBody ? (
                            <p className="whitespace-pre-wrap break-words">
                              {reply.body}
                            </p>
                          ) : null}
                          <div className="-mb-0.5 mt-1 flex items-center justify-end gap-1 pl-8">
                            <span className="text-[10px] text-zinc-500">
                              {formatBubbleTime(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                        {!isAdmin ? (
                          <ChatAvatar
                            src={userAvatar}
                            name={displayName}
                            tone="user"
                          />
                        ) : (
                          <span className="size-9 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Composer */}
          {canReply ? (
            <div className="bg-[#f0f2f5] px-2 py-2">
              {files.length ? (
                <div className="mb-2 flex flex-wrap gap-1.5 px-1">
                  {files.map((file, index) => (
                    <span
                      key={`${file.name}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-700 shadow-sm"
                    >
                      <Paperclip size={11} />
                      <span className="max-w-[120px] truncate">{file.name}</span>
                      <button
                        type="button"
                        aria-label="Remove file"
                        onClick={() =>
                          setFiles((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                        className="cursor-pointer text-zinc-400 hover:text-zinc-700"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              {error ? (
                <p className="mb-1.5 px-2 text-xs text-rose-600">{error}</p>
              ) : null}
              <form
                className="flex items-end gap-2"
                onSubmit={(event: FormEvent) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mb-0.5 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-500 transition hover:bg-zinc-200/70 hover:text-zinc-700"
                  aria-label="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.webp,.gif,.pdf,.txt,.doc,.docx,image/*,application/pdf"
                  onChange={(event) => {
                    const next = Array.from(event.target.files || []).slice(0, 5);
                    setFiles((current) => [...current, ...next].slice(0, 5));
                    event.target.value = "";
                  }}
                />
                <div className="min-w-0 flex-1 rounded-[24px] bg-white px-3.5 py-2 shadow-sm">
                  <textarea
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onComposerKeyDown}
                    placeholder="Type a message"
                    className="max-h-28 w-full resize-none bg-transparent text-[14px] leading-5 text-zinc-900 outline-none placeholder:text-zinc-400"
                  />
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    Tip: Ctrl + V to paste a screenshot
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={sending || (!draft.trim() && !files.length)}
                  aria-label="Send"
                  className="mb-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendHorizontal size={18} />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#f0f2f5] px-4 py-3 text-center text-xs text-zinc-500">
              This chat is closed. Open Help again to start a new one after
              clearing, or reply from Notifications.
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
