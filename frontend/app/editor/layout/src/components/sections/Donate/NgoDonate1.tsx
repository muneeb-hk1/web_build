"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    ShieldCheck,
    Heart,
    HandHeart,
    User,
} from "lucide-react";
import { site, type NGODonateData } from "../data/categorySite";
import type { SectionProps } from "../../../types/section";
import EditableNgoIcon from "../../builder/EditableNgoIcon";

export default function NgoDonate1({ data: customData }: SectionProps) {
    const custom = customData as unknown as Partial<NGODonateData> | undefined;
    const data = {
        ...site.donate,
        ...custom,
        banner: { ...site.donate.banner, ...custom?.banner },
        content: {
            ...site.donate.content,
            ...custom?.content,
            heroCard: { ...site.donate.content.heroCard, ...custom?.content?.heroCard },
            formFields: { ...site.donate.content.formFields, ...custom?.content?.formFields },
        },
        sidebar: {
            ...site.donate.sidebar,
            ...custom?.sidebar,
            promoBanner: {
                ...site.donate.sidebar.promoBanner,
                ...custom?.sidebar?.promoBanner,
            },
        },
    };
    const { content, sidebar } = data;

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full bg-[#fcfcfc] text-slate-800 font-sans antialiased min-h-screen">
            {/* 2. Main Container (Main Form + Right Sidebar) */}
            <section
                data-editor-section-label="Donate"
                data-editor-fields="content sidebar"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    {/* LEFT COLUMN: Donation Form (8 Cols) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Hero Image Card Header */}
                        {content?.heroCard && (
                            <div className="relative w-full h-[220px] sm:h-[300px] md:h-[340px]">
                                <Image
                                    src={content.heroCard.imageUrl}
                                    alt="Donation Hero"
                                    fill
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    className="object-cover"
                                    data-editor-media
                                    data-editor-media-type="image"
                                    data-editor-media-src={content.heroCard.imageUrl}
                                />
                                <div className="absolute inset-0 bg-black/25" />

                                {/* Floating Overlay Badge */}
                                <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 text-white flex items-center gap-3.5 max-w-[260px] sm:max-w-xs">
                                    <div className="p-2.5 bg-orange-500/80 rounded-xl text-white shrink-0">
                                        <HandHeart className="w-6 h-6 stroke-[1.8]" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] sm:text-sm font-bold tracking-wider text-orange-300 uppercase">
                                            {content.heroCard.badgeText}
                                        </span>
                                        <p className="text-sm sm:text-sm font-semibold leading-snug">
                                            {content.heroCard.subtext}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Donation Form Body */}
                        <div className="p-6 sm:p-8 md:p-10 space-y-8">
                            {/* Heading & Subtitle */}
                            <div className="space-y-3">
                                {content?.sectionBadge && (
                                    <div className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-orange-500 uppercase">
                                        <Heart className="w-4 h-4 fill-orange-500" />
                                        <span>{content.sectionBadge}</span>
                                    </div>
                                )}

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                    {content?.title}{" "}
                                    <span className="text-orange-500">
                                        {content?.highlightedTitleWord}
                                    </span>
                                </h1>

                                {content?.description && (
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                        {content.description}
                                    </p>
                                )}
                            </div>

                            {/* SECTION: Choose Donation Amount */}
                            {/* <div className="space-y-4 pt-2"> */}
                            {/* <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {content?.amountSectionTitle || "Choose your donation amount"}
                  </h3> */}

                            {/* Custom Amount Input */}
                            {/* <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder={
                        content?.customAmountPlaceholder || "Enter custom amount"
                      }
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-9 pr-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                    />
                  </div> */}

                            {/* Preset Amount Grid */}
                            {/* {content?.amounts && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
                      {content.amounts.map((amtObj, idx) => {
                        const isSelected = selectedAmount === amtObj.amount;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAmountClick(amtObj.amount)}
                            className={`py-3 px-2 rounded-xl text-sm sm:text-sm font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                                : "bg-slate-50 text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-100/70"
                            }`}
                          >
                            {amtObj.amount}
                          </button>
                        );
                      })}
                    </div>
                //   )} */}
                            {/* // </div> */}

                            {/* SECTION: Select Payment Method */}
                            {/* {content?.paymentMethods && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-sm flex items-center justify-center font-bold">
                        💳
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {content?.paymentSectionTitle || "Select payment method"}
                      </h3>
                    </div>

                    <div className="p-2 sm:p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex flex-wrap gap-4 sm:gap-8">
                      {content.paymentMethods.map((pm) => (
                        <label
                          key={pm.id}
                          className="inline-flex items-center gap-2.5 text-sm sm:text-sm font-semibold text-slate-700 cursor-pointer py-1 px-2"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={pm.value}
                            checked={paymentMethod === pm.value}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300"
                          />
                          <span>{pm.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )} */}

                            {/* SECTION: Personal Information */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    // Save submission to localStorage
                                    const existingSubmissions = JSON.parse(
                                        localStorage.getItem("formDataList") || "[]",
                                    );
                                    localStorage.setItem(
                                        "formDataList",
                                        JSON.stringify([...existingSubmissions, formData]),
                                    );

                                    // Reset form data state
                                    setFormData({
                                        firstName: "",
                                        lastName: "",
                                        email: "",
                                        phone: "",
                                        message: "",
                                    });
                                }}
                                className="space-y-6"
                            >
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"
                                            aria-hidden="true"
                                        >
                                            <User className="w-3 h-3 stroke-[2.2]" />
                                        </span>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                            {content?.personalInfoTitle || "Personal information"}
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            required
                                            name="firstName"
                                            placeholder={
                                                content?.formFields?.firstNamePlaceholder ||
                                                "First name"
                                            }
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                        />
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            placeholder={
                                                content?.formFields?.lastNamePlaceholder || "Last name"
                                            }
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                        />
                                    </div>

                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder={
                                            content?.formFields?.emailPlaceholder ||
                                            "Enter your e-mail"
                                        }
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        placeholder={
                                            content?.formFields?.phonePlaceholder ||
                                            "Enter your phone no."
                                        }
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
                                    />

                                    <textarea
                                        name="message"
                                        rows={4}
                                        required
                                        placeholder={
                                            content?.formFields?.messagePlaceholder ||
                                            "Write a message (optional)"
                                        }
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button & Security Notice */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base px-8 py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/25 group cursor-pointer"
                                    >
                                        <span>
                                            {content?.formFields?.submitButtonText || "Donate Now"}
                                        </span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                                        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
                                        <span>
                                            {content?.formFields?.securityNotice ||
                                                "Your donation is secure and encrypted"}
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky promo */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
                        {sidebar?.promoBanner && (
                            <div className="relative bg-[#031b33] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-md flex flex-col items-center text-center space-y-5 w-full">
                                <div
                                    data-editor-icon-host
                                    className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20"
                                >
                                    <EditableNgoIcon
                                        name={
                                            sidebar.promoBanner.icon ||
                                            sidebar.promoBanner.iconName ||
                                            "hand-heart"
                                        }
                                        className="w-10 h-10 text-orange-400"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-orange-300 tracking-wide uppercase">
                                        {sidebar.promoBanner.tagline}
                                    </p>
                                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                                        {sidebar.promoBanner.title}
                                    </h3>
                                </div>

                                <Link
                                    href={sidebar.promoBanner.buttonUrl || "/contact"}
                                    data-editor-keep-click="true"
                                    data-editor-nav="true"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md group mt-2"
                                >
                                    <span>{sidebar.promoBanner.buttonText}</span>
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>
            </section>
        </div>
    );
}
