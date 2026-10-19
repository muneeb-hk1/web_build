import { serviceHome1Content } from "./layoutSite";

const ASSET = "/categories/cleaning/template1";

export { serviceHome1Content };

export const serviceHome1SectionVariants = {
  Header: {
    ServiceHeader1: {
      accentColor: "#1FA463",
      logoType: "image",
      logo: "CleanPro",
      logoImage: `${ASSET}/logo/newlogo1.png`,
      logoImageTitle: "CleanPro",
      headerType: "sticky",
      headerBackgroundType: "solid",
      headerBackgroundColor: "#ffffff",
      headerGradientColor: "#1FA463",
      headerTextColor: "#0D2235",
      phoneLabel: serviceHome1Content.header.phoneLabel,
      phoneNumber: serviceHome1Content.header.phoneNumber,
      buttons: [
        {
          label: serviceHome1Content.header.buttonText,
          href: "/quotes",
          variant: "primary",
        },
      ],
      menu: serviceHome1Content.header.navLinks.map((item) => ({
        label: item.title,
        href: item.href,
        children: item.subLinks?.map((child) => ({
          label: child.title,
          href: child.href,
        })),
      })),
    },
  },
  Banner: {
    ServiceBanner1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.hero.subtitle,
      title: serviceHome1Content.hero.titleLine1,
      titleHighlight: serviceHome1Content.hero.titleHighlight,
      desc: serviceHome1Content.hero.description,
      backgroundImage: serviceHome1Content.hero.backgroundImage,
      bannerHeight: 75,
      buttons: [
        {
          label: serviceHome1Content.hero.buttonText,
          href: serviceHome1Content.hero.buttonLink || "/contact",
          variant: "primary",
        },
      ],
    },
  },
  Stats: {
    ServiceStats1: {
      backgroundColor: "#0B4C34",
      stats: serviceHome1Content.stat.stats.map((item) => ({
        icon: item.iconName,
        iconName: item.iconName,
        value: item.value,
        title: item.title,
      })),
    },
  },
  About: {
    ServiceAbout1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.about.subtitle,
      title: `${serviceHome1Content.about.titleLine1} ${serviceHome1Content.about.titleLine2}`,
      desc: serviceHome1Content.about.description1,
      desc2: serviceHome1Content.about.description2,
      features: serviceHome1Content.about.features,
      experienceYears: serviceHome1Content.about.experienceYears,
      experienceText: serviceHome1Content.about.experienceText,
      image: serviceHome1Content.about.image,
      buttonText: serviceHome1Content.about.buttonText,
      buttonHref: serviceHome1Content.about.buttonLink || "/about",
    },
  },
  Service: {
    ServiceService1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.services.subtitle,
      title: serviceHome1Content.services.title,
      services: serviceHome1Content.services.items.map((item) => ({
        title: item.title,
        desc: item.description,
        image: item.image,
        icon: item.iconName,
        iconName: item.iconName,
        href: "/services/detail",
      })),
    },
  },
  WhyChooseUs: {
    ServiceWhyChooseUs1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.workProcess.subtitle,
      title: serviceHome1Content.workProcess.title,
      desc: serviceHome1Content.workProcess.description,
      steps: serviceHome1Content.workProcess.steps,
    },
  },
  Gallery: {
    ServiceGallery1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.partners.subtitle,
      title: serviceHome1Content.partners.title,
      desc: serviceHome1Content.partners.description,
      items: serviceHome1Content.partners.items.map((item) => ({
        name: item.name,
        category: item.category,
        icon: item.iconName,
        iconName: item.iconName,
        color: item.color,
      })),
    },
  },
  Product: {
    ServiceProduct1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.project.subtitle,
      title: serviceHome1Content.project.title,
      projectItems: serviceHome1Content.project.projects,
    },
  },
  Awards: {
    ServiceAwards1: {
      accentColor: "#1FA463",
      items: serviceHome1Content.achievements.items.map((item) => ({
        icon: item.iconName,
        iconName: item.iconName,
        value: item.value,
        title: item.title,
        description: item.description,
      })),
    },
  },
  Testimonial: {
    ServiceTestimonial1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.feedback.subtitle,
      title: serviceHome1Content.feedback.titleLine1,
      titleLine2: serviceHome1Content.feedback.titleLine2,
      testimonialItems: serviceHome1Content.feedback.feedbacks.map((item) => ({
        name: item.name,
        role: item.role,
        image: item.image,
        quote: item.content,
        content: item.content,
      })),
    },
  },
  Blog: {
    ServiceBlog1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.news.subtitle,
      title: serviceHome1Content.news.title,
      blogItems: serviceHome1Content.news.items.map((item) => ({
        title: item.title,
        date: item.date,
        image: item.image,
        href: item.link,
        link: item.link,
      })),
    },
  },
  FormDetail: {
    ServiceFormDetail1: {
      accentColor: "#1FA463",
      pretitle: serviceHome1Content.calculateCTA.subtitle,
      title: serviceHome1Content.calculateCTA.title,
      emailPlaceholder: serviceHome1Content.calculateCTA.emailPlaceholder,
      selectPlaceholder: serviceHome1Content.calculateCTA.selectPlaceholder,
      options: serviceHome1Content.calculateCTA.options,
      buttonText: serviceHome1Content.calculateCTA.buttonText,
      buttonHref: serviceHome1Content.calculateCTA.buttonLink || "/contact",
    },
  },
  Footer: {
    ServiceFooter1: {
      accentColor: "#1FA463",
      logoImage: `${ASSET}/logo/whitelogo.png`,
      logoImageTitle: "CleanPro",
      desc: serviceHome1Content.footer.description,
      footerContact: {
        address: serviceHome1Content.footer.address,
        location: serviceHome1Content.footer.address,
        email: serviceHome1Content.footer.email,
        phone: serviceHome1Content.footer.phone,
      },
      footerColumns: [
        {
          title: "Quick Links",
          links: serviceHome1Content.footer.quickLinks,
        },
      ],
      footerSocialLinks: [
        { label: "facebook", href: serviceHome1Content.footer.social.facebook },
        { label: "linkedin", href: serviceHome1Content.footer.social.linkedin },
        { label: "twitter", href: serviceHome1Content.footer.social.twitter },
        { label: "instagram", href: serviceHome1Content.footer.social.instagram },
      ],
      footerLegalLinks: serviceHome1Content.footer.footerLinks,
      copyrightText: serviceHome1Content.footer.copyright,
    },
  },
} as const;
