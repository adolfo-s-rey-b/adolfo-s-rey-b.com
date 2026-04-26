import Head from 'next/head';
import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import contactData from '../../data/contact.json';

function LinkedinIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function GithubIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

export default function ContactPage() {
  const [formState, setFormState] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setFormState('sending');
    try {
      const res = await fetch(contactData.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormState('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  }

  return (
    <>
      <Head>
        <title>Contacto — Adolfo S. Rey B.</title>
        <meta name="description" content="Contacta a Adolfo S. Rey B. — Economista y Abogado. Disponible para investigación, consultoría y proyectos de política pública." />
        <meta property="og:title" content="Contacto — Adolfo S. Rey B." />
        <meta property="og:description" content="¿Interesado en investigar o explorar proyectos conjuntos? Conversemos." />
        <meta property="og:url" content="https://adolfo-s-rey-b.com/contact" />
      </Head>
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Contacto</h1>
        <p className="text-lg text-gray-600">
          ¿Interesado en investigar, discutir sobre política pública o explorar proyectos conjuntos? Conversemos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Información Directa</h2>
            <div className="grid grid-cols-1 gap-4">
              {contactData.emails.map((email, i) => (
                <a
                  key={i}
                  href={`mailto:${email.address}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-white border hover:border-[#5e026e]/30 rounded-xl group transition-colors"
                >
                  <Mail size={24} className={email.primary ? 'text-[#5e026e]' : 'text-gray-500 group-hover:text-[#5e026e] transition-colors'} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{email.label}</p>
                    <p className="text-sm text-gray-500 group-hover:text-[#5e026e] transition-colors">{email.address}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Redes Profesionales</h2>
            <div className="flex gap-4">
              <a
                href={contactData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white px-5 py-3 rounded-xl transition-colors font-medium flex-1"
              >
                <LinkedinIcon size={20} /> LinkedIn
              </a>
              <a
                href={contactData.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-900 text-gray-700 hover:text-white px-5 py-3 rounded-xl transition-colors font-medium flex-1"
              >
                <GithubIcon size={20} /> GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Envíame un mensaje</h2>

          {formState === 'sent' ? (
            <div className="text-center py-12">
              <div className="text-[#5e026e] text-4xl mb-4">&#10003;</div>
              <p className="text-lg font-medium text-gray-900 mb-2">Mensaje enviado</p>
              <p className="text-gray-500">Te responderé lo antes posible.</p>
              <button
                onClick={() => setFormState('idle')}
                className="mt-6 text-sm text-[#5e026e] hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5e026e] focus:ring-1 focus:ring-[#5e026e] outline-none rounded-xl px-4 py-3 transition-all"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="juan@ejemplo.com"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5e026e] focus:ring-1 focus:ring-[#5e026e] outline-none rounded-xl px-4 py-3 transition-all"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="¿En qué te puedo ayudar?"
                  rows="4"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#5e026e] focus:ring-1 focus:ring-[#5e026e] outline-none rounded-xl px-4 py-3 transition-all resize-none"
                ></textarea>
              </div>

              {formState === 'error' && (
                <p className="text-red-600 text-sm">Hubo un error al enviar. Intenta de nuevo o escríbeme directamente por correo.</p>
              )}

              <button
                type="submit"
                disabled={formState === 'sending'}
                className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-[#5e026e] text-white font-medium px-6 py-3.5 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {formState === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
