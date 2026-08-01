import { useState } from 'react';
import SeoHead from '../components/SeoHead';
import SocialButtons from '../components/SocialButtons';
import { LINKS } from '../lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactView({ locale, routeKey, copy }) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const t = copy.form;

  // Validación en cliente que refleja la del servidor (functions/api/contact.js:
  // name >= 2, email con formato, message >= 10). Antes solo había validación
  // HTML5, así que un mensaje corto recibía un 400 y el usuario veía un error
  // genérico en vez del motivo real.
  function validate() {
    if (values.name.trim().length < 2) return t.nameTooShort;
    if (!EMAIL_RE.test(values.email)) return t.emailInvalid;
    if (values.message.trim().length < 10) return t.messageTooShort;
    return null;
  }

  async function onSubmit(event) {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setStatus('error');
      setError(problem);
      return;
    }

    setStatus('sending');
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      setValues({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setError(t.error);
    }
  }

  const field = (name, type = 'text') => ({
    id: name,
    name,
    value: values[name],
    onChange: (e) => setValues((v) => ({ ...v, [name]: e.target.value })),
    className:
      'mt-1 w-full border border-rule bg-transparent px-3 py-2 text-body text-text',
    ...(type === 'textarea' ? { rows: 6 } : { type }),
  });

  // El correo se mantiene como texto: es el canal que el §7.7 pide destacar.
  const emails = [
    { label: copy.labels.email, value: LINKS.email, href: `mailto:${LINKS.email}` },
    LINKS.emailSecondary
      ? {
          label: copy.labels.emailSecondary,
          value: LINKS.emailSecondary,
          href: `mailto:${LINKS.emailSecondary}`,
        }
      : null,
  ].filter(Boolean);

  const social = [
    { icon: 'linkedin', label: 'LinkedIn', href: LINKS.linkedin },
    { icon: 'github', label: 'GitHub', href: LINKS.github },
    LINKS.scholar ? { icon: 'scholar', label: 'Google Scholar', href: LINKS.scholar } : null,
  ].filter(Boolean);

  return (
    <>
      <SeoHead
        routeKey={routeKey}
        locale={locale}
        title={copy.title}
        description={copy.metaDescription}
      />

      <h1 className="text-h1">{copy.heading}</h1>
      <p className="mt-6">{copy.intro}</p>

      <dl className="mt-6 space-y-1">
        {emails.map((link) => (
          <div key={link.label}>
            <dt className="ui inline text-meta text-muted">{link.label}:</dt>{' '}
            <dd className="inline">
              <a href={link.href}>{link.value}</a>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7">
        <SocialButtons items={social} />
      </div>

      <section className="mt-12 border-t border-rule pt-8" aria-labelledby="form-heading">
        <h2 id="form-heading" className="text-h2">
          {t.heading}
        </h2>

        <form onSubmit={onSubmit} className="mt-4 max-w-prose space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="ui text-meta">{t.name}</label>
            <input {...field('name')} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="email" className="ui text-meta">{t.email}</label>
            <input {...field('email', 'email')} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="message" className="ui text-meta">{t.message}</label>
            <textarea {...field('message', 'textarea')} required />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="ui rounded border border-rule px-5 py-2 text-nav text-text transition-colors duration-150 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {status === 'sending' ? t.sending : t.submit}
          </button>

          <p role="status" aria-live="polite" className="text-meta">
            {status === 'sent' && <span>{t.sent}</span>}
            {status === 'error' && error && <span>{error}</span>}
          </p>
        </form>
      </section>
    </>
  );
}
