import Pricing from "./Pricing";
import SitePageShell from "./SitePageShell";

export default function PricingPage() {
  return (
    <SitePageShell
      title={
        <>
          Simple <span className="text-blue-600">pricing</span>
        </>
      }
      subtitle="Start on Free, then upgrade to a paid page plan that matches your theme — Starter (25), Professional (50), Business (100), or Enterprise (125). Paying does not change your theme."
      cta={{ label: "Start building", href: "/auth" }}
      bandTitle="Free plus four page plans. One clear plan per website — no separate theme fee."
    >
      <Pricing hideHeader />
    </SitePageShell>
  );
}
