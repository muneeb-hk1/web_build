"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

/** Load GSAP MotionShell right after first paint so hero animation works. */
export default function DeferredMotionShell({
  children,
}: {
  children: ReactNode;
}) {
  const [Shell, setShell] = useState<ComponentType<{ children: ReactNode }> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      void import("./motion-shell")
        .then((mod) => {
          if (!cancelled) setShell(() => mod.default);
        })
        .catch((error) => {
          document.documentElement.dataset.motionError = String(error);
        });
    }, 50);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  if (!Shell) return <>{children}</>;
  return <Shell>{children}</Shell>;
}
