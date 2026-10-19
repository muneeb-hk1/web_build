import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import { getCsrIconTheme, renderCsrIcon } from "./ngoCsrShared";

type ImpactStat = {
  value?: string;
  label?: string;
  iconName?: string;
  icon?: string;
};

export default function NgoCsrImpact1({ data: customData }: SectionProps) {
  const custom = (customData || {}) as {
    title?: string;
    stats?: ImpactStat[];
    impact?: { title?: string; stats?: ImpactStat[] };
  };
  const fallback = site.csr?.impact;
  const title =
    custom.title || custom.impact?.title || fallback?.title || "OUR IMPACT";
  const stats =
    (Array.isArray(custom.stats) && custom.stats.length
      ? custom.stats
      : Array.isArray(custom.impact?.stats) && custom.impact.stats.length
        ? custom.impact.stats
        : fallback?.stats) || [];

  return (
    <section
      data-editor-section-label="CSR Impact"
      data-editor-fields="title stats"
      className="py-8 bg-[#f4f7f6] font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5a36]" />
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#ff5a36]">
              {title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, idx) => {
            const statIcon = stat.iconName || stat.icon || "users";
            const theme = getCsrIconTheme(statIcon);
            return (
              <div
                key={idx}
                data-editor-item-type="CsrImpactStat"
                data-editor-item-label={stat.label || "Impact stat"}
                className="bg-white p-6 rounded-2xl text-center border border-gray-100 shadow-xs space-y-3 flex flex-col justify-center items-center"
              >
                <div className={theme.text}>
                  {renderCsrIcon(statIcon, "w-8 h-8")}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#ff5a36]">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-[#1a0c2e]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
