import type { SectionProps } from "../../../types/section";
import { site, type NGOCookiePolicyData } from "../data/categorySite";
import NgoLegalLayout, { mergeNgoLegalData } from "../legal/NgoLegalLayout";

export default function NgoCookiePolicy1({ data: customData }: SectionProps) {
  const data = mergeNgoLegalData(
    customData as unknown as Partial<NGOCookiePolicyData> | undefined,
    site.cookiePolicy,
  );

  return <NgoLegalLayout data={data} />;
}
