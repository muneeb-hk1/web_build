"use client";

import {
  Children,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CleaningSliderProps = {
  children: ReactNode;
  showDots?: boolean;
  showArrows?: boolean;
  autoplayMs?: number;
  gapClassName?: string;
  itemClassName?: string;
  arrowTone?: "dark" | "light";
  header?: ReactNode;
};

export default function CleaningSlider({
  children,
  showDots = false,
  showArrows = false,
  autoplayMs = 0,
  gapClassName = "gap-6",
  itemClassName = "w-full",
  arrowTone = "dark",
  header,
}: CleaningSliderProps) {
  const items = useMemo(() => Children.toArray(children), [children]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoplayMs || items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, autoplayMs);
    return () => window.clearInterval(timer);
  }, [autoplayMs, items.length]);

  const goTo = (next: number) => {
    if (!items.length) return;
    setIndex((next + items.length) % items.length);
  };

  const arrowClass =
    arrowTone === "light"
      ? "border-white/40 text-white hover:bg-white hover:text-[#138A56]"
      : "border-gray-200 text-[#0B2942] hover:bg-[#0A7A51] hover:text-white";

  return (
    <div className="relative">
      {(header || showArrows) && (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">{header}</div>
          {showArrows ? (
            <div className="mb-1 flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => goTo(index - 1)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${arrowClass}`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => goTo(index + 1)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${arrowClass}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
        </div>
      )}

      <div className="overflow-hidden">
        <div
          className={`flex ${gapClassName} transition-transform duration-500 ease-out`}
          style={{ transform: `translateX(-${index * 8}%)` }}
        >
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className={`shrink-0 ${itemClassName}`}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {showDots && items.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              aria-label={`Slide ${dotIndex + 1}`}
              onClick={() => goTo(dotIndex)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === dotIndex ? "bg-[#1FA463]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
