import { useState } from "react";
import { ChevronDown, Menu, ShoppingBag, User, X } from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Explore",
    links: [
      ["Shinobi", "https://www.atomos.com/explore/shinobi-series/"],
      ["Ninja", "https://www.atomos.com/explore/ninja-series/"],
      ["Shogun", "https://www.atomos.com/shogun-range/"],
      ["Sumo", "https://www.atomos.com/explore/sumo-19se/"],
      ["UltraSync", "https://www.atomos.com/wireless-sync/"],
      ["StudioSonic", "https://www.atomos.com/audio-studiosonic-range/"],
      ["Sun Dragon", "https://www.atomos.com/explore/sun-dragon/"],
      ["New", "https://www.atomos.com/2025-new-products/"],
    ],
  },
  {
    label: "Shop",
    links: [
      ["Monitors", "https://www.atomos.com/product-category/monitors/"],
      ["Monitor-recorders", "https://www.atomos.com/product-category/monitor-recorders/"],
      ["Accessories", "https://www.atomos.com/product-category/accessories/"],
      ["Cables", "https://www.atomos.com/product-category/cables/"],
      ["All Products", "https://www.atomos.com/shop/"],
      ["Promotions", "https://www.atomos.com/promotions/"],
      ["Resellers", "https://www.atomos.com/where-to-buy/"],
    ],
  },
  {
    label: "ATOMOSphere",
    links: [
      ["Login", "https://atomosphere.com/auth0/login"],
      ["About ATOMOSphere", "https://www.atomos.com/explore/atomosphere"],
      ["Try ATOMOSphere", "https://atomosphere.com/"],
    ],
  },
  {
    label: "Community",
    links: [
      ["Case Studies", "https://www.atomos.com/creators/"],
      ["News Feed", "https://www.atomos.com/news-feed/"],
      ["Learn", "https://www.atomos.com/learning/"],
      ["Investor Center", "https://investors.atomos.com/"],
    ],
  },
  {
    label: "Support",
    links: [
      ["my.atomos.com", "https://my.atomos.com"],
      ["Product Support", "https://www.atomos.com/support/"],
      ["Returns", "https://www.atomos.com/returns/"],
    ],
  },
  {
    label: "My Atomos",
    links: [
      ["Login", "https://my.atomos.com/login"],
      ["Feature Upgrades", "https://www.atomos.com/upgrades/"],
      ["Firmware Upgrades", "https://www.atomos.com/product-support/"],
    ],
  },
];

function HeaderLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-[22px] w-auto xl:h-[32px]"
      viewBox="0 0 449 85"
      fill="none"
    >
      <path
        fill="currentColor"
        d="m145.499 17.67-21.854 50.02h10.858l4.897-11.487h21.11l4.824 11.487h11.135l-21.854-50.02h-9.116Zm11.054 29.025h-13.204l6.573-15.338 6.631 15.338Zm21.699-19.009h15.092v39.84h10.523v-39.84h15.092v-9.844h-40.707v9.844ZM312.81 39.46l-13.907-21.618H288.38v49.685h10.318V35.943l13.278 19.884h1.398l13.417-20.03v31.73h10.457V17.842h-10.531L312.81 39.46Zm119.147-1.603c-9.443-2.257-10.481-3.77-10.481-6.46v-.138c0-2.747 2.689-4.595 6.704-4.595 4.014 0 8.061 1.529 12.288 4.685l.859.637 5.674-8.004-.769-.621c-5.208-4.178-11.07-6.214-17.921-6.214-10.179 0-17.292 6.108-17.292 14.848v.139c0 9.37 6.107 12.68 16.654 15.231 9.214 2.126 9.925 3.933 9.925 6.255v.139c0 3-2.894 4.938-7.382 4.938-5.249 0-9.534-1.774-14.341-5.928l-.801-.694-6.369 7.57.76.679c5.772 5.159 12.877 7.882 20.546 7.882 10.964 0 18.044-5.985 18.044-15.257v-.139c0-7.84-4.66-12.174-16.098-14.953ZM374.742 17c-14.16 0-25.68 11.52-25.68 25.68 0 14.161 11.52 25.68 25.68 25.68 14.161 0 25.681-11.519 25.681-25.68 0-14.16-11.52-25.68-25.681-25.68Zm15.837 25.68c0 8.732-7.105 15.837-15.837 15.837s-15.836-7.105-15.836-15.837c0-8.731 7.104-15.836 15.836-15.836s15.837 7.105 15.837 15.836ZM251.123 17c-14.16 0-25.68 11.52-25.68 25.68 0 14.161 11.52 25.68 25.68 25.68 14.161 0 25.681-11.519 25.681-25.68 0-14.16-11.52-25.68-25.681-25.68Zm15.837 25.68c0 8.732-7.105 15.837-15.837 15.837s-15.837-7.105-15.837-15.837c0-8.731 7.105-15.836 15.837-15.836s15.837 7.105 15.837 15.836ZM88.807 34.269l-.15-.231a8.928 8.928 0 0 0-.662-1.068C78.035 17.09 61.955 0 50.171 0 36.948.105 19.836 20.57 11.562 34.293 7.31 41.321-5.878 65.254 3.02 78.155c3 4.312 8.77 6.59 16.688 6.59 8.974 0 20.069-2.933 30.478-8.053 10.465 5.12 21.567 8.054 30.492 8.054 7.903 0 13.64-2.282 16.583-6.591 8.984-12.824-4.193-36.82-8.456-43.886h.003ZM22.2 26.698C32.335 13.248 43.25 4.61 50.276 4.557c6.814 0 17.63 8.617 27.818 22.075-7.896-2.52-18.473-2.948-27.92-3.018-8.925.067-19.981.49-27.975 3.084Zm27.979.931.017.535c7.893.06 28.854.221 33.992 7.305l.511.826c.06.108.12.22.172.346 2.548 5.828-14.43 24.469-34.682 34.952-20.153-10.48-37.044-29.117-34.506-34.952 3.59-8.252 26.855-8.42 34.503-8.476v-.536h-.007Zm43.365 47.932c-2.646 3.822-8.456 4.624-12.863 4.624-7.455 0-16.45-2.188-25.43-6.167 13.429-7.627 28.923-20.87 33.221-31.017 10.658 20.636 7.123 29.628 5.072 32.56Zm-48.395-1.543c-8.953 3.983-17.948 6.167-25.438 6.167-4.427 0-10.269-.805-12.946-4.63C4.73 72.61 1.24 63.58 12 42.822c4.168 10.164 19.652 23.489 33.148 31.192v.004Z"
      />
      <path
        fill="currentColor"
        d="M45.362 47.148c0 2.664 2.163 4.834 4.823 4.834 2.66 0 4.844-2.167 4.844-4.834s-2.174-4.833-4.844-4.833a4.825 4.825 0 0 0-4.823 4.833Z"
      />
    </svg>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <header className="relative z-50 bg-black">
      <div className="mx-auto flex h-[72px] max-w-[1300px] items-center justify-between px-4 text-white md:px-10">
        <a href="https://www.atomos.com" className="flex items-center text-white">
          <HeaderLogo />
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex lg:ml-[-150px]">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="group relative">
              <button
                type="button"
                className="flex items-center gap-1 text-[16px] font-bold leading-[22px] text-white transition hover:text-[#00dcc5]"
              >
                {item.label}
              </button>

              <div className="invisible fixed left-0 top-[72px] z-[999] flex w-full translate-y-[-10px] justify-center gap-10 bg-[#e6e6ed] px-[50px] py-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {item.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="relative text-[16px] leading-6 text-black after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-black after:transition-all hover:after:w-full"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href="https://www.atomos.com/login" className="text-white transition hover:text-[#00dcc5]">
            <User size={28} />
          </a>
          <a href="https://www.atomos.com/cart" className="text-white transition hover:text-[#00dcc5]">
            <ShoppingBag size={28} />
          </a>
        </div>

        <button
          type="button"
          className="text-white lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={30} />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[2000] flex flex-col bg-black text-white lg:hidden">
          <div className="flex h-[60px] items-center justify-between border-b border-white/10 px-4">
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={30} />
            </button>

            <a href="https://www.atomos.com" className="flex items-center text-white">
              <HeaderLogo />
            </a>

            <div className="w-[30px]" />
          </div>

          <div className="flex-1 overflow-y-auto pt-6">
            {NAV_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={item.label} className="border-b border-[#222]">
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between px-6 py-[18px] text-left text-[18px] font-bold"
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={18}
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="flex flex-col bg-[#111] px-8 py-3">
                      {item.links.map(([label, href]) => (
                        <a
                          key={label}
                          href={href}
                          className="py-2 text-[16px] font-medium text-white"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}