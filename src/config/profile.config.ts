/**
 * Single source of truth for the card's content.
 * Everything shown on the page (and in the saved vCard) comes from here.
 */

export type PlatformId = "whatsapp" | "instagram" | "facebook" | "call";

/** Names of the animated badge icons in src/assets/icons (file name without .svg). */
export type IconName =
  | PlatformId
  | "bio"
  | "google-direction";

export interface Platform {
  readonly id: PlatformId;
  readonly label: string;
  readonly href: string;
  /** Opens in a new tab when true (web links); tel: links stay in-page. */
  readonly external: boolean;
}

export interface LinkItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: IconName;
}

export const profile = {
  name: "Muhammad Arslan",
  title: "Architect and Energy Consultant",
  company: "MARK Architects",
  bio: "MARK Architects: Pakistan-based, England-trained. We offer architecture, interior & landscape design, construction, energy assessments. Let’s build!",
  address:
    "4A 3rd floor. Al Haj Sher plaza. Near Hayatabad toll plaza. RingRd. Peshawar. Pakistan",
  /** Structured form of `address`, used for the saved vCard. */
  addressParts: {
    street: "4A 3rd floor. Al Haj Sher plaza. Near Hayatabad toll plaza. RingRd.",
    city: "Peshawar",
    country: "Pakistan",
  },
  email: "info.markarchitects@gmail.com",
  /** Primary number, shown on the card and saved to the vCard. */
  phone: "+923449240884",
  /** Secondary number behind the "Call" platform button. */
  callPhone: "+923130003322",
  website: "https://mark-architects.com/",
  images: {
    avatar: "/images/profile.webp",
    logoDark: "/images/logo-dark.png",
    logoWhite: "/images/logo-white.png",
  },
} as const;

export const links: readonly LinkItem[] = [
  {
    id: "directions",
    label: "Google direction",
    href: "https://g.co/kgs/iRfq8Tg",
    icon: "google-direction",
  },
];

export const platforms: readonly Platform[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/923449240884",
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/mark_architects_pvt",
    external: true,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/architectmak",
    external: true,
  },
  {
    id: "call",
    label: "Call",
    href: "tel:+923130003322",
    external: false,
  },
];

export const credit = {
  label: "Made by Ziriumai",
  href: "https://ziriumai.com",
} as const;
