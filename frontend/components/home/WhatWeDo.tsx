import { MessageCircle, Sparkles, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
    [MessageCircle, "Build a Website with AI", "Create a complete website from your idea, business details, and preferences."],
    [Sparkles, "Redesign Existing Website", "Refresh your current website in minutes with improved design, layout, and content."],
    [SlidersHorizontal, "Customize Without Limits", "Change themes, colors, sections, layouts, and styles to match your brand."],
    [Rocket, "Publish & Grow", "Go live in minutes and start reaching your audience."],
] as const;

export default function WhatWeDo() {
    return (
        <section id="how-it-works" className="scroll-mt-20 bg-white px-6 pb-14 pt-10 text-[#080e42] sm:px-10 sm:pb-16 sm:pt-8 lg:pb-20 xl:py-16" aria-labelledby="what-we-do-title">
            <div className="mx-auto max-w-[1180px] text-center">
                <h2 id="what-we-do-title" className="mx-auto text-[clamp(1.85rem,4.5vw,2.35rem)] font-normal leading-[1.08] tracking-[-0.05em]">
                    What We{" "}
                    <span className="font-serif italic tracking-[-0.06em] text-[#1680ff]">
                        Do?
                    </span>
                </h2>
                <p className="mx-auto mt-1 md:mt-3 max-w-md text-base font-light leading-7 tracking-[-0.02em] text-[#4b5568]">
                    Four steps. A beautiful website. No hassle.
                </p>
                <ol className="mt-10 grid gap-x-6 gap-y-10 grid-cols-2 lg:mt-12 xl:grid-cols-4 xl:gap-x-4">
                    {steps.map(([Icon, title, description], index) => (
                        <li key={title} className="group/step relative flex flex-col items-center px-2">
                            {index < steps.length - 1 && (
                                <svg aria-hidden="true" viewBox="0 0 400 64" preserveAspectRatio="none" className="pointer-events-none absolute left-1/2 top-0 hidden h-16 w-full overflow-visible xl:block">
                                    <path
                                        d="M 0 32 C 70 4, 130 4, 200 32 S 330 60, 400 32"
                                        fill="none"
                                        stroke="#b4d5ff"
                                        strokeWidth="2"
                                        strokeDasharray="6 8"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                        className="motion-safe:animate-[dash-move_14s_linear_infinite]"
                                    />
                                    <circle cx="200" cy="32" r="4.5" fill="#2586ff" className="motion-safe:animate-pulse" />
                                </svg>
                            )}
                            <div className="relative z-10 grid size-16 place-items-center rounded-full bg-[#e7f1ff] text-[#0a5ebd] ring-4 ring-white shadow-[0_0_0_0_rgba(22,128,255,0)] transition duration-300 group-hover/step:-translate-y-1 group-hover/step:bg-[#dcebff] group-hover/step:shadow-[0_12px_28px_rgba(22,128,255,0.28)] group-hover/step:ring-[#e7f1ff] motion-reduce:transition-none">
                                <Icon aria-hidden="true" className="size-6 transition duration-300 group-hover/step:scale-110 motion-reduce:transition-none" strokeWidth={1.8} />
                            </div>
                            {/* <span aria-hidden="true" className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-[#0a5ebd]">0{index + 1}</span> */}
                            <h3 className="mt-2 text-[1.05rem] font-normal leading-snug tracking-[-0.04em] sm:text-lg">{title}</h3>
                            <p className="hidden mt-2 max-w-[260px] text-sm font-light leading-6 tracking-[-0.01em] text-[#4b5568] md:block">{description}</p>
                        </li>
                    ))}
                </ol>
            </div>
            <style>{`
              @keyframes dash-move {
                to { stroke-dashoffset: -56; }
              }
            `}</style>
        </section>
    );
}
