import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-5 font-display text-4xl font-extrabold">No encontramos esta página</h1>
        <p className="mt-2 text-ink-soft">Puede que el producto ya no esté en el catálogo.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-bold text-white">Volver al inicio</Link>
      </div>
    </div>
  );
}
