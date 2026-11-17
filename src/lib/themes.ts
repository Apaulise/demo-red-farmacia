import type { OfferTheme } from "@/data/offers";

export const themeStyles: Record<OfferTheme, { bg: string; fg: string; soft: string; chip: string; label: string }> = {
  brand: { bg: "var(--brand)", fg: "#fff", soft: "color-mix(in oklab, var(--brand) 70%, white)", chip: "rgba(255,255,255,.18)", label: "Verde marca" },
  accent: { bg: "var(--accent)", fg: "#fff", soft: "color-mix(in oklab, var(--accent) 70%, white)", chip: "rgba(255,255,255,.2)", label: "Coral" },
  violet: { bg: "#5B43D6", fg: "#fff", soft: "#8F7BF0", chip: "rgba(255,255,255,.18)", label: "Violeta" },
  sun: { bg: "#FFB321", fg: "#2A1E00", soft: "#FFD272", chip: "rgba(0,0,0,.08)", label: "Sol" },
  sky: { bg: "#1F8FE0", fg: "#fff", soft: "#6CBDF5", chip: "rgba(255,255,255,.2)", label: "Cielo" },
};
