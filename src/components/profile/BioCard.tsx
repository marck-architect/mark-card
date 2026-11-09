import { profile } from "@/config/profile.config";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function BioCard() {
  return (
    <Card aria-labelledby="bio-title" className="mt-5">
      <SectionLabel id="bio-title" className="mb-3">
        Bio
      </SectionLabel>
      <p className="text-xs leading-relaxed text-ink/60">{profile.bio}</p>
    </Card>
  );
}
