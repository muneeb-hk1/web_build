"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useOptionalPreview } from "../../context/PreviewContext";
import { editorSlug } from "../pet/editorSlug";

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

function pageSlugFromHref(href: string) {
  const raw = href.split("?")[0].split("#")[0];
  const last = raw.split("/").filter(Boolean).pop() || "home";
  return editorSlug(last);
}

export function openPestPage(
  preview: ReturnType<typeof useOptionalPreview>,
  href: string,
) {
  if (!preview || !href) return;
  const pageHash = href.match(/^#page-([^/?#]+)/i)?.[1];
  if (pageHash) {
    const links = preview.pageLinks.flatMap(function walk(
      link,
    ): typeof preview.pageLinks {
      return [link, ...(link.children || []).flatMap(walk)];
    });
    const match = links.find(
      (link) =>
        editorSlug(link.label) === editorSlug(pageHash) ||
        editorSlug(String(link.href || "").replace(/^#page-/i, "")) === editorSlug(pageHash),
    );
    preview.setCurrentPage(match?.label || pageHash);
    scrollTemplateToTop();
    return;
  }
  const sectionHash = href.match(/#([^/?#]+)$/)?.[1];
  const pathOnly = href.split("#")[0];
  if (sectionHash && (!pathOnly || pathOnly === "/")) {
    preview.setCurrentPage("Home");
    window.setTimeout(() => {
      document.getElementById(sectionHash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);
    return;
  }
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(href)) return;
  const slug = pageSlugFromHref(href).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const serviceSlug =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("pest-active-service") || ""
      : "";
  const links = preview.pageLinks.flatMap(function walk(
    link,
  ): typeof preview.pageLinks {
    return [link, ...(link.children || []).flatMap(walk)];
  });
  const sameSlug = (value: string) =>
    editorSlug(value).replace(/[^a-z0-9]+/g, "") === slug.replace(/[^a-z0-9]+/g, "");
  if (serviceSlug) {
    const detailPage = links.find(
      (link) => sameSlug(link.label || "") || sameSlug(String(link.href || "")),
    );
    if (detailPage?.label) {
      preview.setCurrentPage(detailPage.label);
      scrollTemplateToTop();
      return;
    }
  }
  const match = links.find((link) => {
    const fromHref = editorSlug(
      String(link.href || "")
        .replace(/^#page-/i, "")
        .split("/")
        .filter(Boolean)
        .pop() || "",
    );
    return editorSlug(link.label) === slug || fromHref === slug;
  });
  if (
    typeof window !== "undefined" &&
    /\/services\/[^/?#]+/i.test(href) &&
    slug &&
    slug !== "services"
  ) {
    window.sessionStorage.setItem("pest-active-service", slug);
  }
  preview.setCurrentPage(match?.label || slug);
  scrollTemplateToTop();
}

export function usePestNavigate() {
  const preview = useOptionalPreview();
  return (href: string) => openPestPage(preview, href);
}

export function usePestPath() {
  const preview = useOptionalPreview();
  const pathname = usePathname();
  if (!preview) return pathname || "/";
  const slug = editorSlug(preview.currentPage || "home");
  if (!slug || slug === "home") return "/";
  return `/${slug}`;
}

type PestLinkProps = ComponentProps<typeof Link>;

export default function PestLink({
  href,
  onClick,
  children,
  ...props
}: PestLinkProps) {
  const preview = useOptionalPreview();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = typeof href === "string" ? href : href?.toString?.() ?? "";
    if (!preview || !target) return;
    if (/^#page-/i.test(target)) {
      event.preventDefault();
      openPestPage(preview, target);
      return;
    }
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) return;
    event.preventDefault();
    openPestPage(preview, target);
  };
  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
