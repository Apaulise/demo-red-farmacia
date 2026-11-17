import { ImageResponse } from "next/og";
import { branches, site } from "@/config/site";

export const alt = `${site.name} · Comprá online y retirá en tu farmacia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: site.colors.brand, color: "white", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: site.colors.brand, fontSize: 56, fontWeight: 800 }}>+</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Comprá online.</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#FFC2B5" }}>Retirá en tu farmacia.</div>
        </div>
        <div style={{ fontSize: 30, opacity: 0.85 }}>{`${branches.length} farmacias en ${site.city} · un solo catálogo · retiro en sucursal`}</div>
      </div>
    ),
    size,
  );
}
