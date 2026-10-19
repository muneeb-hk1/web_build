import Image from "next/image";
import type { SectionProps } from "../../../types/section";
import { site, type NGOPartnersSponsorsData } from "../data/categorySite";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

const FALLBACK_IMAGE =
  "/categories/ngo/template1/logo.png";

export default function NgoPartners1({ data: customData }: SectionProps) {
  const custom = customData as unknown as Partial<NGOPartnersSponsorsData> | undefined;
  const data = {
    ...site.partnersSponsors,
    ...custom,
    banner: { ...site.partnersSponsors.banner, ...custom?.banner },
    partners: custom?.partners ?? site.partnersSponsors.partners,
  };

  const { sectionBadge, sectionTitle, sectionpretitle, partners } = data;
  const badgeIconName =
    (data as { icon?: string }).icon ||
    (custom as { icon?: string } | undefined)?.icon ||
    "hand-heart";

  return (
    <main className="w-full bg-[#fcfcfc] text-slate-800 font-sans antialiased min-h-screen">
      <section
        data-editor-section-label="Partners"
        data-editor-fields="icon sectionBadge sectionTitle sectionpretitle partners"
        className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          {sectionBadge && (
            <div className="flex justify-center items-center gap-2 text-emerald-700 font-semibold text-base sm:text-lg">
              <EditableNgoIcon name={badgeIconName} className="w-8 h-8 text-emerald-600" />
              <span className="italic font-serif">{sectionBadge}</span>
            </div>
          )}

          {sectionTitle && (
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F2B20] tracking-tight mb-2">
              {sectionTitle}
            </h2>
          )}
          <div className="w-20 h-1 bg-[#16a34a] rounded-full mx-auto" />

          {sectionpretitle && (
            <p className="text-[#556052] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-3">
              {sectionpretitle}
            </p>
          )}
        </div>

        {partners && partners.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                data-editor-item-type="Partner"
                data-editor-item-label={partner.name || "Partner"}
                className="group bg-white rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col items-center justify-center shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[160px]"
              >
                <div className="relative w-full h-32 flex items-center justify-center mb-3">
                  <Image
                    src={partner.logo || FALLBACK_IMAGE}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-contain"
                    data-editor-media
                    data-editor-media-type="image"
                    data-editor-media-src={partner.logo || FALLBACK_IMAGE}
                  />
                </div>
                <span className="text-md font-bold text-slate-600 group-hover:text-slate-900 transition-colors text-center">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
