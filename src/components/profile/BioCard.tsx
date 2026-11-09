import { UserRound } from "lucide-react";
import { profile } from "@/config/profile.config";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function BioCard() {
  return (
    <Card aria-labelledby="bio-title" className="mt-5 lg:mt-0">
      <SectionLabel
        id="bio-title"
        className="mb-3"
        icon={<UserRound className="size-3.5" />}
      >
        Bio
      </SectionLabel>
      <p className="text-xs leading-relaxed text-ink/60 lg:text-sm">{profile.bio}</p>
    </Card>
  );
}
