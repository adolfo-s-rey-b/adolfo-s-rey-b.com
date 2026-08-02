// §6.6: patrón estándar del CV académico. Columna izquierda estrecha (~7rem)
// con las fechas alineadas a la derecha en --muted y números tabulares; columna
// derecha con el contenido. En móvil colapsa a una columna con la fecha encima.
export default function DateRail({ dates, children }) {
  return (
    <div className="mt-6 sm:flex sm:gap-6">
      {/* 9rem y whitespace-nowrap: a menos, "Aug 2019 – Jun 2025" parte en dos
          líneas y el canal de fechas deja de leerse de un vistazo. */}
      <p className="ui tabular shrink-0 whitespace-nowrap text-meta text-muted sm:w-36 sm:pt-1 sm:text-right">
        {dates}
      </p>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
