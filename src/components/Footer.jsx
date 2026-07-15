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

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/investateindiaofficial",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/investateindia/",
    icon: Instagram,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/investate_india",
    icon: Twitter,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/investateindiaofficial/",
    icon: Linkedin,
  },
  {
    label: "Tumblr",
    href: "https://www.tumblr.com/blog/investateindia",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M14.12 4.5c.58-.87 1.41-1.24 2.5-1.24h.77v3.58h-2.9c-1.6 0-2.4.95-2.4 2.48v2.77h4.15v3.75h-4.15V20H9.95v-5.16H6.7V11.1h3.25V8.49c0-3.27 2.02-5.04 5.17-5.04z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/investateindia-business",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.3 11.23a12.26 12.26 0 0 0-3.72-.53 19.42 19.42 0 0 0-1.34 2.42 10.43 10.43 0 0 0 5.06-1.89Zm-1.72-3.3a16.59 16.59 0 0 1-2.61 3.2 23.77 23.77 0 0 1-3.46-5.44 8.58 8.58 0 0 1 6.07 2.24ZM12 4.2a8.44 8.44 0 0 1 4.07 1.05 20.28 20.28 0 0 1-4.84 6.2A32.56 32.56 0 0 0 7.22 4.87 8.5 8.5 0 0 1 12 4.2Zm-3.86 1.82a31.94 31.94 0 0 1 3.52 6.12 18.16 18.16 0 0 0-6.3 1.69A8.45 8.45 0 0 1 8.14 6.02ZM4.2 12a8.48 8.48 0 0 1 1.53-4.9 17.14 17.14 0 0 1 6.4 1.83A24.17 24.17 0 0 0 8.1 15.56a18.27 18.27 0 0 1-3.9-3.56Zm2.4 5.31a10.47 10.47 0 0 0 3.9-2.91 18.26 18.26 0 0 1 1.59 2.95 8.45 8.45 0 0 1-5.49-.04Zm5.37 1.16a20.39 20.39 0 0 0 1.29-2.48 10.42 10.42 0 0 0 3.74.47 8.45 8.45 0 0 1-5.03 2.01Z" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@investateindia.business",
    icon: Globe,
  },
  {
    label: "Issuu",
    href: "https://issuu.com/investateindia",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M12 4.5A7.5 7.5 0 1 0 19.5 12 7.5 7.5 0 0 0 12 4.5Zm0 3.75a3.75 3.75 0 1 1-3.75 3.75A3.75 3.75 0 0 1 12 8.25Z" />
      </svg>
    ),
  },
  {
    label: "Quora",
    href: "https://www.quora.com/profile/Investateindia",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M12 4.2a8.4 8.4 0 1 0 8.4 8.4A8.4 8.4 0 0 0 12 4.2Zm1.73 11.24a3.32 3.32 0 0 1-1.73.59 3.3 3.3 0 0 1-1.74-.59 1.87 1.87 0 0 1-.74-1.59 1.8 1.8 0 0 1 .74-1.57 3.06 3.06 0 0 1 1.74-.57 3.09 3.09 0 0 1 1.73.57 1.8 1.8 0 0 1 .74 1.57 1.87 1.87 0 0 1-.74 1.59Zm-5.67-4.92h2.48a.92.92 0 0 0 .92-.92v-.68A3.06 3.06 0 0 1 11.3 7.4a3.27 3.27 0 0 1 3.33 3.24v.68a.92.92 0 0 0 .92.92h2.48a.92.92 0 0 0 .92-.92v-.68A6.21 6.21 0 0 0 13.8 6.1h-3.6a6.21 6.21 0 0 0-6.21 6.21v.68a.92.92 0 0 0 .92.92Z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/InvestateIndia/",
    icon: (props) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <path d="M22 12a10 10 0 1 0-10 10 10 10 0 0 0 10-10Zm-14.4 0a1.2 1.2 0 1 1 1.2 1.2A1.2 1.2 0 0 1 7.6 12Zm6.16 5.06a5.49 5.49 0 0 1-3.95 0 1 1 0 0 0-.43 1.95 7.52 7.52 0 0 0 5.62 0 1 1 0 0 0-.43-1.95Zm.84-3.86a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2Zm-4.76.51a.65.65 0 0 0 .65.65h2.42a.65.65 0 0 0 0-1.3H10.5a.65.65 0 0 0-.65.65Z" />
      </svg>
    ),
  },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Real Estate Investor", href: "/investor" },
  { label: "Builder", href: "/builder" },
  { label: "Service Provider", href: "/service-provider" },
  { label: "Capital Sourcing", href: "/equity-raising" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact-us" },
];

const resourceLinks = [
  {
    label: "Write a Google Review",
    href: "https://g.page/r/CTZ78wVQdv2HEAI/review",
    icon: Star,
  },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-cancellation" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const officeLocations = [
  {
    city: "Corporate Office",
    address: "5th Floor, Sanghi One, 8-2-596/4, Road No. 10, Banjara Hills, Hyderabad, Telangana State - 500034",
  },
  {
    city: "New York Head Office",
    address: "55 West 47 Street, Suite 425, New York, NY 10036 | Tel: 212-575-6104",
  },
  {
    city: "Mumbai Branch Office",
    address: "1401 Panchratna building, Opera House, Mumbai",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-[#232325] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.65fr_0.65fr_1fr]">
          <div className="space-y-5">
            <img
              src="/logo-big.png"
              alt="Investate India"
              className="h-16 w-auto"
            />

            <p className="text-sm leading-relaxed text-gray-400">
              Investate India is a global ecosystem connecting NRIs, investors,
              builders, businesses, and professional partners through trusted
              real estate and capital solutions.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-700 bg-white/5 text-gray-300 transition hover:border-[#C88A58] hover:text-[#D48035]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-[#D48035]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Resources</h3>
            <ul className="space-y-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http") ? "noreferrer" : undefined
                    }
                    className="flex items-center gap-2 transition hover:text-[#D48035]"
                  >
                    {link.icon ? (
                      <link.icon className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#C88A58]" />
                    )}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-white">Contact & Offices</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C88A58]" />
                <a
                  href="mailto:investateindia.business@gmail.com"
                  className="transition hover:text-[#D48035]"
                >
                  investigateindia.business@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C88A58]" />
                <a
                  href="tel:+914048293000"
                  className="transition hover:text-[#D48035]"
                >
                  +91 40 4829 3000
                </a>
              </li>
              <li className="pt-2">
                <div className="flex flex-wrap gap-3">
                  {officeLocations.map((location) => (
                    <div
                      key={location.city}
                      className="flex min-w-[220px] flex-1 items-start gap-2 rounded-lg border border-gray-800 bg-white/5 p-3"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#C88A58]" />
                      <div>
                        <p className="font-medium text-white">
                          {location.city}
                        </p>
                        <p className="text-xs leading-relaxed text-gray-400">
                          {location.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <p className="text-center text-sm text-gray-400">
            © 2026 INVESTATE INDIA. All rights reserved.
          </p>

          <p className="mx-auto mt-4 max-w-5xl text-center text-xs leading-relaxed text-gray-500">
            Disclaimer: Investate India acts as a facilitation platform
            connecting investors, builders, businesses, and professional service
            partners. Investment decisions are subject to independent
            evaluation, documentation, and applicable risks.
          </p>

          <p className="mt-4 text-center text-xs text-gray-300">
            Designed and Maintained by{" "}
            <a
              href="https://brvteck.ai/"
              target="_blank"
              rel="noreferrer"
              className="text-white underline"
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
