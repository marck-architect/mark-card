import { links } from "@/config/profile.config";
import { BioCard } from "@/components/profile/BioCard";
import { FooterCard } from "@/components/profile/FooterCard";
import { LinkRow } from "@/components/profile/LinkRow";
import { PlatformGrid } from "@/components/profile/PlatformGrid";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full justify-center bg-page lg:items-center">
      <PersonJsonLd />
      {/*
        Phones/tablets: a single centred column (max 448px).
        Desktop (lg+): two columns, profile card on the left, content on the right.
      */}
      <div className="w-full max-w-md overflow-hidden sm:mt-2 lg:mt-0 lg:grid lg:max-w-5xl lg:grid-cols-[380px_minmax(0,1fr)] lg:items-stretch lg:gap-10 lg:overflow-visible lg:px-8 lg:py-12">
        <div className="lg:h-full">
          <ProfileHeader />
        </div>
        {/* Header is full-bleed on phones; the cards below keep a side gutter. */}
        <div className="px-3 sm:px-0 lg:flex lg:h-full lg:flex-col lg:justify-between lg:px-0">
          <BioCard />
          <div className="mt-5 space-y-2">
            {links.map((item) => (
              <LinkRow key={item.id} item={item} />
            ))}
          </div>
          <PlatformGrid />
          <FooterCard />
        </div>
      </div>
    </main>
  );
}
