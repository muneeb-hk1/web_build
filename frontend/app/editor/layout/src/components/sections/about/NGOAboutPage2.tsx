import type { SectionData, SectionProps } from "../../../types/section";
import NGOPageBanner2, {
  getNGOPageBannerProps,
} from "../breadcrumb/NGOPageBanner2";
import NGOAbout2 from "./NGOAbout2";
import NGOMission2 from "../mission-vision/NGOMission2";
import NGOWhyChooseUs2 from "../whychooseus/NGOWhyChooseUs2";

export default function NGOAboutPage2({ data = {} }: SectionProps) {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900">
      <NGOPageBanner2 {...getNGOPageBannerProps(data)} />
      <NGOAbout2 data={(data.aboutContent as SectionData | undefined) || data} />
      <NGOMission2 data={(data.mission as SectionData | undefined) || {}} />
      <NGOWhyChooseUs2
        data={(data.whyChooseUs as SectionData | undefined) || {}}
      />
    </main>
  );
}
