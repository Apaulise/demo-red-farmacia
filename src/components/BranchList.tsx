"use client";

import { Check, Clock, MapPin, Navigation } from "lucide-react";
import { branches, type Branch } from "@/config/site";
import { isOpenNow } from "@/lib/branches";
import { useHydrated } from "@/lib/store";

export function OpenBadge({ branch }: { branch: Branch }) {
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const open = isOpenNow(branch);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
        open ? "bg-brand-100 text-brand-700" : "bg-surface text-ink-mute"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-brand" : "bg-ink-mute"}`} />
      {branch.open24 ? "24 hs" : open ? "Abierta ahora" : "Cerrada"}
    </span>
  );
}

type Props = {
  selected?: string | null;
  onSelect: (slug: string) => void;
  distances?: Record<string, number> | null;
};

export function BranchList({ selected, onSelect, distances }: Props) {
  const list = distances
    ? [...branches].sort((a, b) => (distances[a.slug] ?? 0) - (distances[b.slug] ?? 0))
    : branches;
  return (
    <ul className="space-y-2">
      {list.map((b, i) => {
        const active = b.slug === selected;
        return (
          <li key={b.slug}>
            <button
              type="button"
              onClick={() => onSelect(b.slug)}
              className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                active ? "border-brand bg-brand-50 ring-2 ring-brand/20" : "border-line bg-white hover:border-brand-300"
              }`}
            >
              <span
                className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  active ? "bg-brand text-white" : "bg-surface text-brand"
                }`}
              >
                {active ? <Check className="h-4.5 w-4.5" /> : <MapPin className="h-4.5 w-4.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-bold">{b.name}</span>
                  <OpenBadge branch={b} />
                  {distances && i === 0 && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-bold text-white">
                      Más cercana
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-sm text-ink-soft">
                  {b.address} · {b.neighborhood}
                </span>
                <span className="mt-1 flex items-center gap-3 text-xs text-ink-mute">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {b.hours}
                  </span>
                  {distances && (
                    <span className="inline-flex items-center gap-1">
                      <Navigation className="h-3.5 w-3.5" /> {distances[b.slug].toFixed(1)} km
                    </span>
                  )}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
