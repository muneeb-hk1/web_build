"use client";

import type { EventsContactItemData, SectionProps } from "../../../types/section";
import { renderEventsIcon } from "../../../lib/eventsIcons";

const contactLineHref = (icon: string | undefined, text: string, href?: string) => {
  const explicit = href?.trim();
  if (explicit) return explicit;
  const kind = (icon || "").toLowerCase();
  if (kind.includes("phone")) {
    const tel = text.replace(/[^\d+]/g, "");
    return tel ? `tel:${tel}` : "";
  }
  if (kind.includes("mail") || kind.includes("email")) {
    return `mailto:${text.trim()}`;
  }
  return "";
};

export default function EventsContactDetails1({ data = {} }: SectionProps) {
  const contactItems = (data.contactItems ?? []) as EventsContactItemData[];

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)]">
      <div className="space-y-6">
        {contactItems.map((item, idx) => {
          const lines = [
            { text: item.value, href: item.href },
            { text: item.value2, href: item.href2 },
          ].flatMap((row) =>
            (row.text || "")
              .split(/\r?\n/)
              .map((text) => text.trim())
              .filter(Boolean)
              .map((text, lineIndex) => ({
                text,
                href: lineIndex === 0 ? row.href : undefined,
              })),
          );

          return (
          <div
            key={`${item.label}-${idx}`}
            className={`flex gap-5 ${idx < contactItems.length - 1 ? "border-b border-[#fae0ec] pb-5" : ""}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8f2] text-[#d61b58]">
              {renderEventsIcon(item.icon, "h-6 w-6")}
            </div>
            <div>
              {item.label && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d61b58]">
                  {item.label}
                </p>
              )}
              {lines.length > 0 && (
                <div className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                  {lines.map((line) => {
                    const href = contactLineHref(item.icon, line.text, line.href);
                    return href ? (
                      <a key={line.text} href={href} className="block hover:text-[#d61b58]">
                        {line.text}
                      </a>
                    ) : (
                      <p key={line.text}>{line.text}</p>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
