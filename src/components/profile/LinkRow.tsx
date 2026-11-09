import { Link2 } from "lucide-react";
import type { LinkItem } from "@/config/profile.config";
import { ShareButton } from "./ShareButton";

/** One outbound link row with a share action. */
export function LinkRow({ item }: { item: LinkItem }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-ink/15 bg-white px-4 py-2 shadow-card transition duration-200 hover:scale-[0.98] hover:bg-gold-light/20">
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-grow items-center gap-4"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink">
          <Link2 className="size-5 text-gold-light" aria-hidden="true" />
        </span>
        <span className="block truncate text-sm text-ink">{item.label}</span>
      </a>
      <ShareButton label={item.label} url={item.href} />
    </div>
  );
}
