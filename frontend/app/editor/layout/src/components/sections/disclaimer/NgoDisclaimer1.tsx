import type { SectionProps } from "../../../types/section";
import { site, type NGODisclaimerData } from "../data/categorySite";
import NgoLegalLayout, { mergeNgoLegalData } from "../legal/NgoLegalLayout";

export default function NgoDisclaimer1({ data: customData }: SectionProps) {
  const data = mergeNgoLegalData(
    customData as unknown as Partial<NGODisclaimerData> | undefined,
    site.disclaimer,
  );

  return <NgoLegalLayout data={data} />;
}
