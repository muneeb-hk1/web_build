"use client";

import type { ReactNode } from "react";
import type { SectionProps } from "../../../types/section";
import PageBanner from "../layout-src/pagebanner/page";
import PricingSection from "../layout-src/pricingsection/page";
import FeedbackSection from "../layout-src/feedbacksection/page";
import CalculateCTA from "../layout-src/calculatecta/page";
import FaqAccordion from "../layout-src/faqaccordion/page";
import AwardsSection from "../layout-src/awardssection/page";
import AchievementSection from "../layout-src/achievementsection/page";
import CareerContent from "../layout-src/careercontent/page";
import EnquiryContent from "../layout-src/enquirycontent/page";
import IndustriesContent from "../layout-src/industriescontent/page";
import ServicesSection from "../layout-src/servicessection/page";
import ProjectListing from "../layout-src/projectlisting/page";
import WorkProcess from "../layout-src/workprocess/page";
import ServiceDetailContent from "../layout-src/servicedetailcontent/page";
import NewsSection from "../layout-src/newssection/page";
import ContactContent from "../layout-src/contactcontent/page";
import QuotesContent from "../layout-src/quotescontent/page";
import BlogDetailContent from "../layout-src/blogdetailcontent/page";
import SitemapContent from "../layout-src/sitemapcontent/page";
import TermsContent from "../layout-src/termscontent/page";
import PrivacyContent from "../layout-src/privacycontent/page";
import DisclaimerContent from "../layout-src/disclaimercontent/page";
import RefundContent from "../layout-src/refundcontent/page";
import CookiesContent from "../layout-src/cookiescontent/page";

function PageShell({
  title,
  breadcrumb,
  children,
}: {
  title: string;
  breadcrumb: string;
  children: ReactNode;
}) {
  return (
    <div data-editor-fields="bannerTitle githubPage">
      <PageBanner title={title} breadcrumb={breadcrumb} />
      {children}
    </div>
  );
}

export default function CleaningInnerPage1({ data = {} }: SectionProps) {
  const page = String(data.githubPage || data.bannerTitle || "")
    .trim()
    .toLowerCase();
  const title = String(data.bannerTitle || "Pricing");
  const breadcrumb = String(data.breadcrumb || title);

  if (page === "faqs" || page === "faq") {
    return (
      <PageShell title={title === "Pricing" ? "Faqs" : title} breadcrumb={breadcrumb === "Pricing" ? "Faqs" : breadcrumb}>
        <FaqAccordion />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "awards" || page === "award") {
    return (
      <PageShell title={title === "Pricing" ? "Awards" : title} breadcrumb={breadcrumb === "Pricing" ? "Awards" : breadcrumb}>
        <AwardsSection />
        <AchievementSection />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "career" || page === "careers") {
    return (
      <PageShell title={title === "Pricing" ? "Career" : title} breadcrumb={breadcrumb === "Pricing" ? "Career" : breadcrumb}>
        <CareerContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "enquiry" || page === "inquiry") {
    return (
      <PageShell title={title === "Pricing" ? "Enquiry" : title} breadcrumb={breadcrumb === "Pricing" ? "Enquiry" : breadcrumb}>
        <EnquiryContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("industr")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Industries We Serve" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Industries We Serve" : breadcrumb}
      >
        <IndustriesContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "services-detail" || page === "service-detail") {
    return (
      <PageShell
        title={title === "Pricing" ? "Service Details" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Service Details" : breadcrumb}
      >
        <ServiceDetailContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "services" || page === "service") {
    return (
      <PageShell title={title === "Pricing" ? "Services" : title} breadcrumb={breadcrumb === "Pricing" ? "Services" : breadcrumb}>
        <ServicesSection layout="grid" />
        <WorkProcess />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "projects" || page === "project") {
    return (
      <PageShell title={title === "Pricing" ? "Projects" : title} breadcrumb={breadcrumb === "Pricing" ? "Projects" : breadcrumb}>
        <ProjectListing />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "blog" || page === "blogs") {
    return (
      <PageShell title={title === "Pricing" ? "Blogs" : title} breadcrumb={breadcrumb === "Pricing" ? "Blogs" : breadcrumb}>
        <NewsSection layout="grid" />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "blog-detail" || page === "blogs-detail") {
    return (
      <PageShell
        title={title === "Pricing" ? "Blog Detail" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Blog Detail" : breadcrumb}
      >
        <BlogDetailContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page === "contact" || page === "contact-us") {
    return (
      <PageShell title={title === "Pricing" ? "Contact Us" : title} breadcrumb={breadcrumb === "Pricing" ? "Contact Us" : breadcrumb}>
        <ContactContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("quote")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Get A Quotes" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Get A Quotes" : breadcrumb}
      >
        <QuotesContent />
        <AchievementSection />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("sitemap")) {
    return (
      <PageShell title={title === "Pricing" ? "Sitemap" : title} breadcrumb={breadcrumb === "Pricing" ? "Sitemap" : breadcrumb}>
        <SitemapContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("terms")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Terms & Conditions" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Terms & Conditions" : breadcrumb}
      >
        <TermsContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("privacy")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Privacy Policy" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Privacy Policy" : breadcrumb}
      >
        <PrivacyContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("disclaimer")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Disclaimer" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Disclaimer" : breadcrumb}
      >
        <DisclaimerContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("refund")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Refund Policy" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Refund Policy" : breadcrumb}
      >
        <RefundContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  if (page.includes("cookie")) {
    return (
      <PageShell
        title={title === "Pricing" ? "Cookies Policy" : title}
        breadcrumb={breadcrumb === "Pricing" ? "Cookies Policy" : breadcrumb}
      >
        <CookiesContent />
        <CalculateCTA />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} breadcrumb={breadcrumb}>
      <PricingSection />
      <FeedbackSection />
      <CalculateCTA />
    </PageShell>
  );
}
