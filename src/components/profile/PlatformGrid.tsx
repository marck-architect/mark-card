import { platforms } from "@/config/profile.config";
import { readIcon } from "@/lib/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PlatformTile } from "./PlatformTile";

export function PlatformGrid() {
  return (
    <section aria-labelledby="platforms-title" className="mt-5">
      <SectionLabel id="platforms-title" className="mb-3">
        Platforms
      </SectionLabel>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {platforms.map((p) => (
          <li key={p.id}>
            <PlatformTile platform={p} iconSvg={readIcon(p.id)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
