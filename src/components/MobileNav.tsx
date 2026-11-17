"use client";

import { FileText, Home, LayoutGrid, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/productos", label: "Productos", icon: LayoutGrid },
  { href: "/receta", label: "Receta", icon: FileText },
  { href: "/sucursales", label: "Sucursales", icon: MapPin },
  { href: "/carrito", label: "Carrito", icon: ShoppingBag },
];

export function MobileNav() {
  const pathname = usePathname();
  const count = useStore("cart").reduce((a, i) => a + i.qty, 0);
  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-semibold ${active ? "text-brand" : "text-ink-mute"}`}>
                <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? "bg-brand-100" : ""}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {label}
                {href === "/carrito" && count > 0 && (
                  <span className="absolute right-[calc(50%-20px)] top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
