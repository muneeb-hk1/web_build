import type { SectionProps } from "../../../types/section";
import { site, type NGOPrivacyPolicyData } from "../data/categorySite";
import NgoLegalLayout, { mergeNgoLegalData } from "../legal/NgoLegalLayout";

export default function NgoPrivacyPolicy1({ data: customData }: SectionProps) {
  const data = mergeNgoLegalData(
    customData as unknown as Partial<NGOPrivacyPolicyData> | undefined,
    site.privacyPolicy,
  );

  return <NgoLegalLayout data={data} />;
}
