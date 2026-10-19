'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useElectricalNavigate } from '../header/ElectricalLink';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  Send,
  Settings,
  User,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ContactProps } from '../header/electricalTypes';
import { fadeUp, inView, stagger } from '../header/electricalMotion';

const cardIcons: Record<string, React.ElementType> = {
  MapPin,
  Phone,
  Mail,
  Clock,
};

const fieldIcon: Record<string, React.ElementType> = {
  name: User,
  email: Mail,
  phone: Phone,
  service: Settings,
  location: MapPin,
};

export default function Contact({ data, services = [] }: ContactProps) {
  const goTo = useElectricalNavigate();
  const [service, setService] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
    if (!service || phone.length < 10 || !agreed) return;
    goTo('/thank-you');
  };

  return (
    <section className="bg-white py-10 sm:py-[52px] lg:py-[60px]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {data.cards.map((c) => {
            const Icon = cardIcons[c.icon] || MapPin;
            const inner = (
              <>
                <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#1B8A3E] text-white shadow-[0_8px_16px_rgba(27,138,62),0.28)]">
                  <Icon size={26} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] font-extrabold leading-tight text-[#0b2540] sm:text-[20px]">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-[16px] leading-[1.45] text-[#4b5563]">{c.value}</p>
                  <p className="mt-0.5 min-h-[22px] text-[15px] leading-snug text-[#6b7285]">
                    {c.value_line2 || '\u00a0'}
                  </p>
                </div>
              </>
            );
            return (
              <motion.div
                key={c.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="flex h-full items-start gap-4 rounded-[20px] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,40,70,0.08)] sm:px-6 sm:py-6"
              >
                {c.href ? (
                  <a href={c.href} className="flex w-full items-start gap-4">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col rounded-[24px] bg-[#f4f7f8] p-5 sm:p-8"
          >
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
            >
              <motion.div variants={fadeUp} className="mb-2 flex items-center gap-3">
                <span className="h-[2px] w-7 rounded-full bg-[#1B8A3E]" />
                <p className="text-[12px] font-extrabold tracking-[1.6px] text-[#1B8A3E]">
                  {data.form.subtitle}
                </p>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-[28px] font-extrabold leading-tight text-[#0b2540] sm:text-[36px]"
              >
                Get In <span className="text-[#1B8A3E]">Touch</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mb-6 mt-2 max-w-[520px] text-[13px] leading-[1.7] text-[#7a8190] sm:text-[15px]"
              >
                {data.form.description}
              </motion.p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field icon="name" placeholder={`${ph.name} *`} required />
              <Field icon="email" type="email" placeholder={`${ph.email} *`} required />
              <Field
                icon="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 10))}
                placeholder={`${ph.phone} *`}
                required
              />
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
                  {service || `${ph.service} *`}
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
                            service === s.title
                              ? 'bg-[#1B8A3E] text-white'
                              : 'text-[#334155] hover:bg-[#eef8f1] hover:text-[#1B8A3E]'
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

            <div className="mt-4">
              <Field icon="location" placeholder={ph.location || 'Your Location'} />
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col">
              <div className="relative flex min-h-0 flex-1 flex-col">
                <FileText
                  size={16}
                  className="pointer-events-none absolute left-4 top-4 z-10 text-[#94a3b8]"
                />
                <textarea
                  required
                  placeholder={`${ph.message} *`}
                  className="min-h-[120px] w-full flex-1 rounded-xl border border-[#e5e9ee] bg-white py-3 pl-11 pr-4 text-[13px] outline-none focus:border-[#1B8A3E]"
                />
              </div>
            </div>

            {data.form.checkbox_text && (
              <label className="mt-4 flex items-start gap-2 text-[13px] text-[#4b5563]">
                <input
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#1B8A3E]"
                />
                {data.form.checkbox_text}
              </label>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-5 inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#1B8A3E] text-[13px] font-bold uppercase tracking-[0.4px] text-white hover:bg-[#146C31]"
            >
              {data.form.button_text}
              <Send size={15} />
            </motion.button>
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-[12px] text-[#7a8190]">
              <Lock size={13} />
              {data.form.footer_text}
            </p>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col"
          >
            <div className="relative mb-4 min-h-[240px] flex-1 overflow-hidden rounded-[22px] sm:min-h-[280px]">
              <motion.img
                src={data.center.image}
                alt=""
                initial={{ scale: 1.08, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={inView}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover object-[center_top]"
              />
              <motion.div
                initial={{ opacity: 0, x: 36, y: '-50%' }}
                whileInView={{ opacity: 1, x: 0, y: '-50%' }}
                viewport={inView}
                transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-4 top-1/2 w-[168px] rounded-[18px] bg-[#0b2540] px-4 py-7 text-center text-white shadow-[0_18px_40px_rgba(6,20,40,0.4)] sm:right-6 sm:w-[220px] sm:rounded-[20px] sm:px-6 sm:py-9"
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="font-serif text-[34px] italic leading-[0.95] sm:text-[40px]"
                >
                  {data.center.title || "Let's"}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="font-serif text-[34px] italic leading-[0.95] sm:text-[40px]"
                >
                  {data.center.title_highlight || 'Connect'}
                </motion.p>
                <svg
                  viewBox="0 0 120 14"
                  className="mx-auto mt-1 h-[10px] w-[92px] sm:h-[12px] sm:w-[108px]"
                  fill="none"
                  aria-hidden
                >
                  <motion.path
                    d="M4 9C28 3 88 3 116 9"
                    stroke="#1B8A3E"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={inView}
                    transition={{ delay: 0.62, duration: 0.55, ease: 'easeOut' }}
                  />
                </svg>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inView}
                  transition={{ delay: 0.72, duration: 0.4 }}
                  className="mt-4 text-[12px] leading-[1.55] text-white/90 sm:text-[14px]"
                >
                  Your Trusted Partner
                  <br />
                  for Electrical Solutions
                </motion.p>
              </motion.div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="mt-auto grid grid-cols-2 gap-3"
            >
              {(data.features || []).map((f) => {
                const Icon =
                  (LucideIcons as unknown as Record<string, React.ElementType>)[f.icon] || Clock;
                return (
                  <motion.div
                    key={f.title}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="flex items-start gap-3 rounded-[18px] bg-white p-4 shadow-[0_8px_24px_rgba(15,40,70,0.06)] sm:gap-4 sm:p-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f6ee] text-[#1B8A3E] sm:h-[54px] sm:w-[54px]">
                      <Icon size={24} strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <h4 className="text-[14px] font-extrabold text-[#0b2540] sm:text-[15px]">
                        {f.title}
                      </h4>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-[#6b7285] sm:text-[13px]">
                        {f.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 overflow-hidden rounded-[22px]"
        >
          <iframe
            src={data.map.embed_url}
            className="h-[280px] w-full border-0 sm:h-[380px]"
            title={data.map.label}
            loading="lazy"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  icon,
  placeholder,
  required,
  type = 'text',
  inputMode,
  maxLength,
  value,
  onChange,
}: {
  icon: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const Icon = fieldIcon[icon] || User;
  return (
    <div className="relative">
      <Icon
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]"
      />
      <input
        required={required}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[#e5e9ee] bg-white pl-11 pr-4 text-[13px] outline-none focus:border-[#1B8A3E]"
      />
    </div>
  );
}
