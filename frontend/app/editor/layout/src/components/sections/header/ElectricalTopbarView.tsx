"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { TopbarProps } from '../header/electricalTypes';
import { fadeIn } from '../header/electricalMotion';

const contactIconMap: Record<string, React.ElementType> = {
  MapPin: FaMapMarkerAlt,
  Mail: FaEnvelope,
  Phone: FaPhoneAlt,
};

const socialIconMap: Record<string, React.ElementType> = {
  Facebook: FaFacebookF,
  Twitter: FaXTwitter,
  Instagram: FaInstagram,
  Linkedin: FaLinkedinIn,
};

export default function Topbar({ data }: TopbarProps) {
  const hrefFor = (icon: string, value: string) => {
    if (icon === 'Mail') return `mailto:${value}`;
    if (icon === 'Phone') return `tel:${value.replace(/[^0-9+]/g, '')}`;
    return undefined;
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="w-full bg-[#06243b] text-white"
    >
      <div className="mx-auto flex h-[46px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-8">
        <div className="flex min-w-0 items-center">
          {data.contact_info.map((item, index) => {
            const Icon = contactIconMap[item.icon] || FaMapMarkerAlt;
            const href = hrefFor(item.icon, item.value);
            const inner = (
              <span className="inline-flex items-center gap-[8px] text-[15px] font-normal leading-none text-white">
                <Icon className="shrink-0 text-[#1B8A3E]" size={14} />
                <span className="whitespace-nowrap">{item.value}</span>
              </span>
            );

            return (
              <React.Fragment key={item.icon}>
                {index > 0 && (
                  <span className="mx-[18px] hidden h-[14px] w-px bg-white/35 sm:block" />
                )}
                {href ? (
                  <a
                    href={href}
                    className={`${index === 0 ? 'inline-flex' : 'hidden sm:inline-flex'} hover:text-[#1B8A3E]`}
                  >
                    {inner}
                  </a>
                ) : (
                  <span className={`${index === 0 ? 'inline-flex' : 'hidden sm:inline-flex'}`}>
                    {inner}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-[10px] pl-4">
          <span className="hidden text-[15px] font-normal text-white sm:inline">{data.follow_text}</span>
          <div className="flex items-center gap-[8px]">
            {data.socials.map((social) => {
              const Icon = socialIconMap[social.icon] || FaFacebookF;
              return (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.icon}
                  className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border border-white/80 text-white transition-transform duration-200 hover:scale-110 hover:border-[#1B8A3E] hover:text-[#1B8A3E]"
                >
                  <Icon size={11} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
