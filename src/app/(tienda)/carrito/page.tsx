import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Tu carrito", robots: { index: false } };

export default function CartPage() {
  return <CartView />;
}
