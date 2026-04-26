/**
 * Cloudflare Pages Function: proxy del formulario de contacto a n8n.
 * Maneja POST /api/contact → n8n webhook en el servidor Dell.
 */
export async function onRequestPost(context) {
  const N8N_WEBHOOK = 'https://n8n.adolfo-s-rey-b.com/webhook/contact-form';

  try {
    const body = await context.request.json();

    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error interno al enviar el mensaje.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
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
