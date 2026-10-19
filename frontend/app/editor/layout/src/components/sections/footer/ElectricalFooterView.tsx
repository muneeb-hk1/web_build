"use client";

import React, { useState } from 'react';
import Link from '../header/ElectricalLink';
import { useOptionalPreview } from '../../context/PreviewContext';
import { AnimatePresence, motion } from 'framer-motion';
import { FooterProps } from '../header/electricalTypes';
import { MapPin, Phone, Mail, Clock, Zap, ChevronRight, ChevronDown } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { electricalNavHasItems } from '../../../data/electricalNavContent';

const socialIconMap: Record<string, React.ElementType> = {
  Facebook: FaFacebookF,
  Twitter: FaXTwitter,
  Instagram: FaInstagram,
  Linkedin: FaLinkedinIn,
  Youtube: FaYoutube,
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function LinkColumn({
  title,
  links,
  group,
  open,
  onToggle,
}: {
  title: string;
  links: { name: string; href: string; sourceIndex?: number }[];
  group: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div variants={fadeUp} className="w-full max-w-full border-b border-white/10 md:w-max md:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3.5 text-left md:pointer-events-none md:cursor-default md:py-0"
        aria-expanded={open}
      >
        <span>
          <h3 className="text-[16px] font-bold text-white">{title}</h3>
          <span className="mt-2 hidden h-[3px] w-9 rounded-full bg-[#1B8A3E] md:block" />
        </span>
        <ChevronDown
          size={18}
          className={`text-[#1B8A3E] transition-transform duration-300 md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="hidden md:block">
        <ul className="mt-5 space-y-5" data-footer-link-list="" data-footer-link-group={group}>
          {links.map((l) => (
            <li
              key={`${l.name}-${l.sourceIndex ?? l.href}`}
              {...(l.sourceIndex === undefined
                ? {}
                : {
                    "data-footer-link-item": "",
                    "data-footer-link-group": group,
                    "data-footer-link-index": String(l.sourceIndex),
                  })}
            >
              <Link
                href={l.href}
                className="group flex items-center gap-1.5 text-[13.5px] text-white/85 transition-colors hover:text-[#1B8A3E]"
              >
                <ChevronRight
                  size={14}
                  className="shrink-0 text-[#1B8A3E] transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.6}
                />
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="space-y-4 overflow-hidden pb-3.5 md:hidden"
            data-footer-link-list=""
            data-footer-link-group={group}
          >
            {links.map((l) => (
              <li
                key={`${l.name}-${l.sourceIndex ?? l.href}`}
                {...(l.sourceIndex === undefined
                  ? {}
                  : {
                      "data-footer-link-item": "",
                      "data-footer-link-group": group,
                      "data-footer-link-index": String(l.sourceIndex),
                    })}
              >
                <Link
                  href={l.href}
                  className="group flex items-center gap-1.5 text-[13.5px] text-white/85 transition-colors hover:text-[#1B8A3E]"
                >
                  <ChevronRight
                    size={14}
                    className="shrink-0 text-[#1B8A3E]"
                    strokeWidth={2.6}
                  />
                  {l.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Footer({ data }: FooterProps) {
  const preview = useOptionalPreview();
  const [openAcc, setOpenAcc] = useState<string | null>(null);
  const bottomLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Sitemap', href: '/sitemap' },
  ];

  const contacts = [
    { icon: Phone, label: 'Call Us', value: data.contact.phone },
    { icon: Mail, label: 'Email Us', value: data.contact.email },
    { icon: MapPin, label: 'Our Location', value: data.contact.address },
    { icon: Clock, label: 'Working Hours', value: data.contact.hours },
  ];

  const backgroundType = (data as { footerBackgroundType?: "default" | "solid" | "gradient" }).footerBackgroundType ?? "default";
  const solidColor = (data as { footerBackgroundColor?: string }).footerBackgroundColor || "#0d1f2a";
  const gradientColor = (data as { footerGradientColor?: string }).footerGradientColor || "#1d4ed8";
  const textColor = (data as { footerTextColor?: string }).footerTextColor;
  const customBackground =
    backgroundType === "gradient"
      ? `linear-gradient(90deg, ${solidColor}, ${gradientColor})`
      : backgroundType === "solid"
        ? solidColor
        : undefined;

  return (
    <footer
      className={`relative overflow-hidden text-white ${customBackground ? "" : "bg-[#05203a]"}`}
      style={customBackground ? { background: customBackground, color: textColor || "#ffffff" } : undefined}
    >
      <motion.div
        aria-hidden
        animate={{ opacity: [0.08, 0.16, 0.08], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-6 top-6 hidden text-[#1a4a6e] md:block"
      >
        <Zap size={220} strokeWidth={1.1} />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-12 sm:px-8 md:flex-row md:items-start md:justify-between md:gap-14"
      >
        <motion.div variants={fadeUp} className="md:max-w-[250px] md:shrink-0">
          <Link href="/" className="mb-1.5 inline-block">
            <img
              src={
                (() => {
                  const saved =
                    (data as { logoImage?: string; logo_image?: string }).logoImage ||
                    (data as { logo_image?: string }).logo_image ||
                    "";
                  return saved.includes("/categories/electrical/logo/logo")
                    ? saved
                    : "/categories/electrical/logo/logo.png";
                })()
              }
              alt={data.logo_text || 'ElectroCare'}
              data-editor-media=""
              data-editor-media-role="logo"
              className="h-[62px] w-auto object-contain"
            />
          </Link>
          <p className="mb-2 max-w-[270px] text-[13.5px] leading-[1.6] text-white/80">{data.description}</p>
          <p className="relative mb-3.5 inline-block font-serif text-[15px] italic text-white/95">
            Safe Power. Brighter Tomorrow.
            <span className="absolute -bottom-0.5 left-10 h-[2px] w-[62px] rounded-full bg-[#1B8A3E]/90" />
          </p>
          <div className="flex gap-2.5">
            {data.socials.map((s, i) => {
              const Icon = socialIconMap[s.icon] || FaFacebookF;
              return (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.icon}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-[#1B8A3E] hover:bg-[#1B8A3E]"
                >
                  <Icon size={13} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <div className="w-full max-w-full md:flex md:w-auto md:flex-1 md:justify-between md:gap-x-16 md:px-6">
          <LinkColumn
            title="Quick Links"
            group="quick_links"
            links={(() => {
              const canonical = (value: string) => {
                const slug = value.trim().toLowerCase();
                if (slug === "service" || slug === "services") return "service";
                if (slug === "team" || slug === "teams") return "team";
                if (slug === "blog" || slug === "blogs") return "blog";
                if (slug === "event" || slug === "events") return "event";
                if (slug === "gallery" || slug === "galleries") return "gallery";
                if (slug === "about" || slug === "about-us") return "about";
                if (slug === "contact" || slug === "contact-us") return "contact";
                if (slug === "home" || slug === "index") return "home";
                return slug;
              };
              const linkVisible = (name: string, href: string) => {
                const links = preview?.pageLinks ?? [];
                if (!links.length) return true;
                const slug = canonical(
                  (href || "").replace(/^#page-/i, "").replace(/^\//, "").split(/[/?#]/)[0] || name,
                );
                const flat = links.flatMap(function walk(link): NonNullable<typeof preview>["pageLinks"] {
                  return [link, ...(link.children || []).flatMap(walk)];
                });
                const matches = flat.filter((link) => {
                  const hrefSlug = canonical(
                    (link.href || "").replace(/^#page-/i, "").replace(/^\//, "").split(/[/?#]/)[0] || "",
                  );
                  return hrefSlug === slug || canonical(link.label || "") === slug;
                });
                if (!matches.length) return true;
                return matches.some((link) => link.hidden !== true);
              };
              const contentKey = (name: string, href: string) => {
                const slug = canonical(
                  (href || "").replace(/^#page-/i, "").replace(/^\//, "").split(/[/?#]/)[0] || name,
                );
                if (slug === "blog" || slug === "blogs") return "blogs" as const;
                if (slug === "event" || slug === "events") return "events" as const;
                if (slug === "team" || slug === "teams") return "teams" as const;
                if (slug === "portfolio") return "portfolio" as const;
                return null;
              };
              const base = (data.quick_links || []).map((link, index) => ({ ...link, sourceIndex: index })).filter((link) => {
                const key = contentKey(link.name, link.href);
                if (key && !electricalNavHasItems(key)) return false;
                return linkVisible(link.name, link.href);
              });
              const extras = [
                { name: "Blogs", href: "#page-blogs", key: "blogs" as const },
                { name: "Events", href: "#page-events", key: "events" as const },
                { name: "Team", href: "#page-teams", key: "teams" as const },
                { name: "Portfolio", href: "#page-portfolio", key: "portfolio" as const },
              ].filter(
                (item) =>
                  electricalNavHasItems(item.key) &&
                  linkVisible(item.name, item.href) &&
                  !base.some((link) => link.name.trim().toLowerCase() === item.name.toLowerCase()),
              );
              return extras.length
                ? [...base, ...extras.map(({ name, href }) => ({ name, href }))]
                : base;
            })()}
            open={openAcc === 'Quick Links'}
            onToggle={() => setOpenAcc((v) => (v === 'Quick Links' ? null : 'Quick Links'))}
          />
          <LinkColumn
            title="Our Services"
            group="our_services"
            links={(data.our_services || []).map((link, index) => ({ ...link, sourceIndex: index }))}
            open={openAcc === 'Our Services'}
            onToggle={() => setOpenAcc((v) => (v === 'Our Services' ? null : 'Our Services'))}
          />
        </div>

        <motion.div
          variants={fadeUp}
          className="w-max space-y-7 border-white/15 md:shrink-0 md:border-l md:pl-12"
        >
          {contacts.map((item) => (
            <motion.div
              key={item.label}
              className="flex items-start gap-3.5"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#1B8A3E] text-white">
                <item.icon size={20} strokeWidth={2} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[13px] leading-tight text-white/75">{item.label}</p>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug text-white">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div
        className={`relative text-white ${customBackground ? "" : "bg-[#1B8A3E]"}`}
        style={customBackground ? { background: customBackground, color: textColor || "#ffffff" } : undefined}
      >
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-5 py-3.5 text-[13px] font-medium sm:flex-row sm:px-8">
          <p>{data.copyright}</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            {bottomLinks.map((l, i) => (
              <React.Fragment key={l.name}>
                {i > 0 && <span className="opacity-70">|</span>}
                <Link href={l.href} className="transition-opacity hover:opacity-80">
                  {l.name}
                </Link>
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
