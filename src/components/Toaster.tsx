"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

type Toast = { id: number; title: string; body?: string };

const EVT = "rf-toast";

export function toast(title: string, body?: string) {
  window.dispatchEvent(new CustomEvent(EVT, { detail: { title, body } }));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    let n = 0;
    const on = (e: Event) => {
      const { title, body } = (e as CustomEvent).detail;
      const id = ++n;
      setItems((s) => [...s.slice(-2), { id, title, body }]);
      setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2600);
    };
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-4 md:top-auto md:bottom-6">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-sm animate-pop items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-2xl"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{t.title}</p>
            {t.body && <p className="truncate text-xs text-white/70">{t.body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
