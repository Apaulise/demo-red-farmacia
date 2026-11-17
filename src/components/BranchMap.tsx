"use client";

import { useRouter } from "next/navigation";
import { branches } from "@/config/site";

type Props = {
  selected?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
};

/** Mapa estilizado (ilustrativo) de Berazategui con las sucursales de la red */
export function BranchMap({ selected, onSelect, className = "" }: Props) {
  const router = useRouter();
  const select = onSelect ?? ((slug: string) => router.push(`/sucursales/${slug}`));
  return (
    <div className={`relative aspect-[5/4] w-full overflow-hidden rounded-3xl bg-[#EEF2EA] ${className}`}>
      <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" aria-hidden>
        {/* Río */}
        <path d="M58 0 H100 V34 C92 30 86 22 80 16 C72 9 64 6 58 0Z" fill="#CFE3EE" />
        <path d="M62 0 C68 6 76 10 82 17 C88 24 94 29 100 31" stroke="#B9D6E6" strokeWidth="0.6" fill="none" />
        <text x="86" y="9" fontSize="2.6" fill="#6C9BB5" fontStyle="italic" textAnchor="middle">Río de la Plata</text>
        {/* Parques */}
        <rect x="8" y="10" width="14" height="9" rx="2.5" fill="#D6E7CF" />
        <rect x="60" y="58" width="12" height="10" rx="2.5" fill="#D6E7CF" />
        <circle cx="46" cy="64" r="5" fill="#D6E7CF" />
        <rect x="84" y="40" width="12" height="16" rx="3" fill="#D6E7CF" />
        {/* Grilla de calles */}
        <g stroke="#fff" strokeWidth="0.55" opacity="0.95">
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={`a${i}`} x1={-20 + i * 7} y1={0} x2={10 + i * 7} y2={80} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`b${i}`} x1={0} y1={-6 + i * 6} x2={100} y2={-30 + i * 6} />
          ))}
        </g>
        {/* Avenidas */}
        <g fill="none" strokeLinecap="round">
          <path d="M0 52 C25 46 50 40 100 30" stroke="#fff" strokeWidth="2.2" />
          <path d="M14 80 C24 60 38 40 52 0" stroke="#fff" strokeWidth="2" />
          <path d="M0 70 C30 64 60 60 100 58" stroke="#fff" strokeWidth="1.8" />
          <path d="M36 80 C46 60 60 40 72 22" stroke="#fff" strokeWidth="1.6" />
          {/* Autopista */}
          <path d="M0 40 C30 34 60 26 100 14" stroke="#F6DF9B" strokeWidth="2.4" />
          {/* Tren */}
          <path d="M0 60 C30 52 60 46 100 40" stroke="#B8B2A7" strokeWidth="0.7" strokeDasharray="1.4 1" />
        </g>
        <g fontSize="2.1" fill="#8A948C" fontWeight="600">
          <text x="5" y="50" transform="rotate(-8 5 50)">Av. Mitre</text>
          <text x="40" y="20" transform="rotate(-70 40 20)">Av. 14</text>
          <text x="70" y="57.5" transform="rotate(-2 70 57.5)">Camino Gral. Belgrano</text>
          <text x="6" y="38.5" transform="rotate(-9 6 38.5)" fill="#B39646">Autopista Bs. As. – La Plata</text>
        </g>
      </svg>

      {branches.map((b) => {
        const active = b.slug === selected;
        return (
          <button
            key={b.slug}
            type="button"
            onClick={() => select(b.slug)}
            className="group absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${b.map.x}%`, top: `${b.map.y}%`, zIndex: active ? 20 : 10 }}
            aria-label={`Elegir sucursal ${b.name}`}
          >
            {active && (
              <span className="absolute left-1/2 top-full -ml-3 -mt-3 h-6 w-6 animate-pulse-ring rounded-full bg-brand/40" />
            )}
            <span
              className={`relative flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-white px-2 py-1 text-[11px] font-bold shadow-lg transition-all ${
                active
                  ? "scale-110 bg-accent text-white"
                  : "bg-brand text-white group-hover:scale-105 group-hover:bg-brand-700"
              }`}
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                <rect x="6" y="2" width="4" height="12" rx="1" fill="currentColor" />
                <rect x="2" y="6" width="12" height="4" rx="1" fill="currentColor" />
              </svg>
              <span className={active ? "" : "hidden sm:inline"}>{b.name}</span>
            </span>
            <span
              className={`mx-auto block h-2 w-2 -translate-y-[3px] rotate-45 border-b-2 border-r-2 border-white ${
                active ? "bg-accent" : "bg-brand"
              }`}
            />
          </button>
        );
      })}
      <span className="absolute bottom-2 left-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-ink-mute backdrop-blur">
        Mapa ilustrativo
      </span>
    </div>
  );
}
