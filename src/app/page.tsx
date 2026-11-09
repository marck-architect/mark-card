import { links } from "@/config/profile.config";
import { BioCard } from "@/components/profile/BioCard";
import { FooterCard } from "@/components/profile/FooterCard";
import { LinkRow } from "@/components/profile/LinkRow";
import { PlatformGrid } from "@/components/profile/PlatformGrid";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full justify-center bg-page">
      <PersonJsonLd />
      <div className="w-full max-w-md overflow-hidden sm:mt-2">
        <ProfileHeader />
        {/* Header is full-bleed on phones; the cards below keep a side gutter. */}
        <div className="px-3 sm:px-0">
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
