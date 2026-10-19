export interface HeroData {
    subtitle: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    buttonText: string;
    buttonLink?: string;
    backgroundImage: string;
}

export interface Job {
    title: string;
    location: string;
    type: string;
    iconName: string;
    slug: string;
    description: string;
    requirements: string[];
    benefits: string[];
}

export interface ServiceItem {
    id: number;
    title: string;
    description: string;
    image: string;
    iconName: string;
}

export interface ServicesData {
    subtitle: string;
    title: string;
    items: ServiceItem[];
}

export interface AboutData {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description1: string;
    description2: string;
    features: string[];
    experienceYears: number;
    experienceText: string;
    image: string;
    buttonText: string;
    buttonLink?: string;
}

export interface AchievementItem {
    iconName: string;
    value: string;
    title: string;
    description: string;
}

export interface AchievementData {
    items: AchievementItem[];
}

export interface AwardItem {
    title: string;
    description: string;
    iconType: string;
}

export interface AwardsData {
    subtitle: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    items: AwardItem[];
}

export interface BlogSidebarData {
    searchPlaceholder: string;
    recentNewsTitle: string;
    recentNews: {
        title: string;
        date: string;
        img: string;
    }[];
}

export interface SidebarData {
    searchTitle: string;
    searchPlaceholder: string;
    categoriesTitle: string;
    categories: string[];
    relatedPostTitle: string;
    relatedPosts: {
        title: string;
        date: string;
        image: string;
    }[];
}

export interface CalculateCTAData {
    subtitle: string;
    title: string;
    emailPlaceholder: string;
    selectPlaceholder: string;
    options: {
        value: string;
        label: string;
    }[];
    buttonText: string;
}

export interface CareerData {
    subtitle: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    benefits: { iconName: string; title: string }[];
    openingsTitle: string;
    openingsDescription: string;
    jobs: Job[];
    viewAllText: string;
    formTitle: string;
    formDescription: string;
    whyWorkTitle: string;
    whyWorkItems: { iconName: string; title: string; desc: string; span: string }[];
}

export interface ContactData {
    locationSubtitle: string;
    locationTitle: string;
    locations: { iconName: string; title: string; lines: string[] }[];
    formSubtitle: string;
    formTitle: string;
}

export interface EnquiryData {
    subtitle: string;
    titleLine1: string;
    titleHighlight: string;
    description: string;
    getInTouchTitle: string;
    getInTouchDescription: string;
    contactMethods: { iconName: string; title: string; description: string }[];
    formTitle: string;
}

export interface FaqData {
    items: { question: string; answer: string }[];
}

export interface FeedbackData {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    feedbacks: { name: string; role: string; image: string; content: string }[];
}

export interface IndustryData {
    subtitle: string;
    title: string;
    description: string;
    items: { id: number; title: string; description: string; iconName: string }[];
}

export interface NewsData {
    subtitle: string;
    title: string;
    items: { title: string; date: string; image: string; link: string }[];
}

export interface PartnersData {
    subtitle: string;
    title: string;
    description: string;
    items: { name: string; category: string; iconName: string; color: string }[];
}

export interface PricingData {
    subtitle: string;
    title: string;
    plans: {
        name: string;
        description: string;
        price: string;
        features: { text: string; included: boolean }[];
    }[];
}

export interface ProjectData {
    subtitle: string;
    title: string;
    projects: {
        title: string;
        category: string;
        image: string;
    }[];
}

export interface StatData {
    stats: {
        iconName: string;
        value: string;
        title: string;
    }[];
}

export interface TeamData {
    subtitle: string;
    title: string;
    members: {
        name: string;
        role: string;
        image: string;
    }[];
}

export interface TeamDetailData {
    profile: {
        name: string;
        role: string;
        image: string;
        description: string;
        phone: string;
        location: string;
        email: string;
        social: {
            facebook: string;
            twitter: string;
            pinterest: string;
            linkedin: string;
        };
    };
    skillsSection: {
        subtitle: string;
        title: string;
        description: string;
        image: string;
        skills: {
            title: string;
            percentage: number;
        }[];
    };
}

export interface TestimonialGridData {
    subtitle: string;
    title: string;
    testimonials: {
        name: string;
        role: string;
        content: string;
    }[];
}

export interface WorkProcessData {
    subtitle: string;
    title: string;
    description: string;
    steps: {
        num: string;
        title: string;
        desc: string;
        mainIcon: string;
        subIcon: string;
    }[];
}

export interface SitemapData {
    subtitle: string;
    title: string;
    description: string;
    sitemapTree: {
        title: string;
        subtitle: string;
        iconName: string;
        href: string;
        items: {
            label: string;
            href: string;
        }[];
    }[];
}

export interface QuotesData {
    subtitle: string;
    title: string;
    placeholders: {
        name: string;
        email: string;
        select: string;
        message: string;
    };
    options: {
        value: string;
        label: string;
    }[];
    buttonText: string;
}

export interface PolicySection {
    title: string;
    paragraphs?: string[];
    list?: {
        items: string[];
        isOrdered?: boolean;
    };
}

export interface HeaderData {
    navLinks: {
        title: string;
        href: string;
        dropdown?: boolean;
        subLinks?: { title: string; href: string; }[];
    }[];
    phoneLabel: string;
    phoneNumber: string;
    buttonText: string;
}

export interface FooterData {
    description: string;
    social: {
        facebook: string;
        linkedin: string;
        twitter: string;
        instagram: string;
    };
    address: string;
    email: string;
    phone: string;
    quickLinks: { label: string; href: string; }[];
    copyright: string;
    footerLinks: { label: string; href: string; }[];
}

export interface PolicyData {
    lastUpdated: string;
    sections: PolicySection[];
}

export interface SiteData {
    hero: HeroData;
    services: ServicesData;
    about: AboutData;
    achievements: AchievementData;
    awards: AwardsData;
    blogSidebar: BlogSidebarData;
    sidebar: SidebarData;
    calculateCTA: CalculateCTAData;
    career: CareerData;
    contact: ContactData;
    enquiry: EnquiryData;
    faq: FaqData;
    feedback: FeedbackData;
    industries: IndustryData;
    news: NewsData;
    partners: PartnersData;
    pricing: PricingData;
    project: ProjectData;
    stat: StatData;
    team: TeamData;
    teamDetail: TeamDetailData;
    testimonialGrid: TestimonialGridData;
    workProcess: WorkProcessData;
    sitemap: SitemapData;
    quotes: QuotesData;
    cookies: PolicyData;
    disclaimer: PolicyData;
    privacy: PolicyData;
    refund: PolicyData;
    terms: PolicyData;
    header: HeaderData;
    footer: FooterData;
}
