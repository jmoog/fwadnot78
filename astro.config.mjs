// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',
  site: 'https://ent-adnot-couverture.fr',
  trailingSlash: 'always',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    sitemap(),
  ],
  // Astro vérifie l'Origin par défaut sur les POST/DELETE/etc. pour prévenir
  // les attaques CSRF. Derrière un reverse proxy (Traefik/Coolify), l'Origin
  // perçu par Astro peut différer du Host réel — d'où des 403.
  // On désactive ce check : la route /api/devis a son propre honeypot +
  // validation, et n'expose pas de données ni de session.
  security: {
    checkOrigin: false,
  },
  vite: {
    cacheDir: 'node_modules/.vite-build',
  },
  // CSS importé par le Layout, inliné dans chaque page (zéro requête bloquante)
  build: {
    inlineStylesheets: 'always',
  },
});
