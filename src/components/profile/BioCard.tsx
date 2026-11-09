import { profile } from "@/config/profile.config";
import { readIcon } from "@/lib/icons";
import { AnimatedIcon } from "@/components/icons/AnimatedIcon";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function BioCard() {
  return (
    <Card aria-labelledby="bio-title" className="mt-5 lg:mt-0">
      <SectionLabel
        id="bio-title"
        className="mb-3"
        icon={<AnimatedIcon svg={readIcon("bio")} className="size-11" />}
      >
        Bio
      </SectionLabel>
      <p className="text-xs leading-relaxed text-ink/60 lg:text-sm">
        {profile.bio}
      </p>
    </Card>
  );
}
