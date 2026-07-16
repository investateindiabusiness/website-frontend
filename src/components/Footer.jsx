import React from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Star,
  Globe,
  Phone,
  ChevronRight,
} from "lucide-react";
import {
  socialLinks,
  quickLinks,
  resourceLinks,
  officeLocations,
  contactDetails,
} from "@/data/contactInfo";

const customIcons = {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Medium: Globe,
  Star,
  Google: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  ),
  Tumblr: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14.12 4.5c.58-.87 1.41-1.24 2.5-1.24h.77v3.58h-2.9c-1.6 0-2.4.95-2.4 2.48v2.77h4.15v3.75h-4.15V20H9.95v-5.16H6.7V11.1h3.25V8.49c0-3.27 2.02-5.04 5.17-5.04z" />
    </svg>
  ),
  Dribbble: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.3 11.23a12.26 12.26 0 0 0-3.72-.53 19.42 19.42 0 0 0-1.34 2.42 10.43 10.43 0 0 0 5.06-1.89Zm-1.72-3.3a16.59 16.59 0 0 1-2.61 3.2 23.77 23.77 0 0 1-3.46-5.44 8.58 8.58 0 0 1 6.07 2.24ZM12 4.2a8.44 8.44 0 0 1 4.07 1.05 20.28 20.28 0 0 1-4.84 6.2A32.56 32.56 0 0 0 7.22 4.87 8.5 8.5 0 0 1 12 4.2Zm-3.86 1.82a31.94 31.94 0 0 1 3.52 6.12 18.16 18.16 0 0 0-6.3 1.69A8.45 8.45 0 0 1 8.14 6.02ZM4.2 12a8.48 8.48 0 0 1 1.53-4.9 17.14 17.14 0 0 1 6.4 1.83A24.17 24.17 0 0 0 8.1 15.56a18.27 18.27 0 0 1-3.9-3.56Zm2.4 5.31a10.47 10.47 0 0 0 3.9-2.91 18.26 18.26 0 0 1 1.59 2.95 8.45 8.45 0 0 1-5.49-.04Zm5.37 1.16a20.39 20.39 0 0 0 1.29-2.48 10.42 10.42 0 0 0 3.74.47 8.45 8.45 0 0 1-5.03 2.01Z" />
    </svg>
  ),
  Issuu: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 4.5A7.5 7.5 0 1 0 19.5 12 7.5 7.5 0 0 0 12 4.5Zm0 3.75a3.75 3.75 0 1 1-3.75 3.75A3.75 3.75 0 0 1 12 8.25Z" />
    </svg>
  ),
  Quora: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 4.2a8.4 8.4 0 1 0 8.4 8.4A8.4 8.4 0 0 0 12 4.2Zm1.73 11.24a3.32 3.32 0 0 1-1.73.59 3.3 3.3 0 0 1-1.74-.59 1.87 1.87 0 0 1-.74-1.59 1.8 1.8 0 0 1 .74-1.57 3.06 3.06 0 0 1 1.74-.57 3.09 3.09 0 0 1 1.73.57 1.8 1.8 0 0 1 .74 1.57 1.87 1.87 0 0 1-.74 1.59Zm-5.67-4.92h2.48a.92.92 0 0 0 .92-.92v-.68A3.06 3.06 0 0 1 11.3 7.4a3.27 3.27 0 0 1 3.33 3.24v.68a.92.92 0 0 0 .92.92h2.48a.92.92 0 0 0 .92-.92v-.68A6.21 6.21 0 0 0 13.8 6.1h-3.6a6.21 6.21 0 0 0-6.21 6.21v.68a.92.92 0 0 0 .92.92Z" />
    </svg>
  ),
  Reddit: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M22 12a10 10 0 1 0-10 10 10 10 0 0 0 10-10Zm-14.4 0a1.2 1.2 0 1 1 1.2 1.2A1.2 1.2 0 0 1 7.6 12Zm6.16 5.06a5.49 5.49 0 0 1-3.95 0 1 1 0 0 0-.43 1.95 7.52 7.52 0 0 0 5.62 0 1 1 0 0 0-.43-1.95Zm.84-3.86a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2Zm-4.76.51a.65.65 0 0 0 .65.65h2.42a.65.65 0 0 0 0-1.3H10.5a.65.65 0 0 0-.65.65Z" />
    </svg>
  ),
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#1A1A1C] text-gray-300 border-t border-white/[0.06]">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/30" />

      <div className="container relative z-10 mx-auto px-6 py-16 md:py-20 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.6fr_0.6fr_1fr]">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <img
                src="/logo-big.png"
                alt="Investate India"
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              Investate India is a trusted investment ecosystem connecting global investors, builders, businesses, and professional partners through transparency, innovation, and verified opportunities.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {socialLinks.map(({ label, href, iconName }) => {
                const Icon = customIcons[iconName];
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-gray-400 transition-all duration-300 hover:scale-110 hover:border-[#D48035] hover:bg-[#D48035] hover:text-white hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-gray-400 transition duration-200 hover:text-[#D48035]"
                  >
                    <ChevronRight className="h-3 w-3 opacity-0 -ml-3 transition-all duration-200 group-hover:opacity-100 group-hover:ml-0 group-hover:mr-1.5 text-[#D48035]" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              Resources
            </h3>
            <ul className="space-y-3.5 text-sm">
              {resourceLinks.map((link) => {
                const Icon = link.iconName ? customIcons[link.iconName] : null;
                const isRightIcon = link.iconPosition === "right";
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http") ? "noreferrer" : undefined
                      }
                      className="group flex items-center gap-2 text-gray-400 transition duration-200 hover:text-[#D48035]"
                    >
                      {!isRightIcon && (
                        Icon ? (
                          <Icon className="h-4 w-4 text-yellow-500 transition-transform group-hover:scale-115" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-600 transition-transform group-hover:translate-x-0.5 group-hover:text-[#D48035]" />
                        )
                      )}
                      <span>{link.label}</span>
                      {isRightIcon && Icon && (
                        <Icon className="h-4 w-4 transition-transform group-hover:scale-115" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-[#C88A58]">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Email Us</p>
                  <a
                    href={`mailto:${contactDetails.emailRaw}`}
                    className="text-gray-300 transition hover:text-[#D48035]"
                  >
                    {contactDetails.email}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-[#C88A58]">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Call Us</p>
                  <a
                    href={`tel:${contactDetails.phoneRaw}`}
                    className="text-gray-300 transition hover:text-[#D48035]"
                  >
                    {contactDetails.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Offices Full-Width Row */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <h3 className="mb-6 text-sm font-bold tracking-wider text-white uppercase">
            Our Offices
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {officeLocations.map((loc) => (
              <div
                key={loc.title}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 text-[#C88A58] transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-[#D48035] transition-colors">
                      {loc.title}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-400 mt-2">
                      {loc.address}
                    </p>
                    {/* Office-specific details */}
                    {(loc.email || loc.phone) && (
                      <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-medium border-t border-white/5 pt-2.5">
                        {loc.email && (
                          <a href={`mailto:${loc.email}`} className="hover:text-[#D48035] transition">
                            {loc.email}
                          </a>
                        )}
                        {loc.phone && (
                          <a href={`tel:${loc.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#D48035] transition">
                            {loc.phone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 border-t border-white/[0.06] pt-8">
          <p className="text-center text-xs text-gray-400 tracking-wider">
            © {new Date().getFullYear()} INVESTATE INDIA. All rights reserved.
          </p>

          <p className="mx-auto mt-4 max-w-5xl text-center text-[11px] leading-relaxed text-gray-500">
            Disclaimer: Investate India acts as a facilitation platform
            connecting investors, builders, businesses, and professional service
            partners. Investment decisions are subject to independent
            evaluation, documentation, and applicable risks.
          </p>

          <p className="mt-5 text-center text-xs text-gray-400">
            Designed and Maintained by{" "}
            <a
              href="https://brvteck.ai/"
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-[#D48035] transition underline underline-offset-4"
            >
              BRV Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
