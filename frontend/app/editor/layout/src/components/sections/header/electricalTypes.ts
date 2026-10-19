export interface LinkType {
  name: string;
  href: string;
  active?: boolean;
  sublinks?: LinkType[];
}

export interface TopbarData {
  contact_info: { icon: string; label?: string; value: string }[];
  socials: { icon: string; href: string }[];
  follow_text: string;
}

export interface HeaderData {
  logo_image?: string;
  logo_text: string;
  logo_subtext?: string;
  links: LinkType[];
  button_text: string;
  button_link: string;
}

export interface FooterData {
  logo_image?: string;
  logo_text: string;
  description: string;
  socials: { icon: string; href: string }[];
  quick_links: LinkType[];
  our_services: LinkType[];
  support?: LinkType[];
  tagline?: string;
  contact: { address: string; phone: string; email: string; hours?: string };
  copyright: string;
}

export interface HeroSlide {
  subtitle: string;
  title_line1: string;
  title_highlight: string;
  title_line2: string;
  description: string;
  primary_button: { text: string; href: string };
  secondary_button?: { text: string; href: string };
  image?: string;
  phone?: string;
  video_button_link?: string;
}

export interface HeroSectionData {
  slides: HeroSlide[];
}

export interface AboutSectionData {
  subtitle: string;
  title_line1: string;
  title_highlight: string;
  title_line2?: string;
  description: string;
  image?: string;
  image_secondary?: string;
  badge?: { value: string; label: string; icon?: string };
  cards?: { title: string; description: string; icon: string }[];
  features?: string[];
  button?: { text: string; href: string };
  phone?: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  image: string;
  link: string;
  icon: string;
}

export interface ServiceSidebarData {
  services_title?: string;
  enquiry?: {
    subtitle?: string;
    title?: string;
    description?: string;
    button_text?: string;
    footer_text?: string;
    form_placeholders?: {
      name?: string;
      phone?: string;
      service?: string;
      message?: string;
    };
  };
  help?: {
    title?: string;
    description?: string;
    phone?: string;
    button_text?: string;
    button_href?: string;
    time?: string;
  };
}

export interface ServicesSectionData {
  subtitle: string;
  title_line1: string;
  title_highlight: string;
  title_line2?: string;
  description: string;
  button: { text: string; href: string };
  items: ServiceItem[];
  sidebar?: ServiceSidebarData;
}

export interface StatsSectionData {
  items: { value: string; label: string; icon: string }[];
}

export interface WhyChooseItem {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseSectionData {
  subtitle: string;
  title_line1: string;
  title_line2?: string;
  title_highlight: string;
  description: string;
  image: string;
  badge_title: string;
  badge_text: string;
  button: { text: string; href: string };
  items: WhyChooseItem[];
}

export interface WorkProcessStep {
  number: string;
  icon: string;
  title: string;
  description: string;
}

export interface WorkProcessSectionData {
  subtitle: string;
  title_line1: string;
  title_highlight: string;
  description?: string;
  button?: { text: string; href: string };
  steps: WorkProcessStep[];
}

export interface TestimonialsSectionData {
  subtitle: string;
  title_line1: string;
  title_highlight: string;
  title_line2?: string;
  description: string;
  reviews: { text: string; author: string; role: string; avatar: string; rating: number }[];
}

export interface QuoteSectionData {
  subtitle: string;
  title_line1: string;
  title_line2?: string;
  title_highlight: string;
  description: string;
  image: string;
  info_card?: { title: string; description: string };
  features: { icon: string; title: string; description: string }[];
  quote_box?: { text: string; line1: string; line2: string };
  form: {
    subtitle?: string;
    title: string;
    title_highlight: string;
    description: string;
    button_text: string;
    footer_text: string;
    labels?: {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      location?: string;
      message?: string;
    };
    placeholders: {
      name: string;
      phone: string;
      email: string;
      service: string;
      location?: string;
      date?: string;
      time?: string;
      message: string;
    };
  };
  stats?: { value: string; label: string }[];
}

export interface ContactCard {
  icon: string;
  title: string;
  value?: string;
  value_line2?: string;
  href?: string;
  text?: string;
}

export interface ContactSectionData {
  subtitle?: string;
  title?: string;
  title_line1?: string;
  title_highlight?: string;
  description?: string;
  cards: ContactCard[];
  socials?: { icon: string; href: string }[];
  form: {
    subtitle: string;
    title?: string;
    description: string;
    button_text: string;
    footer_text: string;
    checkbox_text?: string;
    placeholders: {
      name: string;
      email: string;
      phone: string;
      service: string;
      location?: string;
      message: string;
    };
  };
  features?: { icon: string; title: string; description: string }[];
  center: {
    image: string;
    title: string;
    title_highlight?: string;
    overlay_title?: string;
    overlay_text?: string;
    description?: string;
    address_label?: string;
    address?: string;
    hours_label?: string;
    hours?: string[];
    help_title?: string;
    help_button?: string;
    phone?: string;
  };
  map: {
    embed_url: string;
    label: string;
    address?: string;
    link_text?: string;
    link?: string;
  };
}

export interface GalleryPhotoItem {
  image: string;
  alt: string;
  category?: string;
}

export interface PhotoGalleryData {
  subtitle: string;
  title?: string;
  title_line1?: string;
  title_highlight?: string;
  description?: string;
  filters?: { label: string; value: string }[];
  items_per_page?: number;
  items: GalleryPhotoItem[];
}

export interface ServiceBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceProcessStep {
  num: string;
  title: string;
  desc: string;
  number?: string;
  description?: string;
}

export interface ServiceContentBlock {
  title: string;
  text: string;
}

export interface ServiceDetailsData {
  title: string;
  description: string;
  image: string;
  icon?: string;
  subtitle?: string;
  badge?: string;
  overlay_line1?: string;
  overlay_highlight?: string;
  overlay_tagline?: string;
  content_blocks?: ServiceContentBlock[];
  benefits?: ServiceBenefit[];
  process?: ServiceProcessStep[];
  gallery?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  title: string;
  breadcrumb: BreadcrumbItem[];
  backgroundImage?: string;
}

export interface ThankYouSectionData {
  title: string;
  title_highlight: string;
  description: string;
  button: { text: string; href: string };
}

export interface TopbarProps { data: TopbarData }
export interface HeaderProps { data: HeaderData }
export interface FooterProps { data: FooterData }
export interface HeroProps { data: HeroSectionData }
export interface AboutProps { data: AboutSectionData; hideCta?: boolean }
export interface ServicesProps {
  data: ServicesSectionData;
  isGrid?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
  bgClass?: string;
}
export interface StatsProps { data: StatsSectionData }
export interface WhyChooseProps { data: WhyChooseSectionData }
export interface WorkProcessProps { data: WorkProcessSectionData }
export interface TestimonialsProps {
  data: TestimonialsSectionData;
  isGrid?: boolean;
  itemsPerPage?: number;
  showPagination?: boolean;
  bgClass?: string;
}
export interface QuoteProps { data: QuoteSectionData; services?: { title: string }[] }
export interface ContactProps { data: ContactSectionData; services?: { title: string }[] }
export interface PhotoGalleryProps { data: PhotoGalleryData }
export interface ServiceDetailsProps {
  data: ServiceDetailsData;
  allServices: ServiceItem[];
  sidebarData?: ServiceSidebarData;
}
export interface ThankYouProps { data: ThankYouSectionData }

export interface PageComponentRef {
  key: string;
  component: string;
}

export interface PageMeta {
  title: string;
  pageName: string;
  metadata?: { title: string };
  heading?: string;
  description?: string;
  button_text?: string;
  button_href?: string;
  components?: PageComponentRef[];
}

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
