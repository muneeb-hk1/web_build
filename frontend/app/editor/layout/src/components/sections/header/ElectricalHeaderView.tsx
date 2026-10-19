"use client";

import Link, { useElectricalPath } from "./ElectricalLink";
import { useOptionalPreview } from "../../context/PreviewContext";
import React, { useState } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { ArrowRight, ChevronDown, X } from 'lucide-react';
import { HeaderProps, LinkType } from "./electricalTypes";
import { getActiveMenuItemStyle, type HeaderActiveMenuStyle } from "./activeMenuStyles";
export default function Header({ data }: HeaderProps) {
  const pathname = useElectricalPath();
  const preview = useOptionalPreview();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<number, boolean>>({});

  const isLinkActive = (href: string) => {
    const target = (href || "").trim().toLowerCase();
    const current = (pathname || "/").trim().toLowerCase();
    const isHomeTarget = target === "/" || target === "#" || target === "#page-home" || target.endsWith("/home");
    const isHomeCurrent = current === "/" || current === "/home" || current === "#page-home";
    if (isHomeTarget) return isHomeCurrent;
    return current === target || current.startsWith(target);
  };

  const mobileMenuVariants: Variants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], when: 'beforeChildren' },
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
  };

  const mobileListVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  };

  const mobileItemVariants: Variants = {
    hidden: { opacity: 0, x: -18 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: 'easeOut' } },
  };

  const logoText =
    (typeof (data as { logo?: string }).logo === "string" && (data as { logo?: string }).logo) ||
    data.logo_text;
  const logoImage =
    (data as { logoImage?: string }).logoImage || data.logo_image || "/categories/electrical/logo/logo.png";
  const logoTitle = (data as { logoImageTitle?: string }).logoImageTitle || logoText;
  const logoDisplay =
    (data as { logoDisplay?: string }).logoDisplay || (logoImage ? "image" : "text");
  const showLogoText = logoDisplay === "text" || logoDisplay === "both";
  const showLogoImage = logoDisplay !== "text" && Boolean(logoImage);

  const designLinks = (data as { links?: { name?: string; href?: string; sublinks?: { name?: string; href?: string }[] }[] }).links;
  const headerNavOrder = ["home", "about", "services", "gallery", "contact"] as const;
  const headerNavLabels: Record<(typeof headerNavOrder)[number], string> = {
    home: "Home",
    about: "About",
    services: "Services",
    gallery: "Gallery",
    contact: "Contact",
  };
  const headerNavHrefs: Record<(typeof headerNavOrder)[number], string> = {
    home: "/",
    about: "/about",
    services: "/services",
    gallery: "/gallery",
    contact: "/contact",
  };
  const navSlug = (href: string, name: string) => {
    const raw = (href || "").trim().toLowerCase();
    const fromPage = raw.match(/#page-([^/?#]+)/)?.[1];
    const path = (fromPage || raw.replace(/^\/+/, "").split(/[/?#]/)[0] || "").replace(/\/+$/, "");
    if (!path || path === "#" || path === "index") return name.trim().toLowerCase() === "home" ? "home" : path || "home";
    if (path === "contact-us") return "contact";
    if (path === "about-us") return "about";
    return path;
  };
  const designNav: LinkType[] = Array.isArray(designLinks)
    ? designLinks.map((item) => ({
        name: item.name || "",
        href: item.href || "/",
        sublinks: (item.sublinks || []).map((child) => ({
          name: child.name || "",
          href: child.href || "/",
        })),
      }))
    : [];
  const canonicalNav = (value: string) => {
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
  const pageLinkVisible = (name: string, href: string) => {
    const links = preview?.pageLinks ?? [];
    if (!links.length) return true;
    const slug = canonicalNav(navSlug(href, name) || name);
    const flat = links.flatMap(function walk(link): NonNullable<typeof preview>["pageLinks"] {
      return [link, ...(link.children || []).flatMap(walk)];
    });
    const matches = flat.filter((link) => {
      const linkSlug = canonicalNav(navSlug(link.href || "", link.label || ""));
      const linkLabel = canonicalNav(link.label || "");
      return linkSlug === slug || linkLabel === slug;
    });
    if (!matches.length) return false;
    return matches.some((link) => link.hidden !== true);
  };
  const orderedLinks: LinkType[] = headerNavOrder
    .filter((slug) => pageLinkVisible(headerNavLabels[slug], headerNavHrefs[slug]))
    .map((slug) => ({
      name: headerNavLabels[slug],
      href: headerNavHrefs[slug],
    }));
  const navLinks = designNav.length ? designNav : orderedLinks;

  const settings = data as {
    headerBackgroundType?: "solid" | "gradient";
    headerBackgroundColor?: string;
    headerGradientColor?: string;
    headerTextColor?: string;
    headerType?: "scroll" | "sticky";
    headerActiveMenuStyle?: HeaderActiveMenuStyle;
    headerActiveTextColor?: string;
    headerActiveBackgroundColor?: string;
    headerActiveKeepTextColor?: boolean;
    headerActiveLineGap?: number;
    headerActiveMenuPadding?: number;
    buttons?: { label?: string; href?: string }[];
  };
  const headerBackground =
    settings.headerBackgroundType === "gradient"
      ? `linear-gradient(90deg, ${settings.headerBackgroundColor ?? "#245c6e"}, ${settings.headerGradientColor ?? "#0668ff"})`
      : settings.headerBackgroundColor;
  const headerTextColor = settings.headerTextColor;
  const isSticky = settings.headerType !== "scroll";
  const activeMenuStyle = settings.headerActiveMenuStyle;
  const activeMenuStyleProps = (isItemActive: boolean) =>
    isItemActive && activeMenuStyle
      ? getActiveMenuItemStyle(
          activeMenuStyle,
          settings.headerActiveTextColor ?? "#ffffff",
          settings.headerActiveBackgroundColor ?? "#2563eb",
          {
            keepTextColor: settings.headerActiveKeepTextColor ?? false,
            defaultTextColor: headerTextColor ?? "#1f2937",
            lineGap: settings.headerActiveLineGap,
            menuPadding: settings.headerActiveMenuPadding,
          },
        )
      : undefined;
  const quoteHref =
    preview?.pageLinks.find((link) => {
      const label = (link.label || "").trim().toLowerCase();
      const href = (link.href || "").trim().toLowerCase();
      return label === "get a quote" || href.includes("get-a-quote") || href.includes("quote");
    })?.href || "/get-a-quote";
  const buttonText = (data as { button_text?: string }).button_text;
  const buttonLink = (data as { button_link?: string }).button_link;
  const savedButtons = (settings.buttons || []).filter((button) => (button.label || "").trim());
  const ctaButtons = (buttonText || "").trim()
    ? [{ label: buttonText.trim(), href: buttonLink || quoteHref }]
    : savedButtons.length
      ? savedButtons.map((button) => ({
          label: button.label || "",
          href: button.href || quoteHref,
        }))
      : [{ label: "Get a Quote", href: quoteHref }];

  return (
    <header
      className={`${isSticky ? "sticky" : "relative"} top-0 z-50 w-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] ${headerBackground ? "" : "bg-white"}`}
      style={headerBackground ? { background: headerBackground, color: headerTextColor } : undefined}
    >
      <div className="relative mx-auto hidden h-[84px] max-w-[1280px] items-center px-5 sm:px-8 md:flex">
        <Link href="/" className="relative z-10 flex shrink-0 items-center gap-2">
          {showLogoImage ? (
            <img
              src={logoImage}
              alt={logoTitle}
              className="h-[64px] w-auto object-contain"
            />
          ) : null}
          {showLogoText ? (
            <span className="text-[22px] font-extrabold text-[#0b2540]">{logoText}</span>
          ) : null}
        </Link>

        <nav className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6">
          {navLinks.map((link, idx) => {
            const hasDropdown = !!link.sublinks?.length;
            const active = isLinkActive(link.href);
            const hovered = hoveredIndex === idx;
            return (
              <div
                key={link.name}
                className="relative flex items-center py-1"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <motion.div whileHover={{ y: -1 }} transition={{ type: 'spring', stiffness: 400, damping: 24 }}>
                  <Link
                    href={link.href}
                    className={`relative inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[16px] font-extrabold leading-none transition-colors duration-200 ${
                      activeMenuStyle
                        ? ""
                        : active || hovered
                          ? "text-[#1B8A3E]"
                          : "text-[#1f2937]"
                    }`}
                    style={{
                      ...(headerTextColor && !activeMenuStyle ? { color: headerTextColor } : {}),
                      ...activeMenuStyleProps(active),
                    }}
                  >
                    {link.name}
                    {hasDropdown && (
                      <motion.span animate={{ rotate: hovered ? 180 : 0 }} transition={{ duration: 0.22 }}>
                        <ChevronDown size={15} strokeWidth={2.2} className="mt-[1px]" />
                      </motion.span>
                    )}
                    {!activeMenuStyle && (
                      <span
                        className={`absolute -bottom-[10px] left-0 h-[3px] rounded-full bg-[#1B8A3E] transition-all duration-200 ${
                          active || hovered ? "w-full" : "w-0"
                        }`}
                      />
                    )}
                  </Link>
                </motion.div>

                <AnimatePresence>
                  {hasDropdown && hovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute left-0 top-full z-50 min-w-[230px] origin-top border-t-[3px] border-[#1B8A3E] bg-white py-2 shadow-xl"
                    >
                      {link.sublinks!.map((sub, sIdx) => (
                        <motion.div
                          key={sub.href}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * sIdx, duration: 0.2 }}
                        >
                          <Link
                            href={sub.href}
                            className="block px-5 py-2.5 text-[15px] font-extrabold text-[#334155] transition-colors duration-200 hover:bg-[#1B8A3E] hover:text-white"
                          >
                            {sub.name}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-2">
          {ctaButtons.map((button, index) => (
            <motion.div key={`${button.href}-${index}`} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={button.href || "/"}
                className="inline-flex h-[44px] items-center justify-center gap-[8px] rounded-full bg-[#1B8A3E] px-[28px] text-[13px] font-bold uppercase tracking-[0.6px] text-white shadow-[0_6px_16px_rgba(27,138,62,0.28)] hover:bg-[#146C31]"
              >
                {button.label}
                <ArrowRight size={15} strokeWidth={2.6} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className={`relative z-20 flex min-h-[64px] items-center justify-between gap-2 px-4 py-2 md:hidden ${headerBackground ? "" : "bg-white"}`}
        style={headerBackground ? { background: headerBackground } : undefined}
      >
        <Link href="/" className="flex min-w-0 shrink items-center gap-2">
          {showLogoImage ? (
            <img src={logoImage} alt={logoTitle} className="h-[48px] w-auto object-contain" />
          ) : null}
          {showLogoText ? (
            <span className="truncate text-[16px] font-extrabold text-[#0b2540]">{logoText}</span>
          ) : null}
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          {ctaButtons.map((button, index) => (
            <Link
              key={`${button.href}-mobile-${index}`}
              href={button.href || "/"}
              className="relative z-10 inline-flex h-[36px] items-center justify-center rounded-full bg-[#1B8A3E] px-3 text-[11px] font-bold uppercase tracking-[0.4px] text-white"
            >
              {button.label}
            </Link>
          ))}
          <motion.button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.94 }}
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center p-0"
          >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <X className="text-[#111827]" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex w-[22px] flex-col gap-[5px]"
              >
                <span className="h-[2px] rounded-full bg-[#111827]" />
                <span className="h-[2px] rounded-full bg-[#111827]" />
                <span className="h-[2px] rounded-full bg-[#111827]" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden bg-[#06243b] md:hidden"
          >
            <motion.nav variants={mobileListVariants} className="flex flex-col">
              {navLinks.map((link, idx) => {
                const hasDropdown = !!link.sublinks?.length;
                const isOpen = openMobileDropdowns[idx];
                return (
                  <motion.div key={link.name} variants={mobileItemVariants} className="border-b border-white/10">
                    <div className="flex items-center justify-between text-white">
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 px-5 py-3.5 font-extrabold"
                      >
                        {link.name}
                      </Link>
                      {hasDropdown && (
                        <button
                          className="px-5 py-3.5"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenMobileDropdowns((p) => ({ ...p, [idx]: !p[idx] }));
                          }}
                        >
                          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="block">
                            <ChevronDown size={16} />
                          </motion.span>
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {hasDropdown && isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden bg-black/20"
                        >
                          <div className="pb-2">
                            {link.sublinks!.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-8 py-2 text-white/80"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
