import type { ReactNode } from "react";

interface SectionLabelProps {
  id: string;
  children: ReactNode;
  /** Optional icon shown before the text. */
  icon?: ReactNode;
  className?: string;
}

/** Small spaced-out uppercase heading, as on the main site. */
export function SectionLabel({
  id,
  children,
  icon,
  className = "",
}: SectionLabelProps) {
  return (
    <h2
      id={id}
      className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink ${className}`}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-gold-light"
        >
          {icon}
        </span>
      )}
      {children}
    </h2>
  );
}
