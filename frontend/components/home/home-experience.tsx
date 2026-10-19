"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import DeferredMotionShell from "./DeferredMotionShell";
import HomeNav from "./home-nav";
import HeroSection from "./hero-section";
import DraftResumeModal from "./DraftResumeModal";
import BusinessOnboarding from "@/components/sections/businessonboarding";
import HomeFooter from "@/components/layout/home-footer";
import { FooterProvider } from "@/components/layout/footercontext";
import { UserAuthProvider } from "@/components/auth/UserAuthContext";
import { activateFlowPreviewStorage } from "@/lib/flowPreviewStorage";
import { getOnboardingDraftSummary } from "@/lib/onboardingDraft";
import { resetGuestWebsiteProgress } from "@/lib/userDraftReset";
import { clearUserActiveSiteId } from "@/lib/migrateGuestSite";
import { confirmStartFresh } from "@/lib/confirmDialog";

const WhatWeDo = dynamic(() => import("./WhatWeDo"));
const SocialProof = dynamic(() => import("./SocialProof"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));

export default function HomeExperience() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingKey, setOnboardingKey] = useState(0);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftSummary, setDraftSummary] = useState<
    ReturnType<typeof getOnboardingDraftSummary>
  >(null);

  const refreshDraftSummary = useCallback(() => {
    setDraftSummary(getOnboardingDraftSummary());
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(refreshDraftSummary);
    return () => window.cancelAnimationFrame(frame);
  }, [refreshDraftSummary]);

  // Editor → Create with Fully AI / Template: skip marketing home, open onboarding chooser.
  useEffect(() => {
    try {
      if (
        sessionStorage.getItem("lestow-start-create-ai") === "1" ||
        sessionStorage.getItem("lestow-start-create-custom") === "1"
      ) {
        setShowOnboarding(true);
      }
    } catch {
      /* private mode */
    }
  }, []);

  const startBuilding = () => setShowOnboarding(true);

  const handleHeroStart = () => {
    if (draftSummary) {
      setDraftModalOpen(true);
      return;
    }
    startBuilding();
  };

  const resumeEditor = () => {
    if (!draftSummary?.editorUrl) return;
    if (draftSummary.createPath === "redesign") {
      activateFlowPreviewStorage("redesign");
    } else if (draftSummary.createPath === "create-custom") {
      activateFlowPreviewStorage("create-custom");
    }
    router.push(draftSummary.editorUrl);
  };

  const resumeSetup = () => {
    if (draftSummary?.createAiUrl) {
      setDraftModalOpen(false);
      router.push(draftSummary.createAiUrl);
      return;
    }
    if (
      draftSummary?.createPath === "create-custom" &&
      draftSummary.editorUrl &&
      !draftSummary.hasEditorEdits
    ) {
      setDraftModalOpen(false);
      router.push(draftSummary.editorUrl);
      return;
    }
    startBuilding();
  };

  const handleStartFresh = async () => {
    const ok = await confirmStartFresh();
    if (!ok) return;

    resetGuestWebsiteProgress();
    clearUserActiveSiteId();
    setDraftSummary(null);
    refreshDraftSummary();
    setDraftModalOpen(false);
    setOnboardingKey((key) => key + 1);
    setShowOnboarding(true);
  };

  return (
    <UserAuthProvider>
      <FooterProvider>
        {!showOnboarding ? (
          <DeferredMotionShell>
            <main className="overflow-x-clip bg-[#050b13] selection:bg-[#b9ff66] selection:text-[#07111e]">
              <HomeNav />
              <HeroSection
                onStart={handleHeroStart}
                draftSummary={draftSummary}
              />
              <DraftResumeModal
                open={draftModalOpen}
                draftSummary={draftSummary}
                onClose={() => setDraftModalOpen(false)}
                onContinueSetup={resumeSetup}
                onResumeEditor={resumeEditor}
                onStartFresh={handleStartFresh}
              />
              <WhatWeDo />
              <SocialProof />
              <Pricing onStart={handleHeroStart} />
              <FAQ />
              <HomeFooter onStart={handleHeroStart} />
            </main>
          </DeferredMotionShell>
        ) : (
          <BusinessOnboarding
            key={onboardingKey}
            onBack={() => {
              setShowOnboarding(false);
              refreshDraftSummary();
            }}
            onDraftChange={refreshDraftSummary}
          />
        )}
      </FooterProvider>
    </UserAuthProvider>
  );
}
