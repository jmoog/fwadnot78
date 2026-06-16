// ── Identité Adnot Couverture / ent-adnot-couverture.fr ──────────────────────────
export const SITE_URL = "https://ent-adnot-couverture.fr";
export const NOM      = "Adnot Couverture";
export const NOM_ALT  = "Ent Adnot Couverture";
export const FONDATEURS = "Francky et Warren Adnot";

export const TEL       = "07 60 81 73 83";
export const TEL_HREF  = "tel:+33760817383";
export const TEL_MAGNY      = "01 69 01 64 26";
export const TEL_MAGNY_HREF = "tel:+33169016426";

export const EMAIL = "adnot.couvertureidf@gmail.com";

export const ADRESSE_MONTIGNY = "23 Rue Colbert, 78180 Montigny-le-Bretonneux";
export const ADRESSE_MAGNY    = "1 Rue Joseph Lemarchand, 78114 Magny-les-Hameaux";

export const SIRET = "901 688 986 00016";
export const SIREN = "901 688 986";

// Fiches Google des deux établissements
export const MAPS_MONTIGNY = "https://www.google.com/maps?cid=15315510826218199080";
export const MAPS_MAGNY    = "https://www.google.com/maps?cid=11190316067846872588";

// ── Services (5 pages cœur de métier) ────────────────────────────────────
export const SERVICES = [
  { titre: "Réfection de toiture",      slug: "/refection-de-toiture-78/"   },
  { titre: "Réparation & entretien",    slug: "/reparation-de-toiture-78/"  },
  { titre: "Démoussage & nettoyage",    slug: "/demoussage-de-toiture-78/"  },
  { titre: "Gouttières & zinguerie",    slug: "/gouttieres-zinguerie-78/"   },
  { titre: "Velux & fenêtres de toit",  slug: "/velux-fenetre-de-toit-78/"  },
  { titre: "Isolation de toiture",      slug: "/isolation-de-toiture-78/"   },
];

// ── Secteurs (2 établissements, une page chacun) ─────────────────────────
export const SECTEURS = [
  { nom: "Montigny-le-Bretonneux", slug: "/couvreur-montigny-le-bretonneux/", adresse: ADRESSE_MONTIGNY },
  { nom: "Magny-les-Hameaux",      slug: "/couvreur-magny-les-hameaux/",      adresse: ADRESSE_MAGNY },
];

// ── Villes desservies (zone des fiches Google, une page chacune) ─────────
export const VILLES = [
  { nom: "Voisins-le-Bretonneux",  slug: "/couvreur-voisins-le-bretonneux/",  cp: "78960", bureau: "montigny" },
  { nom: "Versailles",             slug: "/couvreur-versailles/",             cp: "78000", bureau: "montigny" },
  { nom: "Châteaufort",            slug: "/couvreur-chateaufort/",            cp: "78117", bureau: "magny" },
  { nom: "Saint-Lambert-des-Bois", slug: "/couvreur-saint-lambert-des-bois/", cp: "78470", bureau: "magny" },
  { nom: "Milon-la-Chapelle",      slug: "/couvreur-milon-la-chapelle/",      cp: "78470", bureau: "magny" },
  { nom: "Saint-Rémy-lès-Chevreuse", slug: "/couvreur-saint-remy-les-chevreuse/", cp: "78470", bureau: "magny" },
  { nom: "Dampierre-en-Yvelines",  slug: "/couvreur-dampierre-en-yvelines/",  cp: "78720", bureau: "magny" },
  { nom: "Cernay-la-Ville",        slug: "/couvreur-cernay-la-ville/",        cp: "78720", bureau: "magny" },
  { nom: "Gif-sur-Yvette",         slug: "/couvreur-gif-sur-yvette/",         cp: "91190", bureau: "magny" },
  { nom: "Saclay",                 slug: "/couvreur-saclay/",                 cp: "91400", bureau: "magny" },
  { nom: "Villiers-le-Bâcle",      slug: "/couvreur-villiers-le-bacle/",      cp: "91190", bureau: "magny" },
  { nom: "Limours",                slug: "/couvreur-limours/",                cp: "91470", bureau: "magny" },
  { nom: "Les Molières",           slug: "/couvreur-les-molieres/",           cp: "91470", bureau: "magny" },
];

// ── Schéma de base (RoofingContractor, 2 établissements) ─────────────────
export const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  "@id": `${SITE_URL}/#organization`,
  "name": NOM,
  "alternateName": NOM_ALT,
  "url": SITE_URL,
  "telephone": "+33760817383",
  "email": EMAIL,
  "image": `${SITE_URL}/logo/logo-adnot-couverture.webp`,
  "logo": `${SITE_URL}/logo/logo-adnot-couverture.webp`,
  "founder": [
    { "@type": "Person", "name": "Francky Adnot", "jobTitle": "Couvreur" },
    { "@type": "Person", "name": "Warren Adnot",  "jobTitle": "Couvreur" },
  ],
  "identifier": { "@type": "PropertyValue", "name": "SIRET", "value": SIRET },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "23 Rue Colbert",
    "addressLocality": "Montigny-le-Bretonneux",
    "postalCode": "78180",
    "addressRegion": "Île-de-France",
    "addressCountry": "FR",
  },
  // Les deux établissements, chacun aligné sur sa fiche Google et sa page locale
  "department": [
    {
      "@type": "RoofingContractor",
      "@id": `${SITE_URL}/couvreur-montigny-le-bretonneux/#etablissement`,
      "name": `${NOM} — Montigny-le-Bretonneux`,
      "alternateName": `${NOM_ALT} — Montigny-le-Bretonneux`,
      "url": `${SITE_URL}/couvreur-montigny-le-bretonneux/`,
      "telephone": "+33760817383",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "23 Rue Colbert",
        "addressLocality": "Montigny-le-Bretonneux",
        "postalCode": "78180",
        "addressRegion": "Île-de-France",
        "addressCountry": "FR",
      },
      "sameAs": [MAPS_MONTIGNY],
    },
    {
      "@type": "RoofingContractor",
      "@id": `${SITE_URL}/couvreur-magny-les-hameaux/#etablissement`,
      "name": `${NOM} — Magny-les-Hameaux`,
      "alternateName": `${NOM_ALT} — Magny-les-Hameaux`,
      "url": `${SITE_URL}/couvreur-magny-les-hameaux/`,
      "telephone": "+33169016426",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1 Rue Joseph Lemarchand",
        "addressLocality": "Magny-les-Hameaux",
        "postalCode": "78114",
        "addressRegion": "Île-de-France",
        "addressCountry": "FR",
      },
      "sameAs": [MAPS_MAGNY],
    },
  ],
  "areaServed": { "@type": "AdministrativeArea", "name": "Yvelines", "alternateName": "Département 78" },
  "priceRange": "€€",
};
