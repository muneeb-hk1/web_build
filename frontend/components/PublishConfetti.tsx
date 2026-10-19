"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  shape: "rect" | "circle" | "plus";
  life: number;
};

const COLORS = ["#f472b6", "#facc15", "#60a5fa", "#4ade80", "#c084fc", "#fb7185", "#38bdf8"];

/**
 * Full-screen celebration burst for publish success (no extra npm deps).
 */
export default function PublishConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnBurst = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 6 + Math.random() * 10;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          w: 4 + Math.random() * 6,
          h: 6 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.35,
          color: COLORS[i % COLORS.length]!,
          shape:
            Math.random() > 0.66
              ? "plus"
              : Math.random() > 0.4
                ? "rect"
                : "circle",
          life: 1,
        });
      }
    };

    const w = window.innerWidth;
    const h = window.innerHeight;
    spawnBurst(w * 0.5, h * 0.42, 90);
    spawnBurst(w * 0.28, h * 0.55, 45);
    spawnBurst(w * 0.72, h * 0.55, 45);

    const gravity = 0.18;
    const drag = 0.992;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i]!;
        p.vy += gravity;
        p.vx *= drag;
        p.vy *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.008;
        if (p.life <= 0 || p.y > window.innerHeight + 40) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "plus") {
          ctx.fillRect(-p.w * 0.15, -p.h * 0.5, p.w * 0.3, p.h);
          ctx.fillRect(-p.w * 0.5, -p.h * 0.15, p.w, p.h * 0.3);
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
      if (particles.length) {
        raf = window.requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    raf = window.requestAnimationFrame(draw);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[10025]"
    />
  );
}
