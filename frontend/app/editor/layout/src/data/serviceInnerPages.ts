import type { SectionData, SectionItem } from "../types/section";

const createServiceInnerPage = (
  page: string,
  type: string,
  variant: string,
  extra?: Record<string, unknown>,
): SectionItem => ({
  id: `service-${page}-${type.toLowerCase()}`,
  page,
  type,
  variant,
  data: {
    [variant]: (extra ?? {}) as SectionData,
  },
});

/** Inner-page section list for Service / Cleaning template-1 (caller merges category data). */
export const getServiceInnerPageSources = (): SectionItem[] =>
  [
    createServiceInnerPage("pricing", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "pricing",
      bannerTitle: "Pricing",
      breadcrumb: "Pricing",
    }),
    createServiceInnerPage("pricing", "Pricing", "ServicePricing1"),
    createServiceInnerPage("pricing", "Feedback", "ServiceFeedback1", {
      githubPage: "pricing",
      showCta: true,
    }),
    createServiceInnerPage("about", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "about",
      bannerTitle: "About",
      breadcrumb: "About",
    }),
    createServiceInnerPage("about", "About", "ServiceAbout1"),
    createServiceInnerPage("about", "WhyChooseUs", "ServiceWhyChooseUs1"),
    createServiceInnerPage("about", "Team", "ServiceTeam1"),
    createServiceInnerPage("about", "Feedback", "ServiceFeedback1", {
      githubPage: "about",
    }),
    createServiceInnerPage("about", "Achievement", "ServiceAchievement1", {
      showCta: true,
    }),
    createServiceInnerPage("testimonials", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "testimonials",
      bannerTitle: "Testimonial",
      breadcrumb: "Testimonial",
    }),
    createServiceInnerPage("testimonials", "TestimonialGrid", "ServiceTestimonialGrid1"),
    createServiceInnerPage("testimonials", "Partners", "ServicePartners1", {
      showCta: true,
    }),
    createServiceInnerPage("faqs", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "faqs",
      bannerTitle: "Faqs",
      breadcrumb: "Faqs",
    }),
    createServiceInnerPage("faqs", "Faq", "ServiceFaq1", {
      showCta: true,
    }),
    createServiceInnerPage("awards", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "awards",
      bannerTitle: "Awards",
      breadcrumb: "Awards",
    }),
    createServiceInnerPage("awards", "AwardList", "ServiceAwardList1"),
    createServiceInnerPage("awards", "Achievement", "ServiceAchievement1", {
      showCta: true,
    }),
    createServiceInnerPage("team", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "team",
      bannerTitle: "Our Team",
      breadcrumb: "Our Team",
    }),
    createServiceInnerPage("team", "Team", "ServiceTeam1", {
      teamLayout: "grid",
    }),
    createServiceInnerPage("team", "Partners", "ServicePartners1", {
      showCta: true,
    }),
    createServiceInnerPage("career", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "career",
      bannerTitle: "Career",
      breadcrumb: "Career",
    }),
    createServiceInnerPage("career", "Career", "ServiceCareer1", {
      showCta: true,
    }),
    createServiceInnerPage("enquiry", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "enquiry",
      bannerTitle: "Enquiry",
      breadcrumb: "Enquiry",
    }),
    createServiceInnerPage("enquiry", "Enquiry", "ServiceEnquiry1", {
      showCta: true,
    }),
    createServiceInnerPage("industries", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "industries",
      bannerTitle: "Industries We Serve",
      breadcrumb: "Industries We Serve",
    }),
    createServiceInnerPage("industries", "Industries", "ServiceIndustries1", {
      showCta: true,
    }),
    createServiceInnerPage("services", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "services",
      bannerTitle: "Services",
      breadcrumb: "Services",
    }),
    createServiceInnerPage("services", "Service", "ServiceService1", {
      layout: "grid",
    }),
    createServiceInnerPage("services", "WhyChooseUs", "ServiceWhyChooseUs1", {
      showCta: true,
    }),
    createServiceInnerPage("projects", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "projects",
      bannerTitle: "Projects",
      breadcrumb: "Projects",
    }),
    createServiceInnerPage("projects", "ProjectList", "ServiceProjectList1", {
      showCta: true,
    }),
    createServiceInnerPage("services-detail", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "services-detail",
      bannerTitle: "Service Details",
      breadcrumb: "Service Details",
    }),
    createServiceInnerPage("services-detail", "ServiceDetail", "ServiceServiceDetail1", {
      showCta: true,
    }),
    createServiceInnerPage("blog", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "blog",
      bannerTitle: "Blogs",
      breadcrumb: "Blogs",
    }),
    createServiceInnerPage("blog", "BlogList", "ServiceBlogList1", {
      showCta: true,
    }),
    createServiceInnerPage("blog-detail", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "blog-detail",
      bannerTitle: "Blog Detail",
      breadcrumb: "Blog Detail",
    }),
    createServiceInnerPage("blog-detail", "BlogPostDetail", "ServiceBlogDetail1", {
      showCta: true,
    }),
    createServiceInnerPage("contact", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "contact",
      bannerTitle: "Contact Us",
      breadcrumb: "Contact Us",
    }),
    createServiceInnerPage("contact", "Contact", "ServiceContact1", {
      showCta: true,
    }),
    createServiceInnerPage("quotes", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "quotes",
      bannerTitle: "Get A Quotes",
      breadcrumb: "Get A Quotes",
    }),
    createServiceInnerPage("quotes", "Quotes", "ServiceQuotes1"),
    createServiceInnerPage("quotes", "Achievement", "ServiceAchievement1", {
      showCta: true,
    }),
    createServiceInnerPage("sitemap", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "sitemap",
      bannerTitle: "Sitemap",
      breadcrumb: "Sitemap",
    }),
    createServiceInnerPage("sitemap", "Legal", "ServiceLegal1", {
      policyKey: "sitemap",
      showCta: true,
    }),
    createServiceInnerPage("terms-conditions", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "terms-conditions",
      bannerTitle: "Terms & Conditions",
      breadcrumb: "Terms & Conditions",
    }),
    createServiceInnerPage("terms-conditions", "Legal", "ServiceLegal1", {
      policyKey: "terms",
      showCta: true,
    }),
    createServiceInnerPage("privacy-policy", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "privacy-policy",
      bannerTitle: "Privacy Policy",
      breadcrumb: "Privacy Policy",
    }),
    createServiceInnerPage("privacy-policy", "Legal", "ServiceLegal1", {
      policyKey: "privacy",
      showCta: true,
    }),
    createServiceInnerPage("disclaimer", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "disclaimer",
      bannerTitle: "Disclaimer",
      breadcrumb: "Disclaimer",
    }),
    createServiceInnerPage("disclaimer", "Legal", "ServiceLegal1", {
      policyKey: "disclaimer",
      showCta: true,
    }),
    createServiceInnerPage("refund-policy", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "refund-policy",
      bannerTitle: "Refund Policy",
      breadcrumb: "Refund Policy",
    }),
    createServiceInnerPage("refund-policy", "Legal", "ServiceLegal1", {
      policyKey: "refund",
      showCta: true,
    }),
    createServiceInnerPage("cookies-policy", "Breadcrumb", "ServiceBreadcrumb1", {
      githubPage: "cookies-policy",
      bannerTitle: "Cookies Policy",
      breadcrumb: "Cookies Policy",
    }),
    createServiceInnerPage("cookies-policy", "Legal", "ServiceLegal1", {
      policyKey: "cookies",
      showCta: true,
    }),
  ];

