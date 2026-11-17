"use client";

import { Camera, Check, ImagePlus, Info, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { branches, getBranch, site } from "@/config/site";
import { waLink } from "@/lib/format";
import { addPrescription, setBranch, trackWhatsApp, useStore } from "@/lib/store";
import type { Prescription } from "@/lib/types";
import { WhatsAppIcon } from "./icons";
import { RxImage } from "./RxImage";

/** Reduce la foto para guardarla liviana en el navegador */
function compress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 900;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const COVERAGE = ["Particular", "PAMI", "IOMA", "OSDE", "Swiss Medical", "Galeno", "Otra"];

export function RxForm() {
  const current = useStore("branch");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [coverage, setCoverage] = useState("Particular");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<Prescription | null>(null);
  const [touched, setTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const branch = getBranch(current);
  const valid = !!image && !!branch && name.trim().length > 1 && phone.replace(/\D/g, "").length >= 8;

  const onFile = async (f?: File) => {
    if (!f) return;
    setLoading(true);
    try {
      setImage(await compress(f));
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    setTouched(true);
    if (!valid || !branch) return;
    const rx: Prescription = {
      id: `RX-${Date.now().toString(36).toUpperCase().slice(-5)}`,
      createdAt: new Date().toISOString(),
      branch: branch.slug,
      name: name.trim(),
      phone: phone.trim(),
      note: [coverage !== "Particular" ? `Obra social: ${coverage}.` : "", note.trim()].filter(Boolean).join(" "),
      image: image!,
      status: "pendiente",
      live: true,
    };
    addPrescription(rx);
    setSent(rx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sent) {
    const b = getBranch(sent.branch)!;
    const msg = `¡Hola ${site.name} ${b.name}! Soy ${sent.name}. Les envié la consulta de receta *${sent.id}* desde la web.${sent.note ? ` ${sent.note}` : ""} ¿Me confirman disponibilidad y precio? ¡Gracias!`;
    return (
      <div className="mx-auto max-w-xl animate-fade-up rounded-[32px] border border-line bg-white p-6 text-center md:p-10">
        <span className="mx-auto grid h-16 w-16 animate-pop place-items-center rounded-full bg-brand text-white">
          <Check className="h-8 w-8" strokeWidth={3} />
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold">¡Consulta enviada!</h2>
        <p className="mt-2 text-ink-soft">
          {b.name} recibió tu receta (consulta <b>{sent.id}</b>). Te van a responder por WhatsApp con disponibilidad y precio.
        </p>
        <div className="mx-auto mt-5 w-40 overflow-hidden rounded-2xl border border-line shadow-lg">
          <RxImage src={sent.image} className="aspect-[3/4] w-full" />
        </div>
        <a
          href={waLink(b.whatsapp, msg)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsApp(b.slug)}
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-wa py-3.5 font-bold text-white shadow-lg shadow-wa/30"
        >
          <WhatsAppIcon className="h-5 w-5" /> Avisar por WhatsApp a {b.name}
        </a>
        <button
          onClick={() => {
            setSent(null);
            setImage(null);
            setNote("");
          }}
          className="mt-3 text-sm font-semibold text-ink-soft hover:text-brand"
        >
          Enviar otra receta
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-3">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        <button
          onClick={() => fileRef.current?.click()}
          className={`group relative grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[28px] border-2 border-dashed transition ${
            image ? "border-transparent" : touched ? "border-accent bg-accent-50" : "border-brand-300 bg-brand-50 hover:bg-brand-100"
          }`}
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          ) : image ? (
            <>
              <RxImage src={image} className="absolute inset-0 h-full w-full" />
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                <RefreshCw className="h-3.5 w-3.5" /> Cambiar foto
              </span>
            </>
          ) : (
            <span className="text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30 transition group-hover:scale-105">
                <Camera className="h-8 w-8" />
              </span>
              <span className="mt-3 block font-display text-xl font-extrabold">Sacale una foto a tu receta</span>
              <span className="mt-1 block text-sm text-ink-soft">o subila desde la galería (JPG o PNG)</span>
            </span>
          )}
        </button>
        {!image && (
          <button
            onClick={() => setImage(`sample:${1 + Math.floor(Math.random() * 3)}`)}
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-ink-mute hover:text-brand"
          >
            <ImagePlus className="h-4 w-4" /> Usar una receta de ejemplo (demo)
          </button>
        )}
        <div className="flex items-start gap-2 rounded-2xl bg-surface p-4 text-sm text-ink-soft">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <p>
            <b className="text-ink">Esto es una consulta, no una compra.</b> La farmacia revisa tu receta y te responde por WhatsApp. La dispensa
            de medicamentos con receta se realiza únicamente en el mostrador, presentando la receta original.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-[28px] border border-line bg-white p-5">
        <label className="block text-sm font-semibold">
          ¿Qué farmacia te responde?
          <select
            value={current ?? ""}
            onChange={(e) => setBranch(e.target.value || null)}
            className={`mt-1 h-12 w-full rounded-2xl border bg-surface px-3 font-normal outline-none focus:border-brand ${touched && !branch ? "border-accent" : "border-line"}`}
          >
            <option value="">Elegí una sucursal</option>
            {branches.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} — {b.address}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Nombre
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className={`mt-1 h-12 w-full rounded-2xl border bg-surface px-3 font-normal outline-none focus:border-brand ${touched && name.trim().length < 2 ? "border-accent" : "border-line"}`} />
          </label>
          <label className="block text-sm font-semibold">
            Celular (WhatsApp)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="11 5555-5555" className={`mt-1 h-12 w-full rounded-2xl border bg-surface px-3 font-normal outline-none focus:border-brand ${touched && phone.replace(/\D/g, "").length < 8 ? "border-accent" : "border-line"}`} />
          </label>
        </div>
        <div>
          <p className="text-sm font-semibold">Cobertura</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {COVERAGE.map((c) => (
              <button
                key={c}
                onClick={() => setCoverage(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${coverage === c ? "bg-ink text-white" : "bg-surface text-ink-soft hover:bg-brand-100"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm font-semibold">
          Comentario (opcional)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Ej: ¿tienen el genérico? ¿Puedo retirar hoy?" className="mt-1 w-full resize-none rounded-2xl border border-line bg-surface p-3 font-normal outline-none focus:border-brand" />
        </label>
        <button
          onClick={submit}
          className={`flex w-full items-center justify-center gap-2 rounded-full bg-brand py-4 font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-700 ${valid ? "" : "opacity-70"}`}
        >
          Enviar consulta a la farmacia
        </button>
        {touched && !valid && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent">
            <Info className="h-3.5 w-3.5" /> Falta {!image ? "la foto de la receta" : !branch ? "elegir la sucursal" : "completar nombre y celular"}.
          </p>
        )}
      </div>
    </div>
  );
}
