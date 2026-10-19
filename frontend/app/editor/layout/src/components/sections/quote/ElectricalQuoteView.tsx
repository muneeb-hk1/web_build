'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useElectricalNavigate } from '../header/ElectricalLink';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  ClipboardList,
  FileText,
  Headset,
  Lock,
  Mail,
  MapPin,
  Phone,
  Settings,
  User,
  Zap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { QuoteProps } from '../header/electricalTypes';
import { fadeUp, inView, stagger } from '../header/electricalMotion';

const fieldIcon: Record<string, React.ElementType> = {
  name: User,
  email: Mail,
  phone: Phone,
  service: Settings,
  location: MapPin,
};

export default function Quote({ data, services = [] }: QuoteProps) {
  const goTo = useElectricalNavigate();
  const [service, setService] = useState('');
  const [phone, setPhone] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const labels = data.form.labels || {};
  const ph = data.form.placeholders;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || phone.length < 10) return;
    goTo('/thank-you');
  };

  return (
    <section className="bg-white py-10 sm:py-[52px] lg:py-[60px]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
            className="mb-8 text-center sm:mb-10"
        >
          <div className="mb-3 flex items-center justify-center gap-2 sm:gap-3">
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
            <ClipboardList size={15} className="text-[#1B8A3E]" />
            <span data-editor-inline-format-key="electrical-quote:subtitle" className="text-[11px] font-extrabold uppercase tracking-[1.8px] text-[#1B8A3E] sm:text-[13px] sm:tracking-[2.2px]">
              {data.subtitle}
            </span>
            <span className="h-[2px] w-6 bg-[#1B8A3E] sm:w-8" />
          </div>
          <h2 className="text-[24px] font-extrabold leading-[1.2] text-[#0b2540] sm:text-[36px] lg:text-[44px]">
            <span data-editor-inline-format-key="electrical-quote:title_line1">{data.title_line1}</span>{' '}
            <span className="text-[#1B8A3E]" data-editor-inline-format-key="electrical-quote:title_highlight">{data.title_highlight}</span>
          </h2>
          <p data-editor-inline-format-key="electrical-quote:description" className="mx-auto mt-3 max-w-[640px] text-[13px] leading-[1.75] text-[#7a8190] sm:text-[15px]">
            {data.description}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-[20px] bg-[#f4f7f8] p-4 sm:rounded-[24px] sm:p-8 lg:h-full"
          >
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f6ee] text-[#1B8A3E]">
                <FileText size={22} />
              </span>
              <div>
                <h3 className="text-[20px] font-extrabold text-[#0b2540] sm:text-[22px]">
                  {data.form.title} {data.form.title_highlight}
                </h3>
                <p className="mt-1 text-[13px] text-[#7a8190]">{data.form.description}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {Array.isArray((data as { formFields?: { label?: string; type?: string; placeholder?: string }[] }).formFields) &&
              (data as { formFields?: { label?: string; type?: string; placeholder?: string }[] }).formFields!.length ? (
                (data as { formFields: { label?: string; type?: string; placeholder?: string }[] }).formFields.map((field, index) => {
                  const raw = (field.type || "text").toLowerCase();
                  const type =
                    raw === "phone" || raw === "tel"
                      ? "tel"
                      : raw === "dropdown" || raw === "select"
                        ? "select"
                        : raw === "textarea"
                          ? "textarea"
                          : raw === "email"
                            ? "email"
                            : "text";
                  const placeholder = field.placeholder || field.label || "";
                  if (type === "textarea") {
                    return (
                      <div key={`${field.label}-${index}`} className="sm:col-span-2">
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0b2540]">
                          {field.label}
                        </label>
                        <textarea
                          required
                          placeholder={placeholder}
                          className="min-h-[120px] w-full rounded-xl border border-[#e5e9ee] bg-white px-4 py-3 text-[13px] text-[#0b2540] outline-none focus:border-[#1B8A3E]"
                        />
                      </div>
                    );
                  }
                  if (type === "select") {
                    return (
                      <div key={`${field.label}-${index}`}>
                        <label className="mb-1.5 block text-[13px] font-bold text-[#0b2540]">
                          {field.label}
                        </label>
                        <div ref={dropdownRef} className="relative">
                          <input type="hidden" required value={service} />
                          <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            className={`relative flex h-12 w-full items-center rounded-xl border bg-white pl-11 pr-10 text-left text-[13px] outline-none ${
                              open ? "border-[#1B8A3E]" : "border-[#e5e9ee]"
                            } ${service ? "font-semibold text-[#0b2540]" : "text-[#94a3b8]"}`}
                          >
                            <Settings size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                            {service || placeholder}
                            <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#1B8A3E] ${open ? "rotate-180" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {open && (
                              <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute left-0 right-0 z-30 mt-2 max-h-[240px] overflow-y-auto rounded-[14px] border border-[#e5e9ee] bg-white py-1.5 shadow-[0_16px_40px_rgba(15,40,70,0.14)]"
                              >
                                {services.map((s) => (
                                  <button
                                    key={s.title}
                                    type="button"
                                    onClick={() => {
                                      setService(s.title);
                                      setOpen(false);
                                    }}
                                    className={`flex w-full px-4 py-2.5 text-left text-[13px] font-semibold ${
                                      service === s.title ? "bg-[#1B8A3E] text-white" : "text-[#334155] hover:bg-[#eef8f1]"
                                    }`}
                                  >
                                    {s.title}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Field
                      key={`${field.label}-${index}`}
                      label={field.label || ""}
                      icon={type === "email" ? "email" : type === "tel" ? "phone" : "name"}
                      type={type === "email" || type === "tel" ? type : "text"}
                      placeholder={placeholder}
                      required
                    />
                  );
                })
              ) : (
              <>
              <Field
                label={`${labels.name || 'Full Name'} *`}
                icon="name"
                placeholder={ph.name}
                required
              />
              <Field
                label={`${labels.email || 'Email Address'} *`}
                icon="email"
                type="email"
                placeholder={ph.email}
                required
              />
              <Field
                label={`${labels.phone || 'Phone Number'} *`}
                icon="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
                placeholder={ph.phone}
                required
              />
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-[#0b2540]">
                  {labels.service || 'Service Type'} *
                </label>
                <div ref={dropdownRef} className="relative">
                  <input type="hidden" required value={service} />
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className={`relative flex h-12 w-full items-center rounded-xl border bg-white pl-11 pr-10 text-left text-[13px] outline-none ${
                      open ? 'border-[#1B8A3E]' : 'border-[#e5e9ee]'
                    } ${service ? 'font-semibold text-[#0b2540]' : 'text-[#94a3b8]'}`}
                  >
                    <Settings
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                    />
                    {service || ph.service}
                    <ChevronDown
                      size={16}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#1B8A3E] transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 right-0 z-30 mt-2 max-h-[240px] overflow-y-auto rounded-[14px] border border-[#e5e9ee] bg-white py-1.5 shadow-[0_16px_40px_rgba(15,40,70,0.14)]"
                      >
                        {services.map((s) => {
                          const isActive = service === s.title;
                          return (
                            <button
                              key={s.title}
                              type="button"
                              onClick={() => {
                                setService(s.title);
                                setOpen(false);
                              }}
                              className={`flex w-full items-center px-4 py-2.5 text-left text-[13px] font-semibold ${
                                isActive
                                  ? 'bg-[#1B8A3E] text-white'
                                  : 'text-[#334155] hover:bg-[#eef8f1] hover:text-[#1B8A3E]'
                              }`}
                            >
                              {s.title}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-4 sm:col-span-2">
                <Field
                  label={`${labels.location || 'Service Location'} *`}
                  icon="location"
                  placeholder={ph.location || 'Enter your address or location'}
                  required
                />
              </div>
              <div className="mt-4 flex min-h-0 flex-1 flex-col sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-bold text-[#0b2540]">
                  {labels.message || 'Your Requirements'} *
                </label>
                <textarea
                  required
                  placeholder={ph.message}
                  className="min-h-[120px] w-full flex-1 rounded-xl border border-[#e5e9ee] bg-white px-4 py-3 text-[13px] text-[#0b2540] outline-none focus:border-[#1B8A3E]"
                />
              </div>
              </>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#1B8A3E] text-[13px] font-bold text-white hover:bg-[#146C31] sm:h-[50px] sm:text-[14px]"
            >
              {data.form.button_text}
              <ArrowRight size={16} strokeWidth={2.6} />
            </motion.button>
            <p className="mt-3 flex items-start justify-center gap-2 px-1 text-center text-[11px] leading-relaxed text-[#7a8190] sm:items-center sm:text-[12px]">
              <Lock size={13} className="mt-0.5 shrink-0 sm:mt-0" />
              {data.form.footer_text}
            </p>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:h-full"
          >
            <div className="relative mb-4 sm:mb-5 lg:min-h-0 lg:flex-1">
              <div className="overflow-hidden rounded-[18px] sm:rounded-[22px] lg:h-full">
                <motion.img
                  src={data.image}
                  alt=""
                  initial={{ scale: 1.06, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={inView}
                  transition={{ duration: 0.7 }}
                  className="block h-[220px] w-full object-cover object-[center_center] sm:h-[300px] lg:h-full lg:min-h-[360px]"
                />
              </div>
              {data.info_card && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ delay: 0.25, duration: 0.45 }}
                  className="absolute bottom-3 right-3 w-[148px] rounded-[14px] bg-[#0b2540] px-3.5 py-3.5 text-white shadow-[0_16px_40px_rgba(6,20,40,0.35)] sm:bottom-5 sm:right-4 sm:w-[196px] sm:rounded-[16px] sm:px-5 sm:py-5"
                >
                  <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1B8A3E] sm:mb-2.5 sm:h-9 sm:w-9">
                    <Zap size={14} className="text-white" fill="currentColor" />
                  </span>
                  <h4 className="text-[13px] font-extrabold leading-[1.25] sm:text-[17px]">
                    {data.info_card.title}
                  </h4>
                  <span className="mb-2 mt-2 block h-[2px] w-7 rounded-full bg-[#1B8A3E] sm:mb-2.5 sm:mt-2.5 sm:w-8" />
                  <p className="text-[10px] leading-[1.55] text-white/75 sm:text-[12px]">
                    {data.info_card.description}
                  </p>
                </motion.div>
              )}
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-auto grid grid-cols-2 gap-2.5 sm:gap-3"
            >
              {data.features.map((f) => {
                const Icon =
                  (LucideIcons as unknown as Record<string, React.ElementType>)[f.icon] || Headset;
                return (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 rounded-[16px] bg-[#eef8f3] p-3.5 sm:gap-4 sm:rounded-[20px] sm:p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d8f3e4] text-[#1B8A3E] sm:h-[52px] sm:w-[52px]">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h4 className="mb-0.5 text-[14px] font-extrabold text-[#0b2540] sm:text-[16px]">
                        {f.title}
                      </h4>
                      <p className="text-[12px] leading-relaxed text-[#6b7285] sm:text-[13px]">
                        {f.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  placeholder,
  required,
  type = 'text',
  inputMode,
  pattern,
  maxLength,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  maxLength?: number;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const Icon = fieldIcon[icon] || User;
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-bold text-[#0b2540]">{label}</label>
      <div className="relative">
        <Icon
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
        />
        <input
          required={required}
          type={type}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[#e5e9ee] bg-white pl-11 pr-4 text-[13px] text-[#0b2540] outline-none focus:border-[#1B8A3E]"
        />
      </div>
    </div>
  );
}
