import type { APIRoute } from 'astro';

// Cette route doit s'exécuter à la demande (pas de prérendu).
export const prerender = false;

// ────────────────────────────────────────────────────────────────────────
// Variables d'environnement (à configurer dans Coolify) :
//   BREVO_API_KEY      → Clé API Brevo (commence par xkeysib-...)
//   ADMIN_EMAILS       → adnot.couvertureidf@gmail.com,jmoog27@gmail.com
//   FROM_EMAIL         → contact@fwatoitures.fr (domaine vérifié sur Brevo)
//   FROM_NAME          → Adnot Couverture (optionnel, défaut "Adnot Couverture")
// ────────────────────────────────────────────────────────────────────────

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const PRESTATION_LABELS: Record<string, string> = {
  refection: 'Réfection de toiture',
  reparation: 'Réparation / entretien de toiture',
  demoussage: 'Démoussage & nettoyage',
  gouttieres: 'Gouttières & zinguerie',
  velux: 'Velux & fenêtres de toit',
  isolation: 'Isolation de toiture',
  autre: 'Autre / à préciser',
};

// Charte Adnot Couverture
const COLOR_BLUE = '#185E97';
const COLOR_RED = '#E11D2C';
const COLOR_LIGHT = '#F5F7FA';
const COLOR_TEXT = '#1F2937';
const COLOR_MUTED = '#6B7280';
const COLOR_BORDER = '#E5E7EB';

// ────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────

function escapeHtml(s: unknown): string {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(s: unknown): string {
  return escapeHtml(s).replace(/\r?\n/g, '<br>');
}

// Anti-spam : détection de contenu indésirable (liens, démarchage avis/SEO, etc.).
const SPAM_PATTERNS =
  /(https?:\/\/|www\.|wa\.me|t\.me|bit\.ly|tinyurl|telegra|\b(whatsapp|telegram|viber|crypto|bitcoin|casino|loan|viagra|escort)\b|avis google|google my business|google reviews|trustpilot|tripadvisor|pagesjaunes|backlink|référencement|seo (services|expert|agency|company)|ranking)/i;
function isSpam(...fields: Array<string | undefined>): boolean {
  return SPAM_PATTERNS.test(fields.filter(Boolean).join(' \n '));
}

// Vérification du jeton Cloudflare Turnstile (si la clé secrète est configurée).
async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.append('secret', secret);
  body.append('response', token || '');
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return data?.success === true;
  } catch {
    return false;
  }
}

interface DevisData {
  nom: string;
  tel: string;
  email: string;
  ville: string;
  prestation: string;
  message?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Brevo API client (fetch direct, pas de SDK)
// ────────────────────────────────────────────────────────────────────────

interface BrevoSendArgs {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  to: Array<{ email: string; name?: string }>;
  replyTo?: { email: string; name?: string };
  subject: string;
  htmlContent: string;
}

async function brevoSend(args: BrevoSendArgs): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const body: Record<string, unknown> = {
    sender: { email: args.fromEmail, name: args.fromName },
    to: args.to,
    subject: args.subject,
    htmlContent: args.htmlContent,
  };
  if (args.replyTo) body.replyTo = args.replyTo;

  try {
    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': args.apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.message) detail = String(err.message);
        else if (err?.code) detail = String(err.code);
      } catch {}
      return { ok: false, error: detail };
    }

    const json = await res.json().catch(() => ({} as any));
    return { ok: true, messageId: json?.messageId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    return { ok: false, error: msg };
  }
}

// ────────────────────────────────────────────────────────────────────────
// Template — Notification admins
// ────────────────────────────────────────────────────────────────────────

function notifTemplate(d: DevisData) {
  const presta = PRESTATION_LABELS[d.prestation] || d.prestation || 'Non précisé';
  const telClean = (d.tel || '').replace(/[^0-9+]/g, '');
  const subject = `Nouvelle demande — ${presta} à ${d.ville}`;
  const prenom = (d.nom || '').split(' ')[0] || 'le client';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR_LIGHT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${COLOR_TEXT};">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${COLOR_LIGHT};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="background:${COLOR_BLUE};padding:24px 32px;color:#fff;">
          <div style="font-size:12px;text-transform:uppercase;letter-spacing:.1em;opacity:.7;font-weight:700;">Nouvelle demande de devis</div>
          <div style="font-size:22px;font-weight:800;margin-top:6px;">${escapeHtml(presta)}</div>
          <div style="font-size:14px;opacity:.85;margin-top:4px;">à ${escapeHtml(d.ville)}</div>
        </td></tr>

        <!-- Identité client -->
        <tr><td style="padding:24px 32px 8px;">
          <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${COLOR_MUTED};font-weight:700;margin-bottom:8px;">Client</div>
          <div style="font-size:18px;font-weight:700;color:${COLOR_BLUE};">${escapeHtml(d.nom)}</div>
        </td></tr>

        <!-- Contact -->
        <tr><td style="padding:8px 32px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td width="50%" valign="top" style="padding:12px 12px 12px 0;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${COLOR_MUTED};font-weight:700;">Téléphone</div>
                <a href="tel:${escapeHtml(telClean)}" style="display:inline-block;margin-top:4px;color:${COLOR_BLUE};font-size:16px;font-weight:700;text-decoration:none;">${escapeHtml(d.tel)}</a>
              </td>
              <td width="50%" valign="top" style="padding:12px 0 12px 12px;border-left:1px solid ${COLOR_BORDER};">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${COLOR_MUTED};font-weight:700;">Email</div>
                <a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;margin-top:4px;color:${COLOR_BLUE};font-size:14px;font-weight:600;text-decoration:none;word-break:break-all;">${escapeHtml(d.email)}</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:8px 32px 24px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="padding:8px;" width="50%">
                <a href="tel:${escapeHtml(telClean)}" style="display:block;background:${COLOR_RED};color:#fff;text-decoration:none;padding:14px 16px;border-radius:8px;font-weight:700;font-size:14px;">Appeler ${escapeHtml(prenom)}</a>
              </td>
              <td align="center" style="padding:8px;" width="50%">
                <a href="mailto:${escapeHtml(d.email)}?subject=${encodeURIComponent('Re: votre demande de devis Adnot Couverture')}" style="display:block;background:${COLOR_BLUE};color:#fff;text-decoration:none;padding:14px 16px;border-radius:8px;font-weight:700;font-size:14px;">Répondre par email</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Détails -->
        <tr><td style="padding:0 32px 24px;">
          <div style="background:${COLOR_LIGHT};border-radius:8px;padding:18px 20px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${COLOR_MUTED};font-weight:700;margin-bottom:10px;">Description du projet</div>
            <div style="font-size:14px;line-height:1.65;color:${COLOR_TEXT};">
              ${d.message ? nl2br(d.message) : '<em style="color:' + COLOR_MUTED + ';">Aucune description fournie.</em>'}
            </div>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:${COLOR_LIGHT};padding:16px 32px;border-top:1px solid ${COLOR_BORDER};font-size:12px;color:${COLOR_MUTED};text-align:center;">
          Demande reçue le ${new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Paris' })}<br>
          via <a href="https://fwatoitures.fr/devis-gratuit/" style="color:${COLOR_BLUE};text-decoration:none;">fwatoitures.fr/devis-gratuit/</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

// ────────────────────────────────────────────────────────────────────────
// Template — Accusé de réception client
// ────────────────────────────────────────────────────────────────────────

function ackTemplate(d: DevisData) {
  const presta = PRESTATION_LABELS[d.prestation] || d.prestation || 'votre projet';
  const subject = `Nous avons bien reçu votre demande — Adnot Couverture`;
  const prenom = (d.nom || '').split(' ')[0];

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR_LIGHT};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${COLOR_TEXT};">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${COLOR_LIGHT};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="background:${COLOR_BLUE};padding:32px 32px 28px;color:#fff;text-align:center;">
          <img src="https://fwatoitures.fr/logo/logo-adnot-couverture.webp" width="64" height="64" alt="Adnot Couverture" style="display:block;margin:0 auto 12px;border-radius:50%;background:#fff;padding:6px;">
          <div style="font-size:20px;font-weight:800;">Adnot Couverture</div>
          <div style="font-size:13px;opacity:.85;margin-top:2px;">Couvreurs dans les Yvelines (78)</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 32px 12px;">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:${COLOR_BLUE};line-height:1.3;">Bonjour ${escapeHtml(prenom)},</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${COLOR_TEXT};">
            Nous avons bien reçu votre demande de devis pour <strong>${escapeHtml(presta.toLowerCase())}</strong> à <strong>${escapeHtml(d.ville)}</strong>. Merci de votre confiance.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:${COLOR_TEXT};">
            Francky ou Warren vous rappelle pour échanger sur vos travaux, planifier une visite si nécessaire, et vous remettre un devis détaillé poste par poste — déplacement offert, sans engagement.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:${COLOR_TEXT};">
            En cas d'urgence, vous pouvez nous appeler directement.
          </p>
        </td></tr>

        <!-- CTA Phone -->
        <tr><td style="padding:0 32px 24px;" align="center">
          <a href="tel:+33760817383" style="display:inline-block;background:${COLOR_RED};color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">Appeler le 07 60 81 73 83</a>
        </td></tr>

        <!-- Récap -->
        <tr><td style="padding:0 32px 28px;">
          <div style="background:${COLOR_LIGHT};border-radius:8px;padding:18px 20px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:${COLOR_MUTED};font-weight:700;margin-bottom:12px;">Récapitulatif de votre demande</div>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size:14px;">
              <tr>
                <td style="padding:4px 0;color:${COLOR_MUTED};width:120px;">Prestation</td>
                <td style="padding:4px 0;color:${COLOR_TEXT};font-weight:600;">${escapeHtml(presta)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:${COLOR_MUTED};">Commune</td>
                <td style="padding:4px 0;color:${COLOR_TEXT};font-weight:600;">${escapeHtml(d.ville)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:${COLOR_MUTED};">Téléphone</td>
                <td style="padding:4px 0;color:${COLOR_TEXT};font-weight:600;">${escapeHtml(d.tel)}</td>
              </tr>
            </table>
          </div>
        </td></tr>

        <!-- Signature -->
        <tr><td style="padding:0 32px 28px;">
          <p style="margin:0;font-size:15px;line-height:1.5;color:${COLOR_TEXT};">
            À très vite,<br>
            <strong style="color:${COLOR_BLUE};">Francky et Warren Adnot</strong><br>
            <span style="color:${COLOR_MUTED};font-size:13px;">Couvreurs — Adnot Couverture</span>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:${COLOR_BLUE};padding:20px 32px;color:#fff;text-align:center;font-size:12px;line-height:1.6;">
          <strong style="font-size:14px;">Adnot Couverture</strong><br>
          23 Rue Colbert, 78180 Montigny-le-Bretonneux<br>
          <a href="https://fwatoitures.fr" style="color:#fff;text-decoration:underline;opacity:.85;">fwatoitures.fr</a> &nbsp;·&nbsp; <a href="tel:+33760817383" style="color:#fff;text-decoration:underline;opacity:.85;">07 60 81 73 83</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

// ────────────────────────────────────────────────────────────────────────
// Handler
// ────────────────────────────────────────────────────────────────────────

const jsonResponse = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[devis] BREVO_API_KEY missing');
    return jsonResponse(500, { ok: false, error: 'Configuration serveur incomplète.' });
  }

  // Parse JSON
  let raw: any;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: 'Invalid JSON' });
  }

  // Anti-spam : champ honeypot vide attendu
  if (raw?.website && String(raw.website).trim() !== '') {
    return jsonResponse(200, { ok: true });
  }

  // Filtre anti-spam : contenu indésirable → succès silencieux, aucun email envoyé.
  if (isSpam(raw?.nom, raw?.tel, raw?.email, raw?.ville, raw?.prestation, raw?.message)) {
    console.warn('[devis] Spam filtré (contenu)');
    return jsonResponse(200, { ok: true });
  }

  // Validation des champs obligatoires
  const required = ['nom', 'tel', 'email', 'ville', 'prestation'] as const;
  for (const f of required) {
    if (!raw?.[f] || String(raw[f]).trim() === '') {
      return jsonResponse(400, { ok: false, error: `Champ manquant : ${f}` });
    }
  }

  // Vérification anti-robot Cloudflare Turnstile (active dès que la clé secrète est définie).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = String(raw?.['cf-turnstile-response'] || '');
    const ip =
      request.headers.get('cf-connecting-ip') ||
      (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      undefined;
    const human = await verifyTurnstile(token, turnstileSecret, ip);
    if (!human) {
      return jsonResponse(400, { ok: false, error: 'Vérification anti-robot échouée. Merci de réessayer.' });
    }
  }

  // Sanitize
  const data: DevisData = {
    nom: String(raw.nom).trim().slice(0, 100),
    tel: String(raw.tel).trim().slice(0, 30),
    email: String(raw.email).trim().slice(0, 200),
    ville: String(raw.ville).trim().slice(0, 100),
    prestation: String(raw.prestation).trim().slice(0, 50),
    message: String(raw.message || '').trim().slice(0, 4000),
  };

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (adminEmails.length === 0) {
    console.error('[devis] ADMIN_EMAILS missing');
    return jsonResponse(500, { ok: false, error: 'Configuration serveur incomplète.' });
  }

  const fromEmail = process.env.FROM_EMAIL || 'contact@fwatoitures.fr';
  const fromName = process.env.FROM_NAME || 'Adnot Couverture';

  // 1) Notification admins
  const notif = notifTemplate(data);
  const r1 = await brevoSend({
    apiKey,
    fromEmail,
    fromName,
    to: adminEmails.map((email) => ({ email })),
    replyTo: { email: data.email, name: data.nom },
    subject: notif.subject,
    htmlContent: notif.html,
  });

  if (!r1.ok) {
    console.error('[devis] Erreur envoi notif admin:', r1.error);
    return jsonResponse(502, {
      ok: false,
      error: 'Envoi impossible pour le moment, merci de nous appeler au 07 60 81 73 83.',
    });
  }

  // 2) Accusé client (best effort — ne bloque pas si échec)
  const ack = ackTemplate(data);
  const r2 = await brevoSend({
    apiKey,
    fromEmail,
    fromName: 'Adnot Couverture',
    to: [{ email: data.email, name: data.nom }],
    replyTo: { email: fromEmail, name: fromName },
    subject: ack.subject,
    htmlContent: ack.html,
  });
  if (!r2.ok) {
    console.error('[devis] Echec accusé client (non bloquant):', r2.error);
  }

  return jsonResponse(200, { ok: true });
};

// Bloque les autres méthodes proprement.
export const GET: APIRoute = () =>
  new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } });
