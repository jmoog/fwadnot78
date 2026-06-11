// ── Avis Google des deux fiches Adnot Couverture (extraits le 11/06/2026) ──
// Fiche Montigny : « Couvreur Yvelines | Waren Adnot » — 5,0 / 5, 64 avis
// Fiche Magny    : « Adnot couverture Yvelines »       — 5,0 / 5, 4 avis
// Orthographe légèrement corrigée pour l'affichage, sens inchangé. `ville` = fiche d'origine de l'avis.

export type VilleAvis = "Montigny-le-Bretonneux" | "Magny-les-Hameaux";

export interface Avis {
  nom: string;
  note: number;                 // sur 5
  date: string;                 // tel qu'affiché par Google
  texte: string;
  ville: VilleAvis;
  accueil?: boolean;            // true = réservé à la page d'accueil (pas affiché sur les pages villes)
}

export const NOTES_GOOGLE: Record<VilleAvis, { note: string; total: number }> = {
  "Montigny-le-Bretonneux": { note: "5,0", total: 64 },
  "Magny-les-Hameaux":      { note: "5,0", total: 4 },
};

export const AVIS: Avis[] = [
  // ── Fiche Magny-les-Hameaux ──
  {
    nom: "Garry Vogel",
    note: 5,
    date: "il y a 4 mois",
    texte:
      "Très satisfait de cette entreprise que nous avons fait intervenir suite aux tempêtes de vents qu'a connu notre région et qui ont endommagé notre toiture. Travail précis et sérieux, je recommande.",
    ville: "Magny-les-Hameaux",
  },
  {
    nom: "Naomy Demestre",
    note: 5,
    date: "il y a 5 mois",
    texte:
      "Nous avons fait appel à M. Adnot suite à des infiltrations sur notre toiture. L'intervention a été très professionnelle, à l'écoute du client, nous recommandons cette entreprise.",
    ville: "Magny-les-Hameaux",
  },
  {
    nom: "Jody Chatelain",
    note: 5,
    date: "il y a 4 mois",
    texte:
      "Nous sommes très ravis de cette entreprise, très professionnelle et surtout très réactive. Je recommande.",
    ville: "Magny-les-Hameaux",
  },
  {
    nom: "Bryton Hug",
    note: 5,
    date: "il y a 4 mois",
    texte: "Entreprise sérieuse, je recommande.",
    ville: "Magny-les-Hameaux",
  },

  // ── Fiche Montigny-le-Bretonneux ──
  {
    nom: "Maxime Gregoire",
    note: 5,
    date: "il y a 2 ans",
    texte:
      "Je suis absolument ravi du service de cette entreprise. Dès le premier contact j'ai vu leur professionnalisme. Contrairement à d'autres entreprises ils ont pris le temps d'inspecter ma toiture avant de proposer un devis…",
    ville: "Montigny-le-Bretonneux",
  },
  {
    nom: "Ashak Paul",
    note: 5,
    date: "il y a 7 mois",
    texte:
      "Très bon travail. En ma qualité de syndic, je le sollicite sur plusieurs immeubles et tout se passe à merveille. Je recommande.",
    ville: "Montigny-le-Bretonneux",
  },
  {
    nom: "Aliya",
    note: 5,
    date: "il y a un an",
    texte:
      "Un travail de qualité avec des experts à l'écoute de nos attentes. Je recommande vivement !",
    ville: "Montigny-le-Bretonneux",
    accueil: true,
  },
  {
    nom: "Sa N",
    note: 5,
    date: "il y a 9 mois",
    texte: "Travail impeccable et soigné. Je recommande vivement !",
    ville: "Montigny-le-Bretonneux",
    accueil: true,
  },
  {
    nom: "Marina Bedrous",
    note: 5,
    date: "il y a 10 mois",
    texte: "Je suis très satisfaite ! Excellent travail et très professionnel.",
    ville: "Montigny-le-Bretonneux",
    accueil: true,
  },
  {
    nom: "Naomy Demestre",
    note: 5,
    date: "il y a 2 ans",
    texte:
      "J'ai fait appel à cette entreprise pour intervenir sur ma toiture. Suite à quelques petits soucis ils ont effectué un diagnostic et ils m'ont proposé le meilleur pour ma toiture, je suis très satisfait, je recommande fortement…",
    ville: "Montigny-le-Bretonneux",
  },
  {
    nom: "Arsene Khalil",
    note: 5,
    date: "il y a 8 mois",
    texte: "Excellents artisans, je recommande vivement !",
    ville: "Montigny-le-Bretonneux",
  },
  {
    nom: "Dayaf 75",
    note: 5,
    date: "il y a 3 mois",
    texte: "Très bon travail, très professionnel.",
    ville: "Montigny-le-Bretonneux",
  },
  {
    nom: "Stéphane Shalaby",
    note: 5,
    date: "il y a 3 mois",
    texte: "Je recommande, très professionnel !",
    ville: "Montigny-le-Bretonneux",
    accueil: true,
  },
];

// Sélection réservée à la page d'accueil
export const AVIS_ACCUEIL = AVIS.filter(a => a.accueil);
