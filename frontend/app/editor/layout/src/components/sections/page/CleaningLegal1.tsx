"use client";

import type { ComponentType } from "react";
import type { SectionProps } from "../../../types/section";
import CalculateCTA from "../layout-src/calculatecta/page";
import CookiesContent from "../layout-src/cookiescontent/page";
import DisclaimerContent from "../layout-src/disclaimercontent/page";
import PrivacyContent from "../layout-src/privacycontent/page";
import RefundContent from "../layout-src/refundcontent/page";
import SitemapContent from "../layout-src/sitemapcontent/page";
import TermsContent from "../layout-src/termscontent/page";

const LEGAL_PAGES: Record<string, ComponentType> = {
  sitemap: SitemapContent,
  terms: TermsContent,
  privacy: PrivacyContent,
  disclaimer: DisclaimerContent,
  refund: RefundContent,
  cookies: CookiesContent,
};

function legalKey(data: Record<string, unknown>) {
  const key = String(data.policyKey || "terms");
  return key in LEGAL_PAGES ? key : "terms";
}

export default function CleaningLegal1({ data = {} }: SectionProps) {
  const backgroundImage = String(data.backgroundImage || "");
  const Content = LEGAL_PAGES[legalKey(data)];

  return (
    <>
      <div
        className="relative bg-cover bg-center"
        style={
          backgroundImage
            ? { backgroundImage: `url('${backgroundImage}')` }
            : undefined
        }
        data-editor-fields="backgroundImage policyKey"
      >
        {backgroundImage ? (
          <div className="absolute inset-0 bg-white/90" />
        ) : null}
        <div className="relative">
          <Content />
        </div>
      </div>
      {data.showCta ? <CalculateCTA /> : null}
    </>
  );
}
