import type { Metadata } from "next";
import { Suspense } from "react";
import { Confirmation } from "@/components/Confirmation";

export const metadata: Metadata = { title: "Pedido confirmado", robots: { index: false } };

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="h-[70vh]" />}>
      <Confirmation />
    </Suspense>
  );
}
