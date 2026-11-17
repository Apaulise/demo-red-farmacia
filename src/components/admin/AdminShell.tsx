"use client";

import { ExternalLink, FileText, LayoutDashboard, Megaphone, Package, RotateCcw, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { branches, getBranch, site } from "@/config/site";
import { ars } from "@/lib/format";
import { resetDemo, useStore } from "@/lib/store";
import { LogoMark } from "../Logo";
import { toast } from "../Toaster";

const BranchCtx = createContext<{ branch: string; setBranch: (b: string) => void }>({ branch: "all", setBranch: () => {} });
export const useAdminBranch = () => useContext(BranchCtx);

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/recetas", label: "Recetas", icon: FileText },
  { href: "/admin/ofertas", label: "Ofertas", icon: Megaphone },
];

/** Avisa cuando entra un pedido o receta nueva (por ejemplo desde otra pestaña con la tienda) */
function useIncomingAlerts() {
  const orders = useStore("orders");
  const rx = useStore("rx");
  const seen = useRef<{ o: string | null; r: string | null } | null>(null);
  useEffect(() => {
    const top = { o: orders[0]?.code ?? null, r: rx[0]?.id ?? null };
    if (seen.current === null) {
      if (orders.length) seen.current = top;
      return;
    }
    if (top.o && top.o !== seen.current.o && orders[0].live) {
      const o = orders[0];
      toast(`🛎️ Nuevo pedido ${o.code}`, `${getBranch(o.branch)?.name} · ${ars(o.onlineTotal + o.reservaTotal)} · ${o.customer.name}`);
    }
    if (top.r && top.r !== seen.current.r && rx[0].live) {
      toast(`📄 Nueva receta ${rx[0].id}`, `${getBranch(rx[0].branch)?.name} · ${rx[0].name}`);
    }
    seen.current = top;
  }, [orders, rx]);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [branch, setBranch] = useState("all");
  const orders = useStore("orders");
  const rx = useStore("rx");
  const pending = orders.filter((o) => o.status === "nuevo" && (branch === "all" || o.branch === branch)).length;
  const rxPending = rx.filter((r) => r.status === "pendiente" && (branch === "all" || r.branch === branch)).length;
  useIncomingAlerts();

  const badge = (href: string) => (href === "/admin/pedidos" ? pending : href === "/admin/recetas" ? rxPending : 0);

  return (
    <BranchCtx.Provider value={{ branch, setBranch }}>
      <div className="min-h-screen bg-surface md:grid md:grid-cols-[248px_1fr]">
        <aside className="hidden flex-col gap-6 border-r border-line bg-white p-5 md:sticky md:top-0 md:flex md:h-screen">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-extrabold">{site.name}</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-mute">Panel de la red</span>
            </span>
          </Link>
          <nav className="space-y-1">
            {nav.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-brand text-white" : "text-ink-soft hover:bg-surface"}`}
                >
                  <Icon className="h-4.5 w-4.5" /> {label}
                  {badge(href) > 0 && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-extrabold ${active ? "bg-white/20" : "bg-accent text-white"}`}>{badge(href)}</span>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-2">
            <Link href="/" target="_blank" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-surface">
              <Store className="h-4 w-4" /> Ver la tienda <ExternalLink className="ml-auto h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => {
                resetDemo();
                toast("Demo reiniciada", "Datos de ejemplo frescos");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-mute hover:bg-surface"
            >
              <RotateCcw className="h-4 w-4" /> Reiniciar demo
            </button>
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-[11px] text-brand-700">Modo demo · datos de ejemplo</p>
          </div>
        </aside>

        <div className="min-w-0 pb-24 md:pb-10">
          <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 md:px-8">
              <div className="md:hidden">
                <LogoMark className="h-8 w-8" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-extrabold md:text-xl">{nav.find((n) => (n.href === "/admin" ? pathname === n.href : pathname.startsWith(n.href)))?.label ?? "Panel"}</p>
              </div>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-10 max-w-[52vw] rounded-full border border-line bg-white px-3 text-sm font-semibold outline-none focus:border-brand"
                aria-label="Filtrar por sucursal"
              >
                <option value="all">Toda la red ({branches.length} sucursales)</option>
                {branches.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </header>
          <main className="px-4 py-5 md:px-8 md:py-7">{children}</main>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-semibold ${active ? "text-brand" : "text-ink-mute"}`}>
                <Icon className="h-5 w-5" />
                {label}
                {badge(href) > 0 && (
                  <span className="absolute right-[calc(50%-18px)] top-1 rounded-full bg-accent px-1.5 text-[10px] font-extrabold text-white">{badge(href)}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </BranchCtx.Provider>
  );
}
