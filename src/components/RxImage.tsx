/* eslint-disable @next/next/no-img-element */

/** Muestra la foto de la receta o una receta de ejemplo dibujada (para los datos semilla) */
export function RxImage({ src, className = "" }: { src: string; className?: string }) {
  if (!src.startsWith("sample:")) return <img src={src} alt="Foto de receta" className={`object-cover ${className}`} />;
  const n = Number(src.split(":")[1]) || 1;
  const tilt = [-2, 1.5, -1][n - 1] ?? 0;
  const lines = [
    ["Amoxicilina 500 mg", "1 comp. c/8 h x 7 días"],
    ["Enalapril 10 mg", "1 comp. por día · 30 comp."],
    ["Levotiroxina 50 mcg", "1 comp. en ayunas"],
  ][n - 1] ?? ["Medicación", "Según indicación"];
  return (
    <svg viewBox="0 0 300 400" className={className} role="img" aria-label="Receta de ejemplo">
      <rect width="300" height="400" fill="#DCD6CC" />
      <g transform={`rotate(${tilt} 150 200)`}>
        <rect x="26" y="22" width="248" height="356" rx="4" fill="#FFFEFA" />
        <rect x="26" y="22" width="248" height="52" fill="#EAF2FB" />
        <text x="42" y="46" fontSize="13" fontWeight="700" fill="#2B4C7E" fontFamily="sans-serif">Dr./Dra. Ejemplo</text>
        <text x="42" y="63" fontSize="9" fill="#5E7698" fontFamily="sans-serif">Médico/a clínico/a · M.N. 000000</text>
        <text x="42" y="98" fontSize="9" fill="#888" fontFamily="sans-serif">Paciente: _______________</text>
        <text x="42" y="116" fontSize="9" fill="#888" fontFamily="sans-serif">Obra social: ____________</text>
        <text x="42" y="160" fontSize="26" fontStyle="italic" fill="#1E3A6E" fontFamily="serif">Rp/</text>
        <text x="58" y="196" fontSize="15" fill="#1E3A6E" fontFamily="'Segoe Script', 'Bradley Hand', cursive">{lines[0]}</text>
        <text x="58" y="222" fontSize="12" fill="#1E3A6E" fontFamily="'Segoe Script', 'Bradley Hand', cursive">{lines[1]}</text>
        <path d="M150 320 c20 -30 40 10 60 -12 s30 4 40 -6" stroke="#1E3A6E" strokeWidth="2" fill="none" />
        <rect x="160" y="300" width="96" height="44" rx="22" fill="none" stroke="#7B95C4" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="42" y="360" fontSize="8" fill="#AAA" fontFamily="sans-serif">Fecha: ___/___/______</text>
      </g>
    </svg>
  );
}
