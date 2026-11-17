import Link from "next/link";
import { site } from "@/config/site";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  if (site.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={site.logo} alt={site.name} className={className} />;
  }
  return (
    <span className={`relative grid place-items-center rounded-xl bg-brand text-white shadow-sm ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" aria-hidden>
        <rect x="12" y="4" width="8" height="24" rx="2.5" fill="currentColor" />
        <rect x="4" y="12" width="24" height="8" rx="2.5" fill="currentColor" />
        <circle cx="24.5" cy="7.5" r="3.5" fill="var(--accent)" />
      </svg>
    </span>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — inicio`}>
      <LogoMark />
      <span className="leading-none">
        <span className={`block font-display text-[19px] font-extrabold ${light ? "text-white" : "text-ink"}`}>
          {site.name}
        </span>
        <span className={`block text-[10.5px] font-semibold uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-brand"}`}>
          {site.city}
        </span>
      </span>
    </Link>
  );
}
