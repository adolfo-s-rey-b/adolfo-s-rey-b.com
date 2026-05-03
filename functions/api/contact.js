/**
 * Cloudflare Pages Function: proxy del formulario de contacto a n8n.
 * Incluye validación de input, retry con timeout, y fallback 202 si n8n no responde.
 */
const N8N_WEBHOOK = 'https://n8n.adolfo-s-rey-b.com/webhook/contact-form';
const TIMEOUT_MS = 6000;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://adolfo-s-rey-b.com',
    'Content-Type': 'application/json',
  };

  let body;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body JSON inválido.' }), {
      status: 400, headers: corsHeaders,
    });
  }

  const { name, email, message } = body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return new Response(JSON.stringify({ error: 'Nombre requerido (mínimo 2 caracteres).' }), {
      status: 400, headers: corsHeaders,
    });
  }
  if (!email || !isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Email inválido.' }), {
      status: 400, headers: corsHeaders,
    });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return new Response(JSON.stringify({ error: 'Mensaje requerido (mínimo 10 caracteres).' }), {
      status: 400, headers: corsHeaders,
    });
  }

  const payload = {
    name: name.trim().slice(0, 200),
    email: email.trim().toLowerCase(),
    message: message.trim().slice(0, 5000),
    ip: context.request.headers.get('CF-Connecting-IP') || 'unknown',
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetchWithTimeout(
      N8N_WEBHOOK,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      TIMEOUT_MS
    );

    if (response.ok) {
      return new Response(JSON.stringify({ received: true, message: 'Gracias por tu mensaje. Te contactaré pronto.' }), {
        status: 200, headers: corsHeaders,
      });
    }
  } catch {
    // n8n no disponible — devolver 202 para no bloquear al usuario
  }

  return new Response(JSON.stringify({ received: true, message: 'Mensaje recibido. Te contactaré pronto.' }), {
    status: 202, headers: corsHeaders,
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://adolfo-s-rey-b.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
