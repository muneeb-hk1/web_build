"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import siteData from "../../../data/pestContent";

interface ServiceItem {
  slug: string;
  name: string;
  [key: string]: any;
}

export default function ContactContent() {
  const common = (siteData as any).common || {};
  const pestControl =
    (siteData as any).categories?.PestControl || (siteData as any).PestControl || {};
  const contactData =
    pestControl?.sections?.Contact?.variants?.PestContact1 || {};
  const servicesList: ServiceItem[] =
    pestControl?.sections?.Services?.variants?.PestServices1?.items || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
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
        subject: "",
        service: "",
        message: "",
      });
    }, 1000);
  };

  return (
<section className="bg-white py-10 md:py-12 px-5 sm:px-8 md:px-12 text-neutral-900">      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-[2px] bg-[#00482B]" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#00482B]">
                  {contactData.badge || "CONTACT US"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                {contactData.title || "Let’s Connect for a Pest-Free Tomorrow"}
              </h2>
              <p className="mt-3.5 text-neutral-600 text-sm leading-relaxed">
                {contactData.description ||
                  "Have a question, need a quick quote, or want to schedule an inspection? Our team is here to help."}
              </p>
            </div>

            <div className="flex flex-col divide-y divide-neutral-100">
              {/* Office Address */}
              <div className="flex items-start gap-4 py-5 first:pt-0">
                <div className="w-12 h-12 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-base">
                    {contactData.office?.title || "Our Office"}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                    {contactData.office?.address || common.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 py-5">
                <div className="w-12 h-12 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-base">
                    {contactData.call?.title || "Call Us"}
                  </h4>
                  <a
                    href={`tel:${(contactData.call?.phone || common.phone || "").replace(/\s+/g, "")}`}
                    className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#00482B] mt-1 inline-block transition"
                  >
                    {contactData.call?.phone || common.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 py-5 last:pb-0">
                <div className="w-12 h-12 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-neutral-900 text-base">
                    {contactData.email?.title || "Email Us"}
                  </h4>
                  <a
                    href={`mailto:${contactData.email?.email || common.email}`}
                    className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#00482B] mt-1 inline-block transition"
                  >
                    {contactData.email?.email || common.email}
                  </a>
                  {contactData.email?.note && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {contactData.email.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#f7faf8] border border-[#e2ece5] rounded-3xl p-8 sm:p-10 shadow-sm relative min-h-[490px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center text-center py-10 px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-[#e4f4ed] text-[#00482B] flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle2 size={46} strokeWidth={2.3} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    Thank You!
                  </h3>
                  <p className="text-neutral-600 text-sm max-w-md mt-2 mb-8 leading-relaxed">
                    Your request has been received successfully. One of our pest control specialists will connect with you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-[#00482B] hover:bg-[#063321] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition shadow cursor-pointer"
                  >
                    Send Another Message
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
                    Send Us a <span className="text-[#00482B]">Message</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-2 mb-8 leading-relaxed">
                    Fill out the form below and our pest control team will get back to you with the most effective plan for your needs.
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
                        required
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#00482B] transition"
                      />
                    </div>

                    <select
                      value={formData.service}
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

                    <textarea
                      rows={4}
                      required
                      placeholder="Your Message *"
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
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
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

        {/* Map */}
        {contactData.mapLocation?.embedUrl && (
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border border-neutral-200 shadow-sm">
            <iframe
              title="Google Maps Location"
              src={contactData.mapLocation.embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />

            <div className="absolute top-6 left-6 max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-neutral-200 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#00482B] text-white flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h5 className="font-extrabold text-xs uppercase tracking-wider text-neutral-800">
                  {contactData.mapLocation.label || "Our Office Location"}
                </h5>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  {contactData.office?.address || common.address}
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#00482B] hover:underline mt-2 inline-flex items-center gap-1"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}