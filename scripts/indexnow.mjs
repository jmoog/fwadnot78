// scripts/indexnow.mjs
// Ping IndexNow (Bing + Yandex) avec toutes les URLs du sitemap après chaque build.
// Lance automatiquement via "postbuild" dans package.json.
//
// IndexNow notifie les moteurs supportant le protocole quand des pages changent,
// pour un crawl quasi-instantané (≈ 1 minute) au lieu d'attendre le passage spontané.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const KEY          = 'a3ca2fcf954c394caea37ed953106877';
const HOST         = 'fwa-toitures.fr';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
// Astro 6 + adapter node : les fichiers statiques (sitemap inclus) sont dans dist/client/
// Fallback sur dist/ si la structure est différente (ancien build statique).
const DIST_DIR     = existsSync(join('dist', 'client')) ? join('dist', 'client') : 'dist';
const ENDPOINT     = 'https://api.indexnow.org/indexnow';

function extractUrls(xml) {
  const m = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
  return m.map(s => s.replace(/<\/?loc>/g, '').trim());
}

function readDist(file) {
  const p = join(DIST_DIR, file);
  return existsSync(p) ? readFileSync(p, 'utf-8') : null;
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.warn('[IndexNow] dist/ introuvable — build pas encore fait, abandon.');
    return;
  }

  // 1. Sitemap index → trouver les sitemaps individuels
  const indexXml = readDist('sitemap-index.xml');
  if (!indexXml) {
    console.warn('[IndexNow] sitemap-index.xml introuvable dans dist/, abandon.');
    return;
  }

  const sitemapNames = extractUrls(indexXml).map(u => u.split('/').pop());

  // 2. Récupérer toutes les URLs des sitemaps individuels (locaux)
  const all = new Set();
  for (const name of sitemapNames) {
    const xml = readDist(name);
    if (!xml) continue;
    extractUrls(xml).forEach(u => all.add(u));
  }

  // Fallback : si pas de sitemap-X.xml détecté, lister tous les sitemap-*.xml du dist
  if (all.size === 0) {
    const files = readdirSync(DIST_DIR).filter(f => /^sitemap-\d+\.xml$/.test(f));
    for (const f of files) {
      const xml = readDist(f);
      if (xml) extractUrls(xml).forEach(u => all.add(u));
    }
  }

  const urls = [...all].filter(u => u.startsWith(`https://${HOST}`));

  if (urls.length === 0) {
    console.warn('[IndexNow] Aucune URL extraite du sitemap, abandon.');
    return;
  }

  console.log(`[IndexNow] ${urls.length} URL(s) à signaler à Bing & Yandex…`);

  // 3. POST en JSON (max 10 000 URLs par requête, on est très loin)
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };

  try {
    const res = await fetch(ENDPOINT, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body   : JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] ✓ Succès — HTTP ${res.status} — ${urls.length} URLs en file de crawl.`);
    } else {
      const txt = await res.text().catch(() => '');
      console.warn(`[IndexNow] ⚠ HTTP ${res.status} — ${txt.slice(0, 200)}`);
    }
  } catch (err) {
    console.error('[IndexNow] ✗ Erreur réseau :', err?.message ?? err);
  }
}

main();
