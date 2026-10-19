"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link, { usePestPath } from "./PestLink";
import { ChevronDown, Menu, X } from "lucide-react";
import siteData from "../../../data/pestContent";
import { useOptionalPreview } from "../../context/PreviewContext";
import { getHiddenManagerFamilies } from "../../../lib/navVisibility";

function SocialGlyph({ name }: { name: string }) {
  if (name === "instagram") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      </svg>
    );
  }
  if (name === "twitter") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.6 7.3c.5-.3.9-.8 1.1-1.4-.5.3-1 .5-1.6.6A2.6 2.6 0 0 0 14.4 9c0 .2 0 .4.1.6-2.2-.1-4.1-1.1-5.4-2.7-.2.4-.3.8-.3 1.3 0 .9.5 1.7 1.2 2.2-.4 0-.8-.1-1.2-.3v.1c0 1.3.9 2.3 2.1 2.6-.2.1-.5.1-.7.1-.2 0-.3 0-.5-.1.3 1 1.2 1.8 2.3 1.8A5.3 5.3 0 0 1 5 16.6 7.4 7.4 0 0 0 9 17.8c4.8 0 7.4-4 7.4-7.4v-.3c.5-.4.9-.8 1.2-1.3z" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.5 9H4V20h2.5V9zM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4zM20 20h-2.5v-5.6c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H11V9h2.4v1.5c.4-.7 1.2-1.7 3-1.7 2.2 0 3.6 1.4 3.6 4.4V20z" />
      </svg>
    );
  }
  if (name === "youtube") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z" />
      </svg>
    );
  }
  if (name === "tiktok") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 3h2.1a5.2 5.2 0 0 0 3.4 3.2v2.2a7.3 7.3 0 0 1-3.4-1v6.7a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.3a3.3 3.3 0 1 0 2.6 3.2V3z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Navbar({
  data = {},
}: {
  data?: Record<string, unknown>;
} = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  useEffect(() => {
    if (!servicesDropdownOpen) return;
    const onLeave = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!target.closest("[data-editor-link-nav-overlay]")) return;
      const next = event.relatedTarget;
      if (
        next instanceof Element &&
        (next.closest("[data-pest-services-menu]") ||
          next.closest("[data-editor-link-nav-overlay]"))
      ) {
        return;
      }
      setServicesDropdownOpen(false);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [servicesDropdownOpen]);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePestPath();
  const preview = useOptionalPreview();
  const hiddenFamilies = getHiddenManagerFamilies(preview?.pageLinks);

  const common = (siteData as any).common || {};
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const headerData = pestControl?.sections?.Header?.variants?.PestHeader1 || {};

  // Services list JSON se
  const servicesSection =
    pestControl?.sections?.Services?.variants?.PestServices1 ||
    pestControl?.sections?.ServicesGrid?.variants?.PestServicesGrid1 ||
    {};

  const dynamicServicesList: Array<{ label: string; href: string }> = (
    servicesSection?.items ||
    servicesSection?.services ||
    []
  ).map((svc: any, idx: number) => {
    const name = svc.name || svc.title || `Service ${idx + 1}`;
    const slug =
      svc.slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return {
      label: name,
      href: `/services/${slug}`,
    };
  });

  const defaultServices = [
    { label: "Ant Control", href: "/services/ant-control" },
    { label: "Bed Bug Control", href: "/services/bed-bug-control" },
    { label: "Cockroach Control", href: "/services/cockroach-control" },
    { label: "Mosquito Control", href: "/services/mosquito-control" },
    { label: "Rodent Control", href: "/services/rodent-control" },
    { label: "Termite Control", href: "/services/termite-control" },
  ];

  const resolvedServices =
    dynamicServicesList.length > 0 ? dynamicServicesList : defaultServices;

  const extraPage =
    /faq|quote|service-details|blog-details|get a quote|service details|blog details/i;
  const keepNavItem = (item: { label?: string; title?: string; href?: string; path?: string }) => {
    const label = `${item.label || item.title || ""}`;
    const href = `${item.href || item.path || ""}`;
    return !extraPage.test(label) && !extraPage.test(href);
  };
  const storedNav = Array.isArray(data.navLinks)
    ? data.navLinks
    : Array.isArray(data.menu)
      ? data.menu
      : [];
  const editorNav = storedNav.filter((item) => keepNavItem(item));
  const rawMenu: any[] = editorNav.length
    ? editorNav
    : headerData?.navLinks || [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about" },
    { label: "SERVICES", href: "/services", hasDropdown: true },
    { label: "BLOG", href: "/blog" },
    { label: "GALLERY", href: "/gallery" },
    { label: "CONTACT US", href: "/contact" },
  ];

  const previewNav = (preview?.pageLinks ?? []).filter(
    (link) => link.kind !== "blog" && link.kind !== "document" && !link.hidden,
  );
  const sectionLabels = new Set(
    rawMenu.map((item) => String(item.label || item.title || "").trim().toLowerCase()),
  );
  const addedNav = previewNav.filter((link) => {
    const label = (link.label || "").trim().toLowerCase();
    const href = (link.href || "").trim();
    if (!label || sectionLabels.has(label)) return false;
    return /^#[a-z0-9-]+$/i.test(href) && !href.toLowerCase().startsWith("#page-");
  });
  const orderedMenu = [
    ...rawMenu,
    ...addedNav.map((link) => ({
      label: link.label,
      href: link.href,
    })),
  ];

  const menuList = orderedMenu
    .filter((item) => {
      const label = String(item.label || item.title || "").trim().toLowerCase();
      const href = String(item.href || item.path || "").trim().toLowerCase();
      if (/\b(events?|teams?|portfolio|projects?)\b/.test(label)) return false;
      if (/event|team|portfolio|project/.test(href)) return false;
      if (hiddenFamilies.has("services") && /\bservices?\b/.test(label)) return false;
      if (hiddenFamilies.has("blogs") && /\bblogs?\b/.test(label)) return false;
      if (hiddenFamilies.has("gallery") && /\bgallery\b/.test(label)) return false;
      if (hiddenFamilies.has("events") && /\bevents?\b/.test(label)) return false;
      if (hiddenFamilies.has("teams") && /\bteams?\b/.test(label)) return false;
      if (hiddenFamilies.has("portfolio") && /\b(portfolio|projects?)\b/.test(label)) return false;
      return true;
    })
    .map((item) => {
      const label = item.label || item.title || "";
      const ownChildren = item.children || item.sublinks || [];
      const isServices = label.toUpperCase() === "SERVICES" || item.hasDropdown;
      return {
        label,
        href: item.href || item.path || (isServices ? "/services" : "#"),
        children: (ownChildren.length ? ownChildren : isServices ? resolvedServices : []).map(
          (child: { label?: string; title?: string; href?: string; path?: string }) => ({
            label: child.label || child.title || "",
            href: child.href || child.path || "#",
          }),
        ),
      };
    });

  // Gol green social icons
  const social =
    (data.socialLinks as { facebook?: string; instagram?: string; whatsapp?: string } | undefined) ||
    common?.socialLinks ||
    {};
  const rawLogo = typeof data.logo === "string" ? data.logo : "";
  const logoIsImage =
    rawLogo.startsWith("/") || rawLogo.startsWith("http") || rawLogo.startsWith("data:");
  const logoSrc = logoIsImage ? rawLogo : "";
  const logoText =
    (typeof data.logoText === "string" && data.logoText.trim()) ||
    (!logoIsImage ? rawLogo.trim() : "") ||
    "";

  const socialEntries = Object.entries(
    social as Record<string, unknown>,
  ).filter(([, href]) => typeof href === "string");
  const renderSocialIcons = () => (
    <div className="flex items-center gap-2 sm:gap-2.5">
      {(socialEntries.length
        ? socialEntries
        : [
            ["facebook", "https://facebook.com"],
            ["instagram", "https://instagram.com"],
            ["whatsapp", "https://whatsapp.com"],
          ]
      ).map(([icon, href]) => {
        const key = String(icon).toLowerCase().replace(/-\d+$/, "");
        const url =
          key === "whatsapp" && !href
            ? common?.phone
              ? `https://wa.me/${String(common.phone).replace(/[^0-9]/g, "")}`
              : "https://whatsapp.com"
            : String(href || "#");
        return (
          <a
            key={String(icon)}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={key}
            className="w-9 h-9 rounded-full bg-[#00482B] text-white flex items-center justify-center hover:bg-[#003822] transition shadow-xs"
          >
            <SocialGlyph name={key} />
          </a>
        );
      })}
    </div>
  );

  const backgroundType = data.headerBackgroundType === "gradient" ? "gradient" : "solid";
  const backgroundColor =
    typeof data.headerBackgroundColor === "string" && data.headerBackgroundColor
      ? data.headerBackgroundColor
      : "#ffffff";
  const gradientColor =
    typeof data.headerGradientColor === "string" && data.headerGradientColor
      ? data.headerGradientColor
      : "#00482B";
  const textColor =
    typeof data.headerTextColor === "string" && data.headerTextColor
      ? data.headerTextColor
      : undefined;
  const isSticky = data.headerType !== "scroll";
  const headerStyle = {
    background:
      backgroundType === "gradient"
        ? `linear-gradient(90deg, ${backgroundColor}, ${gradientColor})`
        : data.headerBackgroundColor
          ? backgroundColor
          : undefined,
    color: textColor,
  };

  return (
    <header
      className={`${isSticky ? "sticky" : "relative"} top-0 z-50 border-b border-neutral-100 bg-white shadow-xs`}
      style={headerStyle}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[82px] sm:h-[88px] flex items-center justify-between">
        
        {/* Logo - Size Enlarge */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 py-1">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={logoText || common?.siteName || "PestControl"}
              width={280}
              height={76}
              priority
              data-editor-media="true"
              data-editor-media-role="logo"
              className="h-14 sm:h-16 md:h-[68px] w-auto object-contain transition-all"
            />
          ) : null}
          {logoText ? (
            <span className="text-lg font-extrabold tracking-tight text-[#00482B] sm:text-xl">
              {logoText}
            </span>
          ) : null}
          {!logoSrc && !logoText ? (
            <Image
              src={headerData?.logo || "/categories/petcare/logo.jpeg"}
              alt={common?.siteName || "PestControl"}
              width={280}
              height={76}
              priority
              className="h-14 sm:h-16 md:h-[68px] w-auto object-contain"
            />
          ) : null}
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-[13.5px] font-bold tracking-wider text-neutral-800">
          {menuList.map((item) => {
            if (item.children && item.children.length > 0) {
              const isChildActive = item.children.some(
                (child: any) => pathname === child.href
              );
              const isActive = pathname === item.href || isChildActive;

              return (
                <div
                  key={item.label}
                  data-pest-services-menu=""
                  className="relative py-7 group"
          onMouseEnter={() => setServicesDropdownOpen(true)}
          onMouseLeave={(event) => {
            const next = event.relatedTarget;
            if (
              next instanceof Element &&
              next.closest("[data-editor-link-nav-overlay]")
            ) {
              return;
            }
            setServicesDropdownOpen(false);
          }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className={`flex items-center gap-1.5 py-1 text-[13px] font-semibold uppercase tracking-[0.04em] select-none cursor-default transition ${
                      isActive || servicesDropdownOpen
                        ? "text-[#00482B] after:absolute after:bottom-3 after:left-0 after:w-full after:h-[2.5px] after:bg-[#00482B]"
                        : "hover:text-[#00482B]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={2.2}
                      className={`transition-transform duration-200 ${
                        servicesDropdownOpen ? "rotate-180 text-[#00482B]" : "text-neutral-600"
                      }`}
                    />
                  </div>

                  {servicesDropdownOpen && (
                    <div
                      data-editor-nav-submenu
                      className="absolute top-[76px] left-0 w-60 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 z-50"
                    >
                      <Link
                        href={item.href}
                        className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#00482B] bg-[#f0f8f4] hover:bg-[#e2f1ea] border-b border-neutral-100 transition"
                      >
                        ALL SERVICES
                      </Link>

                      <div className="max-h-[300px] overflow-y-auto">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-[#eaf5ef] hover:text-[#00482B] transition"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[13px] font-semibold uppercase tracking-[0.04em] transition py-1 relative ${
                  isActive
                    ? "text-[#00482B] after:absolute after:-bottom-2.5 after:left-0 after:w-full after:h-[2.5px] after:bg-[#00482B]"
                    : "hover:text-[#00482B]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons & Mobile Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center">
            {renderSocialIcons()}
          </div>

          <Link
            href="/contact"
            className="lg:hidden inline-flex items-center justify-center bg-[#00482B] text-white text-xs font-bold px-3.5 py-1.5 rounded-full hover:bg-[#003822] transition shadow-xs whitespace-nowrap"
          >
            Get a Quote
          </Link>

          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-800 p-1.5 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-4 flex flex-col gap-3 shadow-lg">
          {menuList.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <div key={item.label} className="border-b border-neutral-100 pb-2">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex items-center justify-between w-full py-1 text-left font-bold text-sm text-[#00482B] cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={17}
                      className={`transition-transform duration-200 ${
                        mobileServicesOpen ? "rotate-180 text-[#00482B]" : "text-neutral-500"
                      }`}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div
                      data-editor-nav-submenu
                      className="pl-4 flex flex-col gap-2.5 mt-2 border-l-2 border-[#00482B]/20"
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xs font-bold text-[#00482B] py-0.5 uppercase tracking-wider"
                      >
                        ALL SERVICES
                      </Link>
                      {item.children.map((child: any) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs text-neutral-600 hover:text-[#00482B] transition py-0.5"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-semibold text-sm py-1.5 transition ${
                  isActive ? "text-[#00482B] font-bold" : "text-neutral-800 hover:text-[#00482B]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-neutral-100 flex flex-col items-center gap-3">
            {renderSocialIcons()}
          </div>
        </div>
      )}
    </header>
  );
}