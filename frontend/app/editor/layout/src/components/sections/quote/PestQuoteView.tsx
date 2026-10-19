"use client";

import { useState } from "react";
import {
  FileText,
  Clock,
  Users,
  Phone,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import siteData from "../../../data/pestContent";

interface ServiceItem {
  slug: string;
  name: string;
  [key: string]: any;
}

interface FeatureItem {
  title: string;
  description: string;
}

export default function QuoteContent() {
  const common = (siteData as any).common || {};
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};

  // Dynamic Quote Section Data from JSON
  const quoteData =
    pestControl?.sections?.Quote?.variants?.PestQuote1 ||
    pestControl?.sections?.Contact?.variants?.PestContact1 ||
    {};

  // Dynamic Services List for Dropdown
  const servicesList: ServiceItem[] =
    pestControl?.sections?.Services?.variants?.PestServices1?.items || [];

  // Content Bindings with Fallbacks
  const badge = quoteData.badge || "GET A QUOTE";
  const title = quoteData.title || "Reliable Pest Control";
  const titleHighlight = quoteData.titleHighlight || "Solutions for You";
  const description =
    quoteData.description ||
    "Share your requirements with us and get a customized pest control treatment plan tailored to your property. Our team will get back to you with the best proposal.";

  const features: FeatureItem[] = quoteData.features || [
    {
      title: "Customized Plans",
      description: "Solutions designed specifically for your space and severity level.",
    },
    {
      title: "Quick Response",
      description: "We will review your inspection request within 24 hours.",
    },
    {
      title: "Expert Team",
      description: "Certified technicians using safe, eco-approved methodologies.",
    },
  ];

  const supportBox = quoteData.supportBox || {
    title: "Have any questions?",
    subtitle: "Call us now for immediate assistance.",
  };

  const formMeta = quoteData.form || {
    title: "Request a",
    titleHighlight: "Quote",
    description: "Fill out the form below and we will get back to you with a customized proposal.",
  };

  const phone = common.phone || "+91 98765 43210";

  // Feature icons mapping by index
  const featureIcons = [
    <FileText key="1" size={20} />,
    <Clock key="2" size={20} />,
    <Users key="3" size={20} />,
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        location: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <section className="bg-white py-16 px-6 md:px-12 text-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Info & Features List */}
          <div className="lg:col-span-5 flex flex-col gap-8 relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-[2px] bg-[#00482B]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#00482B]">
                  {badge}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                {title} <span className="text-[#00482B]">{titleHighlight}</span>
              </h2>
              <p className="mt-3.5 text-neutral-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Dynamic Features List from JSON */}
            <div className="flex flex-col gap-6 z-10">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center flex-shrink-0">
                    {featureIcons[idx % featureIcons.length]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-neutral-900 text-base">
                      {feat.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions Support Box from JSON & common.phone */}
            <div className="bg-[#f0f8f4] border border-[#d6ecdf] rounded-2xl p-5 flex items-center gap-4 z-10 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#00482B] text-white flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h5 className="font-bold text-neutral-900 text-sm">
                  {supportBox.title}
                </h5>
                <p className="text-xs text-neutral-500">
                  {supportBox.subtitle}
                </p>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-sm font-extrabold text-[#00482B] hover:underline mt-0.5 inline-block"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Quote Request Form */}
          <div className="lg:col-span-7 bg-[#f7faf8] border border-[#e2ece5] rounded-3xl p-8 sm:p-10 shadow-sm relative min-h-[580px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center text-center py-12 px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 size={46} strokeWidth={2.3} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Quote Request Received!
                  </h3>
                  <p className="text-neutral-600 text-sm max-w-md mt-2 mb-8 leading-relaxed">
                    Thank you for reaching out. Our pest control coordinator is preparing your customized estimation and will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-[#00482B] hover:bg-[#063321] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition shadow cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {formMeta.title} <span className="text-[#00482B]">{formMeta.titleHighlight}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 mb-8 leading-relaxed">
                    {formMeta.description}
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Email *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Your Phone Number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                      <input
                        type="text"
                        placeholder="Company / Property Name"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select
                        value={formData.service}
                        required
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-[#00482B] transition cursor-pointer"
                      >
                        <option value="">Select Service *</option>
                        {servicesList.map((svc: ServiceItem) => (
                          <option key={svc.slug} value={svc.slug}>
                            {svc.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Preferred Location / City"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                    </div>

                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your property / requirements *"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition resize-none"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto self-start mt-2 inline-flex items-center justify-center gap-2 bg-[#00482B] hover:bg-[#063321] disabled:opacity-75 text-white font-extrabold text-sm px-8 py-4 rounded-xl transition shadow-md cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}