import type { SectionProps } from "../../../types/section";
import { site, type NGOTermsConditionsData } from "../data/categorySite";
import NgoLegalLayout, { mergeNgoLegalData } from "../legal/NgoLegalLayout";

export default function NgoTermsConditions1({ data: customData }: SectionProps) {
  const data = mergeNgoLegalData(
    customData as unknown as Partial<NGOTermsConditionsData> | undefined,
    site.termsConditions,
  );

  return <NgoLegalLayout data={data} />;
}
