import type { SectionProps } from "../../../types/section";
import { site, type NGOHowWeHelpData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

export default function NgoHelp1({ data: customData }: SectionProps) {
    const custom = (customData ?? {}) as Partial<NGOHowWeHelpData>;
    const fallback = site.howWeHelp ?? {};
    const fallbackCards = Array.isArray(fallback.cards) ? fallback.cards : [];
    const data = {
        ...fallback,
        ...custom,
        cards:
            Array.isArray(custom.cards) && custom.cards.length
                ? custom.cards
                : fallbackCards,
    };
    const cards = Array.isArray(data.cards) ? data.cards : [];

    return (
        <section
            data-editor-section-label="How We Help"
            data-editor-fields="icon badge title description cards"
            className="bg-white pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 font-sans"
        >
            <div className="max-w-7xl mx-auto">
                {/* Dark Container Header */}
                <div className="bg-[#08121e] rounded-t-3xl pt-12 pb-28 px-6 sm:px-10 lg:px-12 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <EditableNgoIcon name={data.icon || "hand-heart"} className="h-5 w-5 text-[#ff5500]" />
                        <span className="text-sm sm:text-sm font-semibold uppercase tracking-wider text-gray-300">
                            {data.badge}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                        {data.title}
                    </h2>
                    <p className="text-gray-300 max-w-3xl text-sm sm:text-base leading-relaxed">
                        {data.description}
                    </p>
                </div>

                {/* Floating Cards Grid (Responsive: 1 mobile, 2 tab, 4 desktop) */}
                <div className="-mt-16 px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card: Record<string, any>, idx: number) => {
                            return (
                            <div
                                key={card.id || idx}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="mb-6">
                                    <div className="relative flex items-center justify-center w-16 h-16">
                                        <div className="absolute w-8 h-8 bg-[#ff5500] rounded-full bottom-1 left-1/2 -translate-x-1/2 z-0 opacity-90" />
                                        <EditableNgoIcon
                                          name={card.icon || "hand-heart"}
                                          className="w-12 h-12 text-[#0f172a] relative z-10 stroke-[1.5]"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {card.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
