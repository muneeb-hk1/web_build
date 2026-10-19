import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import type { SectionProps } from "../../../types/section";
import { site } from "../data/categorySite";
import {
  CSR_FALLBACK_IMAGE,
  getCsrIconTheme,
  renderCsrIcon,
} from "./ngoCsrShared";

type FocusItem = {
  id?: string;
  title?: string;
  description?: string;
  linkText?: string;
  linkUrl?: string;
  imageUrl?: string;
  iconName?: string;
  icon?: string;
};

export default function NgoCsrFocusAreas1({ data: customData }: SectionProps) {
  const custom = (customData || {}) as {
    title?: string;
    items?: FocusItem[];
    focusAreas?: { title?: string; items?: FocusItem[] };
  };
  const fallback = site.csr?.focusAreas;
  const title =
    custom.title || custom.focusAreas?.title || fallback?.title || "OUR FOCUS AREAS";
  const items =
    (Array.isArray(custom.items) && custom.items.length
      ? custom.items
      : Array.isArray(custom.focusAreas?.items) && custom.focusAreas.items.length
        ? custom.focusAreas.items
        : fallback?.items) || [];

  return (
    <section
      data-editor-section-label="CSR Focus Areas"
      data-editor-fields="title items"
      className="py-8 md:py-10 bg-white font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5a36]" />
            <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-[#ff5a36]">
              {title}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => {
            const itemIcon = item.iconName || item.icon || "education";
            const theme = getCsrIconTheme(itemIcon);
            return (
              <div
                key={item.id || index}
                data-editor-item-type="CsrFocusItem"
                data-editor-item-label={item.title || "Focus area"}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full">
                    <Image
                      src={item.imageUrl || CSR_FALLBACK_IMAGE}
                      alt={item.title || "Focus area"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                      data-editor-media
                      data-editor-media-type="image"
                      data-editor-media-src={item.imageUrl || CSR_FALLBACK_IMAGE}
                    />
                    <div
                      className={`absolute -bottom-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white ${theme.text} shadow-md flex items-center justify-center border ${theme.border}`}
                    >
                      {renderCsrIcon(itemIcon, "w-7 h-7")}
                    </div>
                  </div>

                  <div className="pt-10 px-6 pb-6 text-center space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a0c2e]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pb-6 text-center">
                  <Link
                    href={item.linkUrl || "/service-details"}
                    data-editor-keep-click="true"
                    data-editor-nav="true"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#ff5a36] hover:text-[#e04f2e] transition-colors"
                  >
                    <span>{item.linkText || "Learn More"}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
