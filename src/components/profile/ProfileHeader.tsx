import Image from "next/image";
import { profile } from "@/config/profile.config";
import { ActionButtons } from "./ActionButtons";

/** Cover, avatar and frosted-glass info panel. */
export function ProfileHeader() {
  return (
    <header className="relative h-[230px] w-full overflow-hidden rounded-b-xl bg-ink sm:rounded-xl">
      {/* Cover: ink field with a faint gold blueprint grid and the white logo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,rgb(201_168_110/0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgb(201_168_110/0.10)_1px,transparent_1px)] bg-[size:2rem_2rem]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgb(201_168_110/0.18),transparent_60%)]"
      />
      <Image
        src={profile.images.logoWhite}
        alt={`${profile.company} logo`}
        width={897}
        height={254}
        sizes="176px"
        priority
        className="absolute left-1/2 top-6 h-auto w-44 -translate-x-1/2"
      />

      <div className="absolute inset-x-0 bottom-0 grid grid-cols-12 gap-3 p-2">
        <div className="col-span-3 self-end">
          <div className="aspect-square overflow-hidden rounded-3xl border-2 border-gold bg-white shadow-[0_0_0_3px_rgb(201_168_110/0.25)]">
            <Image
              src={profile.images.avatar}
              alt={profile.name}
              width={200}
              height={200}
              sizes="100px"
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="bg-glass col-span-9 rounded-2xl border border-white/30 p-3 text-white">
          <h1 className="truncate text-sm font-medium">{profile.name}</h1>
          <p className="truncate text-xs text-gold-light">{profile.title}</p>
          <p className="mb-2 truncate text-xs text-white/70">
            at {profile.company}
          </p>
          <ActionButtons />
        </div>
      </div>
    </header>
  );
}
