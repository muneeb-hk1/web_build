import type { SectionProps } from "../../../types/section";
import { site, type NGORefundPolicyData } from "../data/categorySite";
import NgoLegalLayout, { mergeNgoLegalData } from "../legal/NgoLegalLayout";

export default function NgoRefundPolicy1({ data: customData }: SectionProps) {
  const data = mergeNgoLegalData(
    customData as unknown as Partial<NGORefundPolicyData> | undefined,
    site.refundPolicy,
  );

  return <NgoLegalLayout data={data} />;
}
