"use client";

import { useEffect, useRef, useState } from "react";
import type { UserSite } from "./types";

function isCreateAiCard(site: UserSite) {
  return (
    site.kind === "create-ai" ||
    site.flow === "create-ai" ||
    site.createPath === "create-ai" ||
    /^ca_/i.test(site.id) ||
    (typeof site.designId === "string" && /^ca_/i.test(site.designId))
  );
}

export function siteCardPreviewHref(site: UserSite) {
  if (site.published && site.slug) return `/published/${site.slug}`;
  if (site.id && !isCreateAiCard(site)) {
    return `/editor/preview?siteId=${encodeURIComponent(site.id)}`;
  }
  return null;
}

/** Live site URL only — drafts show the open icon disabled. */
export function siteCardOpenHref(site: UserSite) {
  if (site.published && site.slug) return `/published/${site.slug}`;
  return null;
}

const PREVIEW_SLOT_LIMIT = 2;
let activePreviewSlots = 0;
const previewSlotWaiters: Array<() => void> = [];

function requestPreviewSlot() {
  return new Promise<void>((resolve) => {
    const grant = () => {
      activePreviewSlots += 1;
      resolve();
    };
    if (activePreviewSlots < PREVIEW_SLOT_LIMIT) grant();
    else previewSlotWaiters.push(grant);
  });
}

function releasePreviewSlot() {
  activePreviewSlots = Math.max(0, activePreviewSlots - 1);
  const next = previewSlotWaiters.shift();
  if (next) next();
}

export default function SiteCardPreview({
  src,
  title,
  fallback,
}: {
  src: string | null;
  title: string;
  fallback: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const releaseHoldRef = useRef<(() => void) | null>(null);
  const [scale, setScale] = useState(0.28);
  const [inView, setInView] = useState(false);
  const [showFrame, setShowFrame] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const updateScale = () => {
      const width = node.clientWidth;
      if (width > 0) setScale(width / 1200);
    };
    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || !src) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setInView(true);
      observer.disconnect();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    if (!inView || !src) return;
    let cancelled = false;
    let holding = false;
    const release = () => {
      if (!holding) return;
      holding = false;
      releasePreviewSlot();
    };
    releaseHoldRef.current = release;
    const wait = window.setTimeout(() => {
      void requestPreviewSlot().then(() => {
        if (cancelled) {
          releasePreviewSlot();
          return;
        }
        holding = true;
        setShowFrame(true);
      });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(wait);
      releaseHoldRef.current = null;
      release();
    };
  }, [inView, src]);

  return (
    <div
      ref={frameRef}
      className="absolute inset-0 overflow-hidden"
      style={{ background: fallback }}
    >
      {showFrame && src ? (
        <iframe
          title={`${title} preview`}
          src={src}
          tabIndex={-1}
          loading="lazy"
          onLoad={() => releaseHoldRef.current?.()}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0 bg-white"
          style={{ width: 1200, height: 760, transform: `scale(${scale})` }}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-16 bg-gradient-to-b from-zinc-950/75 via-zinc-950/40 to-transparent" />
    </div>
  );
}
