// Proxy seguro hacia la API de Anthropic.
// La clave vive SOLO aquí, como variable de entorno en Netlify (ANTHROPIC_API_KEY).
// Nunca la pongas dentro de index.html ni en GitHub.

const MODELOS = {
  quick:   process.env.MODEL_QUICK   || "claude-haiku-4-5-20251001",
  default: process.env.MODEL_DEFAULT || "claude-sonnet-5",
  complex: process.env.MODEL_COMPLEX || "claude-sonnet-5",
};
const MAX_TOKENS = { quick: 800, default: 4000, complex: 6000 };
const MAX_INPUT_CHARS = 40000;

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { "content-type": "application/json", "cache-control": "no-store" },
});

export default async (req) => {
  if (req.method !== "POST") return json(405, { code: "invalid_request", message: "Método no permitido" });
  if (!process.env.ANTHROPIC_API_KEY) return json(500, { code: "sampling_disabled", message: "Falta ANTHROPIC_API_KEY en Netlify" });

  // Código de acceso opcional: si defines APP_ACCESS_CODE en Netlify, solo quien lo tenga podrá usar la IA.
  const codigo = process.env.APP_ACCESS_CODE;
  if (codigo && req.headers.get("x-access-code") !== codigo) {
    return json(401, { code: "not_granted", message: "Código de acceso incorrecto" });
  }

  let body;
  try { body = await req.json(); } catch { return json(400, { code: "invalid_request", message: "JSON inválido" }); }

  const tier = MODELOS[body.tier] ? body.tier : "default";
  const messages = Array.isArray(body.messages) ? body.messages
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map(m => ({ role: m.role, content: m.content })) : [];
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json(400, { code: "invalid_request", message: "La conversación debe terminar en un mensaje del usuario" });
  }
  if (messages.reduce((s, m) => s + m.content.length, 0) > MAX_INPUT_CHARS) {
    return json(413, { code: "prompt_too_large", message: "Texto demasiado largo" });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODELOS[tier], max_tokens: MAX_TOKENS[tier], messages }),
    });
    const data = await r.json();
    if (!r.ok) {
      const code = r.status === 429 || r.status === 529 ? "rate_limited" : "upstream_error";
      return json(r.status === 429 ? 429 : 502, { code, message: data?.error?.message || "Error de la IA" });
    }
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    if (!text.trim()) return json(502, { code: "empty_completion", message: "Respuesta vacía" });
    return json(200, { text, truncated: data.stop_reason === "max_tokens" });
  } catch (e) {
    return json(502, { code: "upstream_error", message: "No se pudo contactar a la IA" });
  }
};

export const config = { path: "/api/claude" };
