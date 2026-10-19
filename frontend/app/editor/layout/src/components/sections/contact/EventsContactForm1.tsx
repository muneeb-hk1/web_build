"use client";

import { useMemo } from "react";

import type {
  EventsContactFormFieldData,
  SectionProps,
} from "../../../types/section";
import { renderEventsIcon } from "../../../lib/eventsIcons";
import { eventsLeadFieldName } from "../../../lib/leadFormFields";
import LeadFormWrapper from "../formdetail/LeadFormWrapper";

export default function EventsContactForm1({
  data = {},
  leadCapture,
}: SectionProps) {
  const form = data.form ?? {};

  const formFields = useMemo<EventsContactFormFieldData[]>(() => {
    if (Array.isArray(form.fields) && form.fields.length > 0) {
      return form.fields;
    }

    return [
      { placeholder: form.namePlaceholder ?? "Your Name *", type: "text", width: "half" },
      {
        placeholder: form.emailPlaceholder ?? "Email Address *",
        type: "email",
        width: "half",
      },
      { placeholder: form.subjectPlaceholder ?? "Subject *", type: "text", width: "full" },
      {
        placeholder: form.messagePlaceholder ?? "Message *",
        type: "textarea",
        width: "full",
      },
    ];
  }, [form]);

  return (
    <div className="rounded-[2rem] border border-[#f4d4e1] bg-white p-8 shadow-[0_30px_90px_-45px_rgba(214,27,88,0.25)]">
      <LeadFormWrapper leadCapture={leadCapture} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {formFields.map((field, index) => {
            const isTextarea = field.type === "textarea";
            const isFullWidth = field.width === "full" || isTextarea;
            const sharedClassName =
              "w-full rounded-3xl border border-[#f3d2df] bg-[#fff5f9] px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#d61b58] focus:ring-2 focus:ring-[#d61b58]/10 sm:px-5";
            const widthClass = isFullWidth ? "sm:col-span-2" : "";
            const fieldName = leadCapture
              ? eventsLeadFieldName(field, index)
              : undefined;
            const required = Boolean(
              leadCapture &&
                (field.placeholder?.includes("*") || field.type === "email"),
            );

            return isTextarea ? (
              <textarea
                key={`contact-page-field-${index}`}
                name={fieldName}
                required={required}
                rows={5}
                placeholder={field.placeholder ?? ""}
                className={`${sharedClassName} rounded-[1.5rem] py-4 ${widthClass}`}
              />
            ) : (
              <input
                key={`contact-page-field-${index}`}
                name={fieldName}
                required={required}
                type={field.type ?? "text"}
                placeholder={field.placeholder ?? ""}
                className={`${sharedClassName} h-14 ${widthClass}`}
              />
            );
          })}
        </div>

        <button
          type={leadCapture ? "submit" : "button"}
          className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-3xl bg-[#d61b58] px-8 text-sm font-semibold text-white transition hover:bg-[#b01648]"
        >
          {form.buttonIcon &&
          form.buttonIcon !== "none" &&
          form.iconPosition === "before"
            ? renderEventsIcon(form.buttonIcon, "h-5 w-5")
            : null}
          {form.buttonLabel ?? "Send Message"}
          {form.buttonIcon &&
          form.buttonIcon !== "none" &&
          form.iconPosition !== "before"
            ? renderEventsIcon(form.buttonIcon, "h-5 w-5")
            : null}
        </button>
      </LeadFormWrapper>
    </div>
  );
}
