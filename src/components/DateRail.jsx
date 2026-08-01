// §6.6: patrón estándar del CV académico. Columna izquierda estrecha (~7rem)
// con las fechas alineadas a la derecha en --muted y números tabulares; columna
// derecha con el contenido. En móvil colapsa a una columna con la fecha encima.
export default function DateRail({ dates, children }) {
  return (
    <div className="mt-6 sm:flex sm:gap-6">
      {/* 8rem y no 7: "Jan 2025 – Dec 2028" parte en dos líneas a 7rem. */}
      <p className="tabular shrink-0 text-meta text-muted sm:w-32 sm:pt-1 sm:text-right">
        {dates}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
