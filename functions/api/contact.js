/**
 * Cloudflare Pages Function: entrega del formulario de contacto.
 *
 * Dos vías, en orden: n8n (self-hosted) y, si no responde, Resend. Si fallan
 * las dos se devuelve 502 y el visitante ve el correo de Uniandes para escribir
 * directo.
 *
 * NUNCA responder "recibido" sin haber entregado: antes había un fallback 202
 * que decía "Mensaje recibido, te contactaré pronto" aunque n8n estuviera
 * caído. El mensaje se perdía y nadie se enteraba — ni el visitante, que se
 * quedaba esperando una respuesta que no iba a llegar, ni Adolfo. El §7.7 del
 * spec es explícito: un formulario roto es peor que ningún formulario.
 */
const N8N_WEBHOOK = 'https://n8n.adolfo-s-rey-b.com/webhook/contact-form';
const TIMEOUT_MS = 6000;

// n8n corre en el servidor de Adolfo, así que si se cae, cae con él. La segunda
// vía tiene que ser externa para servir de algo.
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const MAIL_TO = 'as.rey@uniandes.edu.co';
const MAIL_FROM = 'Formulario del sitio <formulario@adolfo-s-rey-b.com>';

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

// Segunda vía. Devuelve true solo si Resend aceptó el correo: un fallo aquí
// tiene que propagarse hasta el 502, no quedarse en silencio.
async function sendViaResend(apiKey, payload) {
  if (!apiKey) return false;

  const body = {
    from: MAIL_FROM,
    to: [MAIL_TO],
    // Así "Responder" en el cliente de correo escribe al visitante y no al
    // remitente técnico.
    reply_to: payload.email,
    subject: `Sitio web — mensaje de ${payload.name}`,
    text: [
      `Nombre:  ${payload.name}`,
      `Correo:  ${payload.email}`,
      `Fecha:   ${payload.timestamp}`,
      `IP:      ${payload.ip}`,
      '',
      payload.message,
      '',
      '— Entregado por Resend porque n8n no respondió.',
    ].join('\n'),
  };

  try {
    const res = await fetchWithTimeout(
      RESEND_ENDPOINT,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      TIMEOUT_MS
    );
    return res.ok;
  } catch {
    return false;
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

  // Vía 1: n8n.
  let delivered = false;
  try {
    const response = await fetchWithTimeout(
      N8N_WEBHOOK,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
      TIMEOUT_MS
    );
    delivered = response.ok;
  } catch {
    // n8n caído o fuera de tiempo — se intenta la segunda vía.
  }

  // Vía 2: Resend. Sin RESEND_API_KEY definida se salta sin romper nada.
  if (!delivered) {
    delivered = await sendViaResend(context.env.RESEND_API_KEY, payload);
  }

  if (delivered) {
    return new Response(
      JSON.stringify({ received: true, message: 'Gracias por tu mensaje. Te contactaré pronto.' }),
      { status: 200, headers: corsHeaders }
    );
  }

  // Ninguna vía entregó. Se dice, y se da el correo directo como salida.
  return new Response(
    JSON.stringify({ received: false, error: 'No se pudo entregar el mensaje.', email: MAIL_TO }),
    { status: 502, headers: corsHeaders }
  );
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
