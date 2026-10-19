'use client';

import React from 'react';
import Link from '../header/ElectricalLink';
import { motion } from 'framer-motion';
import {
  Award,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ExternalLink,
  Home,
  Mail,
  Phone,
  Plus,
  Zap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { AboutProps } from '../header/electricalTypes';


/* =========================================================
   CARD ICONS
========================================================= */

const cardIcons: Record<string, React.ElementType> = {
  Home,
  Building2,
  Award,
  Phone,
  Mail,
  Plus,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  plus: Plus,
  phone: Phone,
  mail: Mail,
  "external-link": ExternalLink,
  none: Home,
};


/* =========================================================
   ABOUT SECTION
========================================================= */

export default function About({
  data,
  hideCta = false,
  mediaField = "image",
}: AboutProps & { mediaField?: string }) {

  const tel = data.phone
    ? `tel:${data.phone.replace(/[^0-9+]/g, '')}`
    : '/contact';


  if (!data) {
    return null;
  }


  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        py-[40px]
        sm:py-[52px]
        lg:py-[60px]
      "
    >


      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      {/* Top Right Dots */}

      <div
        className="
          pointer-events-none
          absolute
          right-[45px]
          top-[55px]
          hidden
          h-[95px]
          w-[110px]
          opacity-50
          lg:block
        "
        style={{
          backgroundImage:
            'radial-gradient(#d4dce4 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />


      {/* Bottom Right Dots */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-[65px]
          right-[35px]
          hidden
          h-[85px]
          w-[110px]
          opacity-45
          lg:block
        "
        style={{
          backgroundImage:
            'radial-gradient(#d4dce4 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />


      {/* Pale Lightning Shape */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-40px]
          top-[-20px]
          hidden
          text-[#f2f5f7]
          lg:block
        "
      >
        <Zap
          size={390}
          strokeWidth={1}
        />
      </div>



      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          grid
          w-full
          max-w-[1340px]
          grid-cols-1
          items-center
          gap-[45px]
          px-[22px]
          sm:px-[35px]
          lg:grid-cols-[1fr_1fr]
          lg:gap-[40px]
          lg:px-[45px]
          xl:gap-[48px]
        "
      >


        {/* =====================================================
            LEFT IMAGE AREA
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -35,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            ease: 'easeOut',
          }}
          className="
            relative
            mx-auto
            w-full
            max-w-[590px]
            lg:mx-0
          "
        >


          {/* =================================================
              MAIN IMAGE + NAVY STRIP
          ================================================== */}

          <div className="relative ml-auto w-[88%]">

            <div
              className="
                absolute
                bottom-[-17px]
                left-[-5px]
                z-0
                h-[34%]
                w-[45%]
                bg-[#1B8A3E]
                sm:bottom-[-20px]
                sm:left-[-8px]
              "
              style={{
                clipPath:
                  'polygon(0 0, 42% 0, 100% 100%, 0 100%)',
              }}
            />

            <div
              className="
                absolute
                -right-[10px]
                top-[62px]
                z-0
                h-[82%]
                w-[16px]
                rounded-r-[25px]
                bg-[#0b2948]
                sm:w-[18px]
              "
            />

            <div
              className="
                relative
                z-10
                h-[420px]
                w-full
                overflow-hidden
                rounded-[22px]
                sm:h-[500px]
                lg:h-[535px]
                xl:h-[555px]
              "
            >

              <img
                src={data.image || "/categories/electrical/img/about.png"}
                data-editor-media="true"
                data-editor-media-role={mediaField}
                alt="About ElectroCare"
                className="
                  h-full
                  w-full
                  object-cover
                  object-[center_top]
                "
              />

            </div>

          </div>


          {/* =================================================
              EXPERIENCE BADGE
          ================================================== */}

          {data.badge && (
            <div
              className="
                absolute
                left-[-2px]
                top-[72px]
                z-30
                w-[135px]
                rounded-[16px]
                bg-white
                px-[14px]
                py-[18px]
                text-center
                shadow-[0_12px_35px_rgba(15,40,70,0.14)]
                sm:left-[-20px]
                sm:top-[75px]
                sm:w-[145px]
                sm:px-[16px]
                sm:py-[20px]
              "
            >

              {/* Green Circle */}

              <div
                className="
                  mx-auto
                  mb-[13px]
                  flex
                  h-[58px]
                  w-[58px]
                  items-center
                  justify-center
                  rounded-full
                  bg-[#1B8A3E]
                  text-white
                "
              >
                <Award
                  size={29}
                  strokeWidth={1.7}
                />
              </div>


              {/* Badge Value */}

              <p
                className="
                  m-0
                  text-[15px]
                  font-bold
                  leading-[1.3]
                  text-[#0b2540]
                  sm:text-[16px]
                "
              >
                {data.badge.value}
              </p>


              {/* Badge Label */}

              <p
                className="
                  mt-[2px]
                  text-[12px]
                  font-semibold
                  leading-[1.35]
                  text-[#1B8A3E]
                "
              >
                {data.badge.label}
              </p>


              {/* Small Green Line */}

              <div
                className="
                  mx-auto
                  mt-[10px]
                  h-[2px]
                  w-[32px]
                  bg-[#1B8A3E]
                "
              />

            </div>
          )}

        </motion.div>



        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: 'easeOut',
          }}
          className="
            relative
            z-10
            w-full
          "
        >


          {/* =================================================
              ABOUT US LABEL
          ================================================== */}

          <div
            className="
              mb-[13px]
              flex
              items-center
              gap-[9px]
            "
          >

            <Zap
              size={19}
              className="
                fill-[#1B8A3E]
                text-[#1B8A3E]
              "
              strokeWidth={1.7}
            />

            <span
              data-editor-inline-format-key="electrical-about:subtitle"
              className="
                text-[12px]
                font-extrabold
                uppercase
                tracking-[2px]
                text-[#1B8A3E]
                sm:text-[14px]
                sm:tracking-[2.6px]
              "
            >
              {data.subtitle}
            </span>

          </div>


          {/* Small green underline */}

          <div
            className="
              mb-[17px]
              ml-[28px]
              h-[2px]
              w-[82px]
              bg-[#1B8A3E]
            "
          />


          {/* =================================================
              HEADING
          ================================================== */}

          <h2
            className="
              mb-[17px]
              max-w-[620px]
              text-[22px]
              font-extrabold
              leading-[1.2]
              text-[#0b2540]
              sm:text-[28px]
              lg:text-[32px]
            "
          >
            <span data-editor-inline-format-key="electrical-about:title_line1">
              {data.title_line1}
            </span>
            <br />
            <span data-editor-inline-format-key="electrical-about:title_highlight">
              {data.title_highlight}
            </span>{' '}
            <span className="text-[#1B8A3E]" data-editor-inline-format-key="electrical-about:title_line2">
              {data.title_line2}
            </span>
          </h2>


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p
            data-editor-inline-format-key="electrical-about:description"
            className="
              mb-[25px]
              max-w-[590px]
              text-[14px]
              leading-[1.65]
              text-[#6b7285]
              sm:text-[15px]
            "
          >
            {data.description}
          </p>


          {/* =================================================
              SERVICE CARDS
          ================================================== */}

          <div
            className="
              mb-[19px]
              grid
              grid-cols-1
              gap-[12px]
              sm:grid-cols-2
            "
          >

            {(data.cards || []).map((card, cardIndex) => {

              const Icon =
                cardIcons[card.icon] ||
                (LucideIcons as unknown as Record<string, React.ElementType>)[card.icon] ||
                Home;

              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="
                    flex
                    min-h-[92px]
                    items-center
                    gap-[13px]
                    rounded-[14px]
                    bg-[#f3faf6]
                    px-[14px]
                    py-[13px]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:shadow-[0_8px_20px_rgba(27,138,62,0.08)]
                  "
                >

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-[52px]
                      w-[52px]
                      flex-shrink-0
                      items-center
                      justify-center
                      text-[#1B8A3E]
                    "
                  >
                    <Icon
                      size={40}
                      strokeWidth={1.5}
                    />
                  </div>


                  {/* Text */}

                  <div>

                    <h3
                      data-editor-inline-format-key={`electrical-about:cards:${cardIndex}:title`}
                      className="
                        mb-[4px]
                        text-[14px]
                        font-extrabold
                        text-[#0b2540]
                        sm:text-[15px]
                      "
                    >
                      {card.title}
                    </h3>

                    <p
                      data-editor-inline-format-key={`electrical-about:cards:${cardIndex}:description`}
                      className="
                        text-[11px]
                        leading-[1.45]
                        text-[#718096]
                        sm:text-[12px]
                      "
                    >
                      {card.description}
                    </p>

                  </div>

                </motion.div>
              );
            })}

          </div>


          {/* =================================================
              DIVIDER
          ================================================== */}

          <div
            className="
              mb-[15px]
              h-[1px]
              w-full
              max-w-[590px]
              bg-[#e4e9ee]
            "
          />


          {/* =================================================
              FEATURES / CHECKLIST
          ================================================== */}

          <ul
            className="
              mb-[24px]
              space-y-[9px]
            "
          >

            {(data.features || []).map((feature, featureIndex) => {
              const featureLabel =
                typeof feature === "string"
                  ? feature
                  : feature && typeof feature === "object"
                    ? String(
                        (feature as { title?: unknown; desc?: unknown }).title ||
                          (feature as { desc?: unknown }).desc ||
                          "",
                      )
                    : "";
              if (!featureLabel) return null;

              return (
              <li
                key={`${featureLabel}-${featureIndex}`}
                className="
                  flex
                  items-center
                  gap-[11px]
                  text-[13px]
                  font-medium
                  text-[#59677a]
                  sm:text-[14px]
                "
              >

                <span
                  className="
                    flex
                    h-[18px]
                    w-[18px]
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#1B8A3E]
                    text-white
                  "
                >
                  <Check
                    size={11}
                    strokeWidth={3}
                  />
                </span>

                <span data-editor-inline-format-key={`electrical-about:features:${featureIndex}`}>
                  {featureLabel}
                </span>

              </li>
              );
            })}

          </ul>


          {/* =================================================
              CTA
          ================================================== */}

          {!hideCta && data.button && (

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-[16px]
              "
            >

              {/* Discover More */}

              <Link
                href={data.button.href}
                className="
                  inline-flex
                  h-[50px]
                  items-center
                  justify-center
                  gap-[9px]
                  rounded-full
                  bg-[#1B8A3E]
                  px-[25px]
                  text-[12px]
                  font-bold
                  uppercase
                  tracking-[0.5px]
                  text-white
                  no-underline
                  transition-all
                  duration-300
                  hover:bg-[#146C31]
                  hover:shadow-[0_8px_20px_rgba(27,138,62,0.18)]
                "
              >

                <span data-editor-inline-format-key="electrical-about:button:text">
                  {data.button.text}
                </span>

                <ArrowRight
                  size={16}
                  strokeWidth={2.6}
                />

              </Link>


              {/* Phone */}

              <a
                href={tel}
                aria-label="Call us"
                className="
                  inline-flex
                  h-[52px]
                  w-[52px]
                  items-center
                  justify-center
                  rounded-full
                  border-[2px]
                  border-[#0b2540]
                  bg-white
                  text-[#0b2540]
                  no-underline
                  transition-all
                  duration-300
                  hover:border-[#1B8A3E]
                  hover:text-[#1B8A3E]
                "
              >
                <Phone
                  size={19}
                  strokeWidth={1.8}
                />
              </a>

            </div>

          )}

        </motion.div>

      </div>

    </section>
  );
}