"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function selectAll(root: HTMLElement, selector: string) {
  return gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector));
}

export default function MotionShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rootEl.querySelectorAll<HTMLElement>("[data-hero-dashboard]").forEach((el) => {
        el.style.transform = "none";
      });
      return;
    }

    gsap.config({ nullTargetWarn: false });
    gsap.registerPlugin(ScrollTrigger);
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const desktop = window.matchMedia("(min-width: 1280px)").matches;
    // Lenis smooth scroll is costly on mobile — skip for Lighthouse / touch perf.
    const lenis = desktop
      ? new Lenis({
          lerp: 0.075,
          smoothWheel: true,
          wheelMultiplier: 0.88,
          touchMultiplier: 1.05,
          anchors: true,
        })
      : null;
    const syncScroll = () => ScrollTrigger.update();
    let update: ((time: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", syncScroll);
      update = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      const heroLines = selectAll(rootEl, "[data-hero-line]");
      if (heroLines.length) {
        gsap.from(heroLines, {
          yPercent: 115,
          duration: 1.15,
          stagger: 0.1,
          ease: "power4.out",
        });
      }

      const heroFades = selectAll(rootEl, "[data-hero-fade]");
      if (heroFades.length) {
        gsap.from(heroFades, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.45,
          ease: "power3.out",
        });
      }

      const orbits = selectAll(rootEl, "[data-orbit]");
      if (orbits.length) {
        gsap.to(orbits, {
          rotate: 360,
          duration: 26,
          repeat: -1,
          ease: "none",
        });
      }

      const heroScroll = rootEl.querySelector<HTMLElement>("[data-hero-scroll]");
      const heroDevice = selectAll(rootEl, "[data-hero-device]");
      if (heroScroll && !desktop) {
        heroScroll.style.removeProperty("height");
        heroScroll.style.removeProperty("min-height");
        if (heroDevice.length) {
          gsap.set(heroDevice, { clearProps: "transform,translate,y,scale" });
        }
      }
      if (heroScroll && heroDevice.length && desktop) {
        heroScroll.style.minHeight = "1250px";
        heroScroll.style.height = "190vh";
        const deviceEl = heroDevice[0];
        const frame = deviceEl.parentElement ?? deviceEl;
        // Resting frame is wider. Scrolled size stays on the previous 1180 frame.
        const scrolledScale = () => {
          const baseWidth = frame.offsetWidth || 1;
          const legacyWidth = Math.min(window.innerWidth * 0.88, 1180);
          return Math.min(0.96, (legacyWidth * 0.96) / baseWidth);
        };
        const scrolledY = () => {
          const scale = scrolledScale();
          const visualHeight = (deviceEl.offsetHeight || 0) * scale;
          const parentTop = frame.offsetTop || 0;
          return window.innerHeight / 2 - parentTop - visualHeight / 2;
        };
        gsap.set(heroDevice, {
          y: 150,
          scale: 0.9,
          force3D: true,
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroScroll,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });
        const copy = selectAll(rootEl, "[data-hero-copy]");
        const hint = selectAll(rootEl, "[data-scroll-hint]");
        const status = selectAll(rootEl, "[data-dashboard-status]");
        const shine = selectAll(rootEl, "[data-dashboard-shine]");
        const glow = selectAll(rootEl, "[data-hero-glow]");

        if (copy.length) {
          tl.to(copy, { y: -185, opacity: 0, ease: "none", duration: 0.38 }, 0);
        }
        if (hint.length) {
          tl.to(hint, { opacity: 0, y: 15, ease: "none", duration: 0.18 }, 0);
        }
        tl.to(
          heroDevice,
          {
            y: scrolledY,
            scale: scrolledScale,
            ease: "none",
            force3D: true,
            duration: 0.68,
          },
          0,
        );
        if (status.length) {
          tl.to(
            status,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              stagger: 0.08,
              ease: "power2.out",
              duration: 0.24,
            },
            0.48,
          );
        }
        if (shine.length) {
          tl.to(shine, { xPercent: 170, ease: "none", duration: 0.6 }, 0.12);
        }
        if (glow.length) {
          tl.to(glow, { scale: 1.18, opacity: 0.9, ease: "none" }, 0);
        }
      } else if (heroDevice.length) {
        gsap.from(heroDevice, {
          y: 48,
          opacity: 0,
          duration: 0.85,
          delay: 0.25,
          ease: "power3.out",
          force3D: true,
        });
      }

      selectAll(rootEl, "[data-reveal]").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 50,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => {
      context.revert();
      if (lenis && update) {
        lenis.off("scroll", syncScroll);
        gsap.ticker.remove(update);
        lenis.destroy();
      }
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
