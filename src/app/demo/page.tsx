import type { Metadata } from "next";
import { DemoStage } from "@/components/DemoStage";

export const metadata: Metadata = {
  title: "Modo presentación",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <DemoStage />;
}
