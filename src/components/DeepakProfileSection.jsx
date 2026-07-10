"use client";

import React from "react";
import { Quote, Award } from "lucide-react";

const PAGE_CONTENT = {
  investor: {
    title: "Leadership & Trust",
    bio: "Deepak Kavadia brings decades of experience connecting the global Indian community across the USA and India. Through Investate India, he helps create a trusted bridge between NRIs and verified Indian investment opportunities.",
    quote:
      "Our focus is simple — build trust, transparency, and confidence for global Indians investing in India.",
  },

  builder: {
    title: "Global Network Leadership",
    bio: "Deepak Kavadia helps Indian developers expand their global reach by connecting credible projects with international NRI networks and strategic relationships.",
    quote:
      "Connecting quality developers with global opportunities through trust and transparency.",
  },

  serviceProvider: {
    title: "Trusted Partnership Network",
    bio: "Deepak Kavadia works towards building a reliable ecosystem of professional partners supporting NRIs with investment, compliance, and advisory needs.",
    quote:
      "Strong partnerships create secure and successful cross-border investment experiences.",
  },

  default: {
    title: "Leadership Vision",
    bio: "Deepak Kavadia, Co-Founder of Investate India, plays a key role in strengthening relationships between global NRIs and Indian opportunities through trust, transparency, and collaboration.",
    quote:
      "Building a trusted gateway connecting global Indians with India's growth story.",
  },
};

export default function DeepakProfileSection({ pageType = "default" }) {
  const content = PAGE_CONTENT[pageType] || PAGE_CONTENT.default;

  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div
          className="
          bg-white 
          rounded-3xl 
          shadow-sm 
          border 
          border-gray-100
          p-6
          md:p-8
          flex 
          flex-col 
          md:flex-row 
          gap-8 
          items-center
        "
        >
          {/* Image */}
          <div className="shrink-0">
            <div
              className="
              w-40 
              h-40 
              md:w-48 
              md:h-48 
              rounded-2xl 
              overflow-hidden
              shadow-md
            "
            >
              <img
                src="/deepak.png"
                alt="Deepak Kavadia"
                className="
                  w-full 
                  h-full 
                  object-cover
                "
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <span
              className="
              text-[#D48035]
              uppercase
              tracking-widest
              text-xs
              font-bold
            "
            >
              {content.title}
            </span>

            <h2
              className="
              text-2xl
              font-bold
              text-gray-900
              mt-2
            "
            >
              Deepak Kavadia
            </h2>

            <div
              className="
              flex
              items-center
              gap-2
              mt-2
              text-gray-700
              text-sm
              font-medium
            "
            >
              <Award className="w-4 h-4 text-[#D48035]" />
              Chairman of the NRI Federation • Co-Founder, Investate India
            </div>

            <p
              className="
              text-gray-600
              text-sm
              md:text-base
              leading-relaxed
              mt-4
            "
            >
              {content.bio}
            </p>

            <div
              className="
              flex 
              gap-3
              mt-5
              bg-[#FFF7ED]
              rounded-xl
              p-4
            "
            >
              <Quote
                className="
                  w-5 
                  h-5 
                  text-[#D48035]
                  rotate-180
                  shrink-0
                "
              />

              <p
                className="
                text-gray-700
                italic
                text-sm
              "
              >
                "{content.quote}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
