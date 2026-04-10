import FooterLogo from "./FooterLogo";

const FOOTER_COLUMNS = [
  {
    title: "Products",
    links: [
      ["Shinobi", "https://www.atomos.com/explore/shinobi-series/"],
      ["Ninja", "https://www.atomos.com/explore/ninja-series/"],
      ["Shogun", "https://www.atomos.com/shogun-range/"],
      ["Sumo", "https://www.atomos.com/explore/sumo-19se/"],
      ["UltraSync", "https://www.atomos.com/wireless-sync/"],
      ["StudioSonic", "https://www.atomos.com/audio-studiosonic-range/"],
      ["Sun Dragon", "https://www.atomos.com/explore/sun-dragon/"],
      ["Studio", "https://www.atomos.com/studio-broadcast/"],
    ],
  },
  {
    title: "Services",
    links: [
      ["ATOMOSphere", "https://atomosphere.com/"],
    ],
  },
  {
    title: "Technology",
    links: [
      ["Camera to Cloud", "https://cloud.atomos.com/"],
      ["ProRes RAW", "https://www.atomos.com/prores-raw/"],
      ["Post Production", "https://cloud.atomos.com/edit"],
      ["NDI", "https://www.atomos.com/ndi/"],
    ],
  },
  {
    title: "Community",
    links: [
      ["Learn", "https://www.atomos.com/learning/"],
      ["Case Studies", "https://www.atomos.com/creators/"],
      ["News Feed", "https://www.atomos.com/news-feed/"],
      ["About Atomos", "https://www.atomos.com/about/"],
      ["Investor Center", "https://investors.atomos.com/"],
    ],
  },
  {
    title: "Support",
    links: [
      ["my.atomos.com", "https://my.atomos.com/"],
      ["Product Support", "https://www.atomos.com/support/"],
      ["Firmware Updates", "https://www.atomos.com/product-support/"],
      ["Feature Upgrades", "https://www.atomos.com/upgrades/"],
      ["Returns", "https://www.atomos.com/returns/"],
    ],
  },
  {
    title: "Buy",
    links: [
      ["Monitors", "https://www.atomos.com/monitors/"],
      ["Monitor-Recorders", "https://www.atomos.com/monitor-recorders/"],
      ["Accessories", "https://www.atomos.com/accessories/"],
      ["Cables", "https://www.atomos.com/product-category/cables/"],
      ["All Products", "https://www.atomos.com/all-products/"],
      ["Promotions", "https://www.atomos.com/promotions/"],
      ["Resellers", "https://www.atomos.com/where-to-buy/"],
    ],
  },
];

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.98H8v-2.9h2.5V9.41c0-2.47 1.47-3.84 3.73-3.84 1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.61.76-1.61 1.54v1.85H16.4l-.45 2.9h-2.37v6.98A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true">
      <path d="M714.163 519.284 1160.89 0H1055.06L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.833l409.66-476.152 327.179 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894L144.011 79.694h162.604l304.797 436.044 47.468 67.893 396.37 567.227H892.646L569.165 687.854v-.026Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.7V8.3L15.8 12l-6.2 3.7Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A2.01 2.01 0 1 0 5.3 7a2.01 2.01 0 0 0-.05-4ZM20.44 12.85c0-3.45-1.84-5.05-4.3-5.05a3.73 3.73 0 0 0-3.36 1.85V8.5H9.4c.04.76 0 11.5 0 11.5h3.38v-6.42c0-.34.03-.68.13-.92a2.2 2.2 0 0 1 2.06-1.47c1.45 0 2.03 1.1 2.03 2.72V20h3.38v-7.15Z" />
    </svg>
  );
}

function SocialCircle({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white text-white transition hover:border-[#00dcc5] hover:text-[#00dcc5]"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1320px] px-6 pb-8 pt-6 lg:px-10">
        <div className="border-t border-white/10 pt-14" />

        <div className="grid gap-12 lg:grid-cols-[200px_repeat(6,minmax(0,1fr))] lg:gap-10">
          <div className="flex items-start justify-center lg:justify-start">
            <FooterLogo />
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-3 text-[14px] font-bold leading-6 text-white">
                {column.title}
              </h4>

              <ul className="space-y-1.5">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[14px] leading-7 text-white transition hover:text-[#00dcc5]"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-12" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 text-[14px] leading-6 text-white lg:flex-row lg:items-center lg:gap-8">
            <span>©2026 Atomos. All rights reserved.</span>

            <a
              href="https://www.atomos.com/privacy-policy"
              className="transition hover:text-[#00dcc5]"
            >
              Privacy Policy
            </a>

            <a
              href="https://www.atomos.com/terms-conditions"
              className="transition hover:text-[#00dcc5]"
            >
              Terms &amp; Conditions
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SocialCircle href="http://www.facebook.com/AtomosGlobal" label="Facebook">
              <FacebookIcon />
            </SocialCircle>

            <SocialCircle href="https://www.instagram.com/atomos.global" label="Instagram">
              <InstagramIcon />
            </SocialCircle>

            <SocialCircle href="https://x.com/atomosglobal" label="X">
              <XIcon />
            </SocialCircle>

            <SocialCircle href="https://www.youtube.com/@AtomosGlobal" label="YouTube">
              <YoutubeIcon />
            </SocialCircle>

            <SocialCircle href="https://www.linkedin.com/company/atomos/" label="LinkedIn">
              <LinkedinIcon />
            </SocialCircle>
          </div>
        </div>
      </div>
    </footer>
  );
}