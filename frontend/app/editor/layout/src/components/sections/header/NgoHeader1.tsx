"use client";

import React, { useState, useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, ChevronDown, Menu, X, Heart, ChevronRight } from "lucide-react";
import { site, type NGOHeaderData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import { useOptionalPreview } from "../../context/PreviewContext";

const normalizeNavSlug = (value: string) => {
  const slug = (value || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (slug === "about-us" || slug === "overview") return "about";
  if (slug === "contact-us") return "contact";
  if (slug === "our-projects" || slug === "project") return "projects";
  if (slug === "service" || slug === "activity" || slug === "activities") {
    return "service";
  }
  if (slug === "awards") return "award";
  if (slug === "event") return "events";
  return slug;
};

const getHrefSlug = (href: string) => {
  const raw = (href || "").trim();
  const hash = raw.includes("#") ? raw.split("#")[1] || "" : "";
  const value = raw.split(/[?#]/, 1)[0].trim();
  if (
    !value ||
    value === "/" ||
    value === "#" ||
    hash.toLowerCase() === "home" ||
    hash.toLowerCase() === "page-home"
  ) {
    return "home";
  }
  if (value.toLowerCase().startsWith("#page-")) {
    return normalizeNavSlug(value.slice(6).replace(/^\/+|\/+$/g, ""));
  }
  return normalizeNavSlug(
    value.replace(/^\/+|\/+$/g, "").split("/")[0] || "",
  );
};

const getPageLabelFromHref = (href: string, fallback: string) => {
  const slug = getHrefSlug(href);
  if (!slug) return "Home";

  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase()) || fallback;
};

const flattenPreviewLinks = (
  links: Array<{ label?: string; href?: string; children?: unknown[] }> = [],
): Array<{ label?: string; href?: string; children?: unknown[] }> =>
  links.flatMap((link) => [
    link,
    ...flattenPreviewLinks(
      (link.children as Array<{ label?: string; href?: string; children?: unknown[] }>) ||
        [],
    ),
  ]);

const resolvePreviewPageName = (
  href: string,
  label: string,
  pageLinks?: Array<{ label?: string; href?: string; children?: unknown[] }>,
) => {
  const slug = getHrefSlug(href);
  const labelSlug = normalizeNavSlug(label);
  const match = flattenPreviewLinks(pageLinks).find((link) => {
    const linkLabel = (link.label || "").trim();
    const linkSlug = getHrefSlug(link.href || "");
    const linkLabelSlug = normalizeNavSlug(linkLabel);
    return (
      (slug &&
        (linkSlug === slug ||
          linkLabelSlug === slug ||
          linkLabelSlug.endsWith(slug))) ||
      (labelSlug &&
        (linkLabelSlug === labelSlug ||
          linkSlug === labelSlug ||
          linkLabelSlug.endsWith(labelSlug)))
    );
  });
  return match?.label || (labelSlug === "about" ? "About" : label) || getPageLabelFromHref(href, label);
};

const scrollTemplateToTop = () => {
  const scrollContainer = document.querySelector<HTMLElement>(
    "[data-template-scroll]",
  );

  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function NgoHeader1({ data: customData }: SectionProps) {
  const data: NGOHeaderData =
    (customData as unknown as NGOHeaderData | undefined) ?? site.header;
  const siteInfo = data.site ?? site.header.site;
  const rawLogo =
    (typeof data.logoImage === "string" && data.logoImage.trim()) ||
    (typeof siteInfo?.logo?.light === "string" && siteInfo.logo.light.trim()) ||
    "";
  const logoSrc = rawLogo.includes("/categories/ngo/template1/logo.png")
    ? "/categories/ngo/template1/logo2.png"
    : rawLogo || "/categories/ngo/template1/logo2.png";
  const pathname = usePathname();
  const preview = useOptionalPreview();
  const sticky = data.headerType !== "scroll";
  const textColor = data.headerTextColor ?? "#ffffff";
  const background = data.headerBackgroundType === "gradient"
    ? `linear-gradient(90deg, ${data.headerBackgroundColor ?? "#000000"}, ${data.headerGradientColor ?? "#0668ff"})`
    : data.headerBackgroundColor;
  const isLightTone = (color?: string) => {
    if (!color) return false;
    const value = color.trim().toLowerCase();
    return (
      value === "transparent" ||
      value === "#fff" ||
      value === "#ffffff" ||
      value === "white"
    );
  };
  const solidBackground =
    !background ||
    background === "transparent" ||
    (isLightTone(background) && isLightTone(textColor))
      ? undefined
      : background;
  const menu = data.nav ?? site.header.nav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(
    null
  );
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const closeDesktopMenuTimer = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const keepDesktopMenu = (label: string) => {
    if (closeDesktopMenuTimer.current != null) {
      window.clearTimeout(closeDesktopMenuTimer.current);
      closeDesktopMenuTimer.current = null;
    }
    setOpenDesktopMenu(label);
  };

  const releaseDesktopMenu = () => {
    if (closeDesktopMenuTimer.current != null) {
      window.clearTimeout(closeDesktopMenuTimer.current);
    }
    closeDesktopMenuTimer.current = window.setTimeout(() => {
      setOpenDesktopMenu(null);
      closeDesktopMenuTimer.current = null;
    }, 180);
  };

  const closeDesktopMenuNow = () => {
    if (closeDesktopMenuTimer.current != null) {
      window.clearTimeout(closeDesktopMenuTimer.current);
      closeDesktopMenuTimer.current = null;
    }
    setOpenDesktopMenu(null);
  };

  /** Keep open only when the body-portaled edit chip belongs to this menu. */
  const isEditChipBridgeForMenu = (menuEl: Element | null) => {
    if (!menuEl) return false;
    return Boolean(menuEl.querySelector('[data-editor-link-nav="true"]'));
  };

  const getOpenMenuEl = (label: string) =>
    headerRef.current?.querySelector(
      `[data-editor-nav-menu="${CSS.escape(label)}"]`,
    ) ?? null;

  // Handle sticky scroll background blur
  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      "[data-template-scroll]",
    );
    const scrollTarget: Window | HTMLElement = scrollContainer ?? window;
    const handleScroll = () => {
      const scrollTop = scrollContainer?.scrollTop ?? window.scrollY;
      const next = scrollTop > 20;
      setIsScrolled((current) => (current === next ? current : next));
    };

    handleScroll();
    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeDesktopMenuTimer.current != null) {
        window.clearTimeout(closeDesktopMenuTimer.current);
      }
    };
  }, []);

  // Edit chips portal to document.body. Keep About open only while the pointer
  // is on About's own group/chip — not while hovering Gallery/other nav chips.
  useEffect(() => {
    if (!openDesktopMenu) return undefined;

    const onPointerMove = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const openMenuEl = getOpenMenuEl(openDesktopMenu);
      if (openMenuEl?.contains(target)) {
        keepDesktopMenu(openDesktopMenu);
        return;
      }

      if (target.closest("[data-editor-link-nav-overlay]")) {
        if (isEditChipBridgeForMenu(openMenuEl)) {
          keepDesktopMenu(openDesktopMenu);
          return;
        }
        closeDesktopMenuNow();
        return;
      }

      // Another header item (e.g. Gallery) or outside — close About.
      closeDesktopMenuNow();
    };

    document.addEventListener("mousemove", onPointerMove, { passive: true });
    return () => document.removeEventListener("mousemove", onPointerMove);
  }, [openDesktopMenu]);

  useEffect(() => {
    if (!sticky) return undefined;

    const section = headerRef.current?.closest<HTMLElement>(
      "[data-section-id], [data-section-type]",
    );
    if (!section) return undefined;

    const previousPosition = section.style.position;
    const previousTop = section.style.top;
    const previousZIndex = section.style.zIndex;
    section.style.position = "sticky";
    section.style.top = "0px";
    section.style.zIndex = "120";

    return () => {
      section.style.position = previousPosition;
      section.style.top = previousTop;
      section.style.zIndex = previousZIndex;
    };
  }, [sticky]);

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileMenu((prev) => (prev === label ? null : label));
  };

  const isLinkActive = (href: string, children?: { href: string }[]) => {
    if (preview) {
      const currentPage = preview.currentPage.toLowerCase();
      const currentSlug = normalizeNavSlug(currentPage);
      return [href, ...(children?.map((child) => child.href) ?? [])].some(
        (link) => {
          const linkSlug = getHrefSlug(link);
          const titled = getPageLabelFromHref(link, "").toLowerCase();
          return (
            titled === currentPage ||
            linkSlug === currentSlug ||
            currentSlug.endsWith(linkSlug) ||
            linkSlug.endsWith(currentSlug)
          );
        },
      );
    }

    if (href !== "#" && pathname === href) return true;
    if (children) {
      return children.some((child) => child.href === pathname);
    }
    return false;
  };

  const navigate = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    setMobileMenuOpen(false);
    setOpenDesktopMenu(null);

    if (preview) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isHomeClick =
      label.trim().toLowerCase() === "home" ||
      getHrefSlug(href) === "home";

    if (isHomeClick) {
      if (preview) {
        preview.setCurrentPage("Home");
        scrollTemplateToTop();
      }
      return;
    }

    if (!preview) return;

    const targetHref = (href || "").trim();
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(targetHref)) return;
    const hashPage = /^#page-/i.test(targetHref)
      ? targetHref.replace(/^#page-/i, "").replace(/^\/+|\/+$/g, "")
      : "";
    const pathSlug = targetHref
      .replace(/^#/, "")
      .split(/[?#]/, 1)[0]
      .replace(/^\/+/, "")
      .split("/")[0];
    if (!hashPage && (!pathSlug || pathSlug === "#")) return;
    preview.setCurrentPage(hashPage || pathSlug || label);
    scrollTemplateToTop();
  };

  return (
    <header
      ref={headerRef}
      data-editor-chrome
      data-editor-fields="logo logoImage logoImageTitle nav needHelpLabel phone headerCta"
      className={`${sticky ? "sticky top-0" : "relative"} z-50 w-full transition-all duration-300`}
    >
      {/* ================= MAIN NAVBAR ================= */}
      <nav
        style={{ background: solidBackground, color: textColor }}
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-black/55 shadow-lg backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex min-h-24 w-full items-center justify-between gap-4 px-4 sm:px-6 md:min-h-32 lg:px-8">
          {/* 1. Logo (Original Desktop Preserved) */}
          <Link
            href="/"
            onClick={(event) => navigate(event, "/", "Home")}
            data-editor-no-inline
            className="group flex min-w-0 shrink-0 items-center gap-3"
          >
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={siteInfo.siteName}
                className="h-24 w-24 shrink-0 object-contain md:h-32 md:w-44"
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-role="logo"
                data-editor-media-src={logoSrc}
              />
            ) : null}
            <span className="truncate text-lg font-bold" style={{ color: textColor }}>
              {data.logoText ?? (!logoSrc ? siteInfo.siteName : "")}
            </span>
          </Link>

          {/* 2. Desktop Right Side Content (Original Desktop Preserved Unchanged) */}
          <div className="hidden min-w-0 items-center gap-4 lg:flex">
            <div className="flex min-w-0 items-center gap-3 xl:gap-5">
              {menu.map((item, index) => {
                const active = isLinkActive(item.href, item.children);

                return (
                  <div
                    key={index}
                    data-editor-nav-menu={item.label}
                    className="group/item relative z-[1] hover:z-[90]"
                    onMouseEnter={() => {
                      if (item.children?.length) keepDesktopMenu(item.label);
                    }}
                    onMouseLeave={(event) => {
                      if (!item.children?.length) return;
                      const menuEl = event.currentTarget;
                      const next = event.relatedTarget;
                      const underPointer =
                        typeof document.elementFromPoint === "function"
                          ? document.elementFromPoint(
                              event.clientX,
                              event.clientY,
                            )
                          : null;
                      const bridge =
                        (next instanceof Element &&
                          next.closest("[data-editor-link-nav-overlay]")) ||
                        underPointer?.closest("[data-editor-link-nav-overlay]");
                      // Only bridge to THIS menu's edit chip, not Gallery's.
                      if (bridge && isEditChipBridgeForMenu(menuEl)) {
                        keepDesktopMenu(item.label);
                        return;
                      }
                      releaseDesktopMenu();
                    }}
                  >
                    <Link
                      style={active ? undefined : { color: textColor }}
                      href={item.href}
                      data-editor-keep-click={
                        item.label.trim().toLowerCase() === "home" ||
                        getHrefSlug(item.href) === "home"
                          ? "true"
                          : undefined
                      }
                      data-editor-nav={
                        item.label.trim().toLowerCase() === "home" ||
                        getHrefSlug(item.href) === "home"
                          ? "true"
                          : undefined
                      }
                      onClick={(event) => {
                        const fallback = item.children?.[0];
                        const href =
                          (!item.href || item.href === "#") && fallback?.href
                            ? fallback.href
                            : item.href;
                        const label =
                          (!item.href || item.href === "#") && fallback?.label
                            ? fallback.label
                            : item.label;
                        navigate(event, href, label);
                      }}
                      className={`flex items-center space-x-1 py-2 text-sm font-mono transition-colors ${
                        active
                          ? "font-semibold !text-[#f9570c]"
                          : "hover:!text-[#f9570c]"
                      }`}
                    >
                      <span>{item.label}</span>
                      {!!item.children?.length && (
                        <ChevronDown className="w-4 h-4 transition-transform group-hover/item:rotate-180" />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {!!item.children?.length && (
                      <div data-editor-nav-submenu className={`absolute left-0 top-full z-[100] w-56 translate-y-2 rounded-lg border border-gray-100 bg-white px-1 py-2 text-gray-800 shadow-xl transition-all duration-200 ${
                        openDesktopMenu === item.label
                          ? "visible translate-y-0 opacity-100"
                          : "invisible opacity-0 group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:opacity-100"
                      }`}>
                        {item.children.map((sub, sIdx) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={(event) => navigate(event, sub.href, sub.label)}
                              className={`flex items-center justify-between gap-3 px-4 py-2 pr-16 text-sm hover:bg-orange-100 rounded-xl hover:text-[#f9570c] transition-colors ${
                                isSubActive
                                  ? "text-[#f9570c] font-semibold bg-orange-50"
                                  : "text-gray-700"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="hidden shrink-0 items-center gap-3 text-white 2xl:flex">
              <div className="w-9 h-9 rounded-full border flex items-center justify-center font-bold text-white">
                <Phone className="w-4 h-4 " />
              </div>
              <div className="text-sm">
                <p style={{ color: textColor }}>
                  {data.needHelpLabel || "Need Help?"}
                </p>
                <a
                  href={siteInfo.TopBar.phoneHref}
                  className="font-bold text-orange-500 hover:text-[#f9570c] transition-colors"
                >
                  {siteInfo.TopBar.phone}
                </a>
              </div>
            </div>

            <Link
              href={siteInfo.headerCta.href}
              onClick={(event) =>
                navigate(event, siteInfo.headerCta.href, siteInfo.headerCta.label)
              }
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f9570c] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e04a05] hover:shadow-orange-500/20"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{siteInfo.headerCta.label}</span>
            </Link>
          </div>

          {/* 3. Mobile & Tablet Top Bar Controls (Enlarged Sizes) */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:hidden">
            <Link
              href={siteInfo.headerCta.href}
              onClick={(event) =>
                navigate(event, siteInfo.headerCta.href, siteInfo.headerCta.label)
              }
              className="inline-flex items-center space-x-2 bg-[#f9570c] hover:bg-[#e04a05] text-white px-4 py-2 sm:px-5 sm:py-2 rounded-full text-sm font-bold shadow-md transition-all"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>{siteInfo.headerCta.label}</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-lg text-white hover:text-[#f9570c] focus:outline-none bg-white/10 backdrop-blur-sm border border-white/20"
              style={{ color: textColor }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <Menu className="w-7 h-7 sm:w-8 sm:h-8" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE & TABLET DRAWER MENU ================= */}
      {/* Dark Overlay */}
      <div
        className={`absolute inset-x-0 top-full z-40 h-[calc(100dvh-5rem)] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Slide-in Drawer with Larger Mobile & Tab Content */}
      <div
        className={`absolute left-0 top-full z-50 flex h-[calc(100dvh-5rem)] w-4/5 max-w-md transform flex-col justify-between border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-3/5 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 overflow-y-auto">
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-800">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={siteInfo.siteName}
                className="h-10 w-auto object-contain sm:h-12"
                data-editor-media
                data-editor-media-type="image"
                data-editor-media-role="logo"
                data-editor-media-src={logoSrc}
              />
            ) : null}
            <span style={{ color: textColor }}>
              {data.logoText ?? (!logoSrc ? siteInfo.siteName : "")}
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-gray-900 border border-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile & Tab Navigation Links (Increased Size) */}
          <div className="mt-6 flex flex-col space-y-2">
            {menu.map((item, idx) => {
              const active = isLinkActive(item.href, item.children);

              if (item.children?.length) {
                const isExpanded = expandedMobileMenu === item.label;
                return (
                  <div key={idx} className="flex flex-col">
                    <button
                      style={active ? undefined : { color: textColor }}
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base sm:text-lg font-medium transition-colors ${
                        active
                          ? "text-[#f9570c] bg-gray-900"
                          : "text-gray-200 hover:bg-gray-900"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        className={`w-5 h-5 transition-transform ${
                          isExpanded
                            ? "rotate-90 text-[#f9570c]"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {/* Submenu Expansion */}
                    {isExpanded && (
                      <div className="ml-4 pl-3 border-l-2 border-gray-800 flex flex-col space-y-1.5 my-2">
                        {item.children.map((sub, sIdx) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              onClick={(event) => navigate(event, sub.href, sub.label)}
                              className={`px-4 py-2.5 rounded-lg text-sm sm:text-base transition-colors ${
                                isSubActive
                                  ? "text-[#f9570c] font-semibold bg-gray-900"
                                  : "text-gray-300 hover:text-white hover:bg-gray-900/50"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  style={active ? undefined : { color: textColor }}
                  href={item.href}
                  data-editor-keep-click={
                    item.label.trim().toLowerCase() === "home" ||
                    getHrefSlug(item.href) === "home"
                      ? "true"
                      : undefined
                  }
                  data-editor-nav={
                    item.label.trim().toLowerCase() === "home" ||
                    getHrefSlug(item.href) === "home"
                      ? "true"
                      : undefined
                  }
                  onClick={(event) => navigate(event, item.href, item.label)}
                  className={`px-4 py-3 rounded-xl text-base sm:text-lg font-medium transition-colors ${
                    active
                      ? "text-[#f9570c] font-semibold bg-gray-900"
                      : "text-gray-200 hover:bg-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tab Contact Footer (Increased Size) */}
        <div className="p-6 border-t border-gray-800 bg-slate-900/60">
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#f9570c]" />
            </div>
            <div>
              <span className="text-gray-400 text-sm block font-medium">
                {data.needHelpLabel || "Need Help?"}
              </span>
              <a
                href={siteInfo.TopBar.phoneHref}
                className="font-bold text-base text-white hover:text-[#f9570c] transition-colors"
              >
                {siteInfo.TopBar.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

(
  NgoHeader1 as typeof NgoHeader1 & { editorFields: readonly string[] }
).editorFields = [
  "logo",
  "logoImage",
  "logoImageTitle",
  "nav",
  "menu",
  "needHelpLabel",
  "phone",
  "headerCta",
];
