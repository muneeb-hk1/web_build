"use client";

import { 
  ShieldCheck, 
  Users, 
  Leaf, 
  CircleDollarSign, 
  Clock, 
  Award, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import siteData from "../../../data/pestContent";

// Dynamic icon mapper JSON features ke liye
const renderFeatureIcon = (index: number, iconName?: string) => {
  const iconProps = { className: "w-5 h-5 text-[#00482B]", strokeWidth: 2.2 };
  
  if (iconName) {
    const lower = iconName.toLowerCase();
    if (lower.includes("shield") || lower.includes("safe")) return <ShieldCheck {...iconProps} />;
    if (lower.includes("user") || lower.includes("team") || lower.includes("pro")) return <Users {...iconProps} />;
    if (lower.includes("leaf") || lower.includes("eco")) return <Leaf {...iconProps} />;
    if (lower.includes("dollar") || lower.includes("price") || lower.includes("cost")) return <CircleDollarSign {...iconProps} />;
    if (lower.includes("clock") || lower.includes("time") || lower.includes("24")) return <Clock {...iconProps} />;
    if (lower.includes("award") || lower.includes("satisfaction") || lower.includes("guarantee")) return <Award {...iconProps} />;
  }

  const defaultIcons = [
    <ShieldCheck key="0" {...iconProps} />,
    <Users key="1" {...iconProps} />,
    <Leaf key="2" {...iconProps} />,
    <CircleDollarSign key="3" {...iconProps} />,
    <Clock key="4" {...iconProps} />,
    <Award key="5" {...iconProps} />,
  ];

  return defaultIcons[index % defaultIcons.length] || <CheckCircle2 {...iconProps} />;
};

export default function WhyChooseUs() {
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const whyData =
    pestControl?.sections?.WhyChooseUs?.variants?.PestWhyChooseUs1 ||
    pestControl?.sections?.WhyUs?.variants?.PestWhyUs1 ||
    pestControl?.sections?.Features?.variants?.PestFeatures1 ||
    {};

  const badge = whyData.pretitle || whyData.badge || "WHY CHOOSE US";
  const title = whyData.title || "Why Choose";
  const titleHighlight = whyData.titleHighlight || " ";
  const description =
    whyData.desc ||
    whyData.description ||
    whyData.subtitle ||
    "We deliver safe, effective and eco-friendly pest control solutions for homes, offices and commercial spaces. Our focus is on quality service, customer satisfaction and a healthier environment for you.";

  const fallbackFeatures = [
    {
      title: "Safe & Effective Solutions",
      desc: "We use safe and tested methods to ensure long-lasting protection.",
    },
    {
      title: "Experienced Professionals",
      desc: "Our trained team delivers reliable and high-quality pest control services.",
    },
    {
      title: "Eco-Friendly Methods",
      desc: "We care for your health and the environment with green solutions.",
    },
    {
      title: "Affordable & Transparent Pricing",
      desc: "High-quality services at competitive prices with no hidden costs.",
    },
  ];

  const rawItems: any[] =
    whyData.items || whyData.features || whyData.reasons || [];

  const features =
    rawItems.length > 0
      ? rawItems.slice(0, 4).map((item, idx) => ({
          title: item.title || item.name || fallbackFeatures[idx % fallbackFeatures.length].title,
          desc:
            item.desc ||
            item.description ||
            item.subDesc ||
            fallbackFeatures[idx % fallbackFeatures.length].desc,
          iconName: item.icon || item.iconName,
        }))
      : fallbackFeatures;

  return (
    <section className="relative bg-[#f8fbf9] py-8 md:py-10 px-5 sm:px-8 md:px-12 text-neutral-900 overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-24 right-1/4 w-[500px] h-[350px] bg-[#3fd080]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-80 h-80 bg-[#00482B]/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Dot Matrix Grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#00482B 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 items-center">
          
          {/* Left Column */}
          <div className="flex flex-col items-start">
            <div className="inline-block bg-[#d4ece0] text-[#00482B] text-xs sm:text-[13px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-xs">
              {badge}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-[38px] font-bold tracking-tight leading-tight text-neutral-900 mb-3">
              {title} <span className="text-[#00482B]">{titleHighlight}</span>
            </h2>

            <p className="text-neutral-600 text-[14px] sm:text-[15px] leading-relaxed max-w-xl mb-5 font-normal">
              {description}
            </p>

            <div className="w-full h-[1px] bg-neutral-200/80 mb-5" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 w-full">
              {features.map((feat: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#e4f4ec] flex items-center justify-center flex-shrink-0">
                    {renderFeatureIcon(idx, feat.iconName)}
                  </div>
                  <div>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-neutral-900 mb-0.5 leading-snug">
                      {feat.title}
                    </h3>
                    <p className="text-neutral-600 text-[12.5px] sm:text-[13px] leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}