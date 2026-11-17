import { useId } from "react";
import type { Product } from "@/data/products";

/**
 * Ilustraciones de producto generadas en SVG (sin logos ni marcas reales).
 * Cada producto define forma + color en src/data/products.ts.
 */

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => {
    const t = amt < 0 ? 0 : 255;
    const p = Math.abs(amt);
    return Math.round((t - c) * p + c);
  };
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

type Props = {
  product: Pick<Product, "art" | "label">;
  className?: string;
  /** Muestra el fondo de color suave */
  background?: boolean;
};

export function ProductArt({ product, className, background = true }: Props) {
  const uid = useId().replace(/:/g, "");
  const { shape, color, tint } = product.art;
  const light = shade(color, 0.35);
  const lighter = shade(color, 0.75);
  const dark = shade(color, -0.25);
  const darker = shade(color, -0.5);
  const g = `g${uid}`;
  const gl = `gl${uid}`;
  const label = product.label;

  const renderLabel = ({ y, w = 56, fill = "#fff", text = darker, size = 10.5 }: { y: number; w?: number; fill?: string; text?: string; size?: number }) => (
    <g>
      <rect x={100 - w / 2} y={y} width={w} height={30} rx={6} fill={fill} opacity={0.95} />
      <text
        x={100}
        y={y + 19.5}
        textAnchor="middle"
        fontSize={label.length > 9 ? size - 2 : size}
        fontWeight={800}
        letterSpacing={0.6}
        fill={text}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );

  const shine = (x: number, y: number, h: number) => (
    <rect x={x} y={y} width={7} height={h} rx={3.5} fill="#fff" opacity={0.35} />
  );

  let body: React.ReactNode;
  switch (shape) {
    case "bottle":
      body = (
        <>
          <rect x={86} y={30} width={28} height={10} rx={3} fill={darker} />
          <rect x={82} y={38} width={36} height={24} rx={6} fill={dark} />
          <path d="M70 62 h60 q12 0 12 14 v86 q0 16 -16 16 h-52 q-16 0 -16 -16 v-86 q0 -14 12 -14z" fill={`url(#${g})`} />
          {shine(66, 74, 80)}
          {renderLabel({ y: 104, w: 62 })}
        </>
      );
      break;
    case "pump":
      body = (
        <>
          <rect x={95} y={40} width={10} height={30} fill={darker} />
          <rect x={84} y={34} width={32} height={12} rx={4} fill={dark} />
          <rect x={110} y={36} width={30} height={7} rx={3.5} fill={dark} />
          <rect x={86} y={62} width={28} height={18} rx={4} fill={dark} />
          <rect x={62} y={78} width={76} height={100} rx={16} fill={`url(#${g})`} />
          {shine(68, 88, 70)}
          {renderLabel({ y: 112, w: 60 })}
        </>
      );
      break;
    case "tube":
      body = (
        <>
          <path d="M62 28 h76 v10 q-8 60 -12 112 h-52 q-4 -52 -12 -112z" fill={`url(#${g})`} />
          <rect x={62} y={26} width={76} height={8} rx={2} fill={dark} />
          <path d="M66 31 h68" stroke={darker} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
          <rect x={76} y={148} width={48} height={30} rx={6} fill={darker} />
          {shine(72, 46, 76)}
          {renderLabel({ y: 78, w: 56 })}
        </>
      );
      break;
    case "jar":
      body = (
        <>
          <rect x={56} y={100} width={88} height={78} rx={18} fill={`url(#${g})`} />
          <rect x={50} y={76} width={100} height={30} rx={8} fill={dark} />
          <rect x={50} y={76} width={100} height={8} rx={4} fill={darker} opacity={0.5} />
          {shine(62, 110, 52)}
          {renderLabel({ y: 124, w: 64 })}
        </>
      );
      break;
    case "dropper":
      body = (
        <>
          <rect x={89} y={24} width={22} height={44} rx={11} fill={darker} />
          <rect x={84} y={64} width={32} height={22} rx={4} fill={dark} />
          <rect x={64} y={84} width={72} height={94} rx={16} fill={`url(#${g})`} />
          <rect x={64} y={130} width={72} height={48} rx={16} fill={dark} opacity={0.25} />
          {shine(70, 92, 66)}
          {renderLabel({ y: 112, w: 58 })}
        </>
      );
      break;
    case "spray":
      body = (
        <>
          <rect x={96} y={24} width={12} height={10} rx={2} fill={darker} />
          <rect x={72} y={30} width={56} height={36} rx={12} fill={lighter} stroke={light} strokeWidth={2} />
          <rect x={70} y={62} width={60} height={116} rx={12} fill={`url(#${g})`} />
          <rect x={70} y={62} width={60} height={8} fill={darker} opacity={0.3} />
          {shine(76, 76, 86)}
          {renderLabel({ y: 108, w: 54 })}
        </>
      );
      break;
    case "perfume":
      body = (
        <>
          <rect x={80} y={30} width={40} height={38} rx={6} fill={darker} />
          <rect x={80} y={30} width={40} height={10} rx={5} fill="#fff" opacity={0.15} />
          <rect x={89} y={66} width={22} height={18} fill={dark} />
          <rect x={52} y={82} width={96} height={96} rx={24} fill={lighter} stroke={light} strokeWidth={3} />
          <rect x={60} y={104} width={80} height={66} rx={18} fill={`url(#${g})`} opacity={0.9} />
          {shine(62, 92, 60)}
          {renderLabel({ y: 120, w: 58 })}
        </>
      );
      break;
    case "box":
      body = (
        <>
          <path d="M44 72 L64 54 L162 54 L142 72 Z" fill={light} />
          <path d="M142 72 L162 54 L162 160 L142 178 Z" fill={dark} />
          <rect x={44} y={72} width={98} height={106} fill={`url(#${g})`} />
          <rect x={44} y={152} width={98} height={10} fill="#fff" opacity={0.25} />
          <g transform="translate(-7 0)">
            {renderLabel({ y: 100, w: 70 })}
          </g>
        </>
      );
      break;
    case "blister":
      body = (
        <>
          <path d="M34 82 L50 68 L128 68 L112 82 Z" fill={light} />
          <path d="M112 82 L128 68 L128 162 L112 176 Z" fill={dark} />
          <rect x={34} y={82} width={78} height={94} fill={`url(#${g})`} />
          <g transform="rotate(12 140 110)">
            <rect x={104} y={40} width={64} height={118} rx={10} fill="#E6EAEE" stroke="#C9D0D6" strokeWidth={2} />
            {[0, 1, 2, 3].map((r) =>
              [0, 1].map((c) => (
                <g key={`${r}${c}`}>
                  <ellipse cx={121 + c * 30} cy={60 + r * 26} rx={10} ry={8} fill="#fff" stroke="#C9D0D6" />
                  <ellipse cx={121 + c * 30} cy={60 + r * 26} rx={6.5} ry={5} fill={light} />
                </g>
              )),
            )}
          </g>
          <g transform="translate(-27 0)">
            {renderLabel({ y: 112, w: 64, size: 10 })}
          </g>
        </>
      );
      break;
    case "diaper":
      body = (
        <>
          <rect x={42} y={44} width={116} height={134} rx={30} fill={`url(#${g})`} />
          <rect x={78} y={52} width={44} height={12} rx={6} fill={dark} opacity={0.5} />
          <circle cx={100} cy={104} r={24} fill="#fff" opacity={0.95} />
          <circle cx={92} cy={100} r={2.6} fill={darker} />
          <circle cx={108} cy={100} r={2.6} fill={darker} />
          <path d="M91 110 q9 8 18 0" stroke={darker} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <circle cx={84} cy={108} r={3.5} fill="#F7A8B8" opacity={0.7} />
          <circle cx={116} cy={108} r={3.5} fill="#F7A8B8" opacity={0.7} />
          {shine(50, 70, 80)}
          {renderLabel({ y: 138, w: 78 })}
        </>
      );
      break;
    case "babybottle":
      body = (
        <>
          <path d="M88 64 q0 -36 12 -38 q12 2 12 38z" fill="#F3D9B1" />
          <rect x={72} y={60} width={56} height={20} rx={6} fill={`url(#${g})`} />
          <rect x={74} y={78} width={52} height={100} rx={18} fill="#fff" stroke={lighter} strokeWidth={3} />
          <rect x={77} y={118} width={46} height={57} rx={15} fill={lighter} />
          {[96, 108, 120, 132, 144, 156].map((y) => (
            <rect key={y} x={110} y={y} width={10} height={2} rx={1} fill={light} />
          ))}
          {renderLabel({ y: 92, w: 50, size: 9, fill: color, text: "#fff" })}
        </>
      );
      break;
    case "stick":
      body = (
        <>
          <rect x={80} y={30} width={40} height={60} rx={20} fill={dark} />
          <rect x={80} y={82} width={40} height={96} rx={14} fill={`url(#${g})`} />
          <rect x={80} y={82} width={40} height={6} fill={darker} opacity={0.35} />
          {shine(85, 40, 40)}
          <g transform="rotate(-90 100 130)">
            <text x={100} y={134} textAnchor="middle" fontSize={11} fontWeight={800} letterSpacing={1} fill="#fff" fontFamily="ui-sans-serif, system-ui, sans-serif">
              {label}
            </text>
          </g>
        </>
      );
      break;
    case "wipes":
      body = (
        <>
          <rect x={30} y={80} width={140} height={96} rx={26} fill={`url(#${g})`} />
          <rect x={68} y={88} width={64} height={30} rx={12} fill={lighter} stroke={light} strokeWidth={2} />
          <path d="M84 96 q16 -30 32 0" fill="#fff" stroke="#E4E8EC" strokeWidth={1.5} />
          {shine(40, 100, 50)}
          {renderLabel({ y: 132, w: 84 })}
        </>
      );
      break;
    case "soap":
      body = (
        <>
          <rect x={46} y={136} width={108} height={40} rx={14} fill={dark} />
          <rect x={52} y={102} width={96} height={38} rx={14} fill={light} />
          <rect x={58} y={70} width={84} height={36} rx={14} fill={`url(#${g})`} />
          <ellipse cx={150} cy={64} rx={9} ry={9} fill="#fff" opacity={0.7} stroke={lighter} />
          <ellipse cx={164} cy={82} rx={5} ry={5} fill="#fff" opacity={0.7} stroke={lighter} />
          {renderLabel({ y: 140, w: 70, fill: "#fff" })}
        </>
      );
      break;
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={product.label}>
      <defs>
        <linearGradient id={g} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <radialGradient id={gl} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
          <stop offset="1" stopColor={tint} stopOpacity={0} />
        </radialGradient>
      </defs>
      {background && (
        <>
          <rect width={200} height={200} fill={tint} />
          <circle cx={100} cy={96} r={78} fill={`url(#${gl})`} />
        </>
      )}
      <ellipse cx={100} cy={182} rx={58} ry={7} fill={darker} opacity={0.13} />
      {body}
    </svg>
  );
}
