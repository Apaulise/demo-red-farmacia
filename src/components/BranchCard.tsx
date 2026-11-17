"use client";

import { Check, Clock, MapPin, Navigation, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import type { Branch } from "@/config/site";
import { branchMapsUrl, waLink } from "@/lib/format";
import { setBranch, trackWhatsApp, useStore } from "@/lib/store";
import { OpenBadge } from "./BranchList";
import { WhatsAppIcon } from "./icons";
import { toast } from "./Toaster";

export function BranchCard({ branch, detailed = false }: { branch: Branch; detailed?: boolean }) {
  const current = useStore("branch");
  const mine = current === branch.slug;
  return (
    <div className={`flex flex-col gap-3 rounded-3xl border bg-white p-5 transition ${mine ? "border-brand ring-4 ring-brand/10" : "border-line"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/sucursales/${branch.slug}`} className="font-display text-xl font-extrabold hover:text-brand">
            {branch.name}
          </Link>
          <p className="text-sm text-ink-soft">{branch.neighborhood}</p>
        </div>
        <OpenBadge branch={branch} />
      </div>
      <ul className="space-y-1.5 text-sm text-ink-soft">
        <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {branch.address}</li>
        <li className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {branch.hours}</li>
        <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {branch.phone}</li>
        {detailed && <li className="flex gap-2"><UserRound className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {branch.pharmacist}</li>}
      </ul>
      <div className="mt-auto grid grid-cols-[1fr_auto_auto] gap-2 pt-1">
        <button
          onClick={() => {
            setBranch(branch.slug);
            toast(`Retirás en ${branch.name}`);
          }}
          className={`flex h-11 items-center justify-center gap-1.5 rounded-full text-sm font-bold transition ${
            mine ? "bg-brand-100 text-brand-700" : "bg-brand text-white hover:bg-brand-700"
          }`}
        >
          {mine ? <><Check className="h-4 w-4" /> Es tu farmacia</> : "Retirar acá"}
        </button>
        <a
          href={waLink(branch.whatsapp, `Hola ${branch.name}! Tengo una consulta:`)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsApp(branch.slug)}
          className="grid h-11 w-11 place-items-center rounded-full bg-wa text-white transition hover:scale-105"
          aria-label={`WhatsApp ${branch.name}`}
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <a
          href={branchMapsUrl(branch)}
          target="_blank"
          rel="noreferrer"
          className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink transition hover:bg-brand-100"
          aria-label="Cómo llegar"
        >
          <Navigation className="h-4.5 w-4.5" />
        </a>
      </div>
    </div>
  );
}
