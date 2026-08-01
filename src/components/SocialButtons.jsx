// Botones con logo para LinkedIn, GitHub y Google Scholar.
//
// Los SVG van inline con los paths embebidos: el sitio es estático y no debe
// ganar una dependencia de red para pintar tres iconos. Heredan currentColor,
// así que funcionan igual en claro y en oscuro.

const ICONS = {
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
  ),
  github: (
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  ),
  // Google Scholar: el birrete de su logotipo.
  scholar: (
    <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14m0-24L0 9.5l4.84 3.77A7.97 7.97 0 0 1 12 8.9a7.97 7.97 0 0 1 7.16 4.36L24 9.5z" />
  ),
};

function Button({ icon, label, href }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="ui inline-flex min-h-11 items-center gap-2 rounded border border-rule px-4 py-2 text-nav text-text no-underline transition-colors duration-150 hover:border-accent hover:text-accent"
    >
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        {ICONS[icon]}
      </svg>
      {label}
    </a>
  );
}

export default function SocialButtons({ items }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <Button key={item.icon} {...item} />
      ))}
    </div>
  );
}
