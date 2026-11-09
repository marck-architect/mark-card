import type { ReactNode } from "react";

interface SectionLabelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/** Small spaced-out uppercase heading with a short gold rule, as on the main site. */
export function SectionLabel({ id, children, className = "" }: SectionLabelProps) {
  return (
    <h2
      id={id}
      className={`flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink ${className}`}
    >
      <span aria-hidden="true" className="h-px w-6 bg-gold-line" />
      {children}
    </h2>
  );
}
