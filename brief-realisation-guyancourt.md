# Brief — Page réalisation « Réfection de toiture à Guyancourt »

## 1. Décision stratégique

**Type de page : réalisation (chantier), pas page service+ville.**
Guyancourt n'a aujourd'hui aucune page service dédiée (la ville n'est citée qu'en zone couverte par le bureau de Montigny). Une réalisation ne crée donc **aucune cannibalisation** et enrichit le cocon `/realisations/` déjà en place (1 cas existant : Saint-Rémy). Elle apporte du contenu 100 % original (photos + vidéo d'un vrai chantier) = preuve E-E-A-T + ancrage local sur Saint-Quentin-en-Yvelines. Conforme aux règles éditoriales (faits validés uniquement, voix « nous »).

Si Guyancourt mérite plus tard sa propre page « couvreur Guyancourt », cette réalisation lui enverra du jus interne.

## 2. Identité technique

| Élément | Valeur |
|---|---|
| URL (canonical) | `/realisations/refection-toiture-guyancourt/` |
| Modèle | calqué sur `traitement-ardoise-saint-remy-les-chevreuse/index.astro` |
| Bureau de rattachement | **Montigny-le-Bretonneux** (couvre Guyancourt / SQY) |
| NAP à utiliser | `ADRESSE_MONTIGNY` + `MAPS_MONTIGNY` + téléphone à confirmer (pas de `TEL_MONTIGNY` dédié dans `data/site` — soit le tel général `07 60 81 73 83`, soit en créer un) |
| Schema | `Article`, `locationCreated` = Guyancourt (78280), `datePublished` = date réelle du chantier |
| Code postal | 78280 |

> **À confirmer avant build** : numéro de téléphone affiché pour le bureau Montigny (le modèle Saint-Rémy utilise `TEL_MAGNY`).

## 3. Balises SEO (à valider)

- **title** : `Réfection complète de toiture à Guyancourt (78280) — Adnot Couverture` (≈ 60 car.)
- **meta description** : `Dépose et repose totale d'une couverture à Guyancourt par Adnot Couverture : retour en photos et vidéo sur une réfection de toiture menée dans les Yvelines.`
- **H1** : `Réfection complète d'une toiture à Guyancourt`

Cible longue traîne : « réfection toiture Guyancourt », « rénovation toiture Guyancourt », « avant après toiture 78280 ». Pas de couple service+ville agressif répété (anti-suroptimisation).

## 4. Structure de la page (sections)

1. **En-tête** : eyebrow « Réalisation — Adnot Couverture », H1, fil d'Ariane (Accueil › Réalisations › Réfection toiture Guyancourt), lede 2–3 lignes, puces meta (Guyancourt 78280 · Réfection complète · type de couverture · garantie décennale), **photo héro** (1600×1200).
2. **Le contexte** : état de la toiture avant intervention (à remplir avec les faits réels du chantier) + 1 photo secondaire en `media-row`.
3. **La réfection complète** : dépose de l'ancienne couverture, ce qui a été remplacé (liteaux, écran sous-toiture, tuiles/ardoises, faîtage…), choix matériaux. Lien interne vers `/refection-de-toiture-78/`.
4. **La vidéo du chantier** : bloc vidéo intégré (point différenciant fort — voir section 5).
5. **Finitions / zinguerie / résultat** : photos avant-après, points de contrôle étanchéité.
6. **Bloc géo de clôture** : « Nous rénovons les toitures à Guyancourt et dans tout SQY », liens vers `/couvreur-montigny-le-bretonneux/`, `/couvreur-voisins-le-bretonneux/`, `/refection-de-toiture-78/`. CTA devis.
7. **Sidebar** : carte devis (NAP Montigny), bloc « À voir aussi » (réfection 78, couvreur Montigny, réalisations).
8. **CTA final** : « Une toiture à refaire à Guyancourt ? »

## 5. Médias — points d'attention

- **Photos** : à déposer dans `/public/images/`, nommage SEO type `refection-toiture-guyancourt-yvelines-001.webp` + version `-800.webp` (srcset, comme l'existant). Format `.webp`, alt descriptifs avec « Guyancourt ».
- **Vidéo** : c'est LE différenciateur. Recommandation : héberger sur YouTube (chaîne Adnot) + intégration `<iframe>` lazy, ou vidéo locale `.mp4`/`.webm` légère. À trancher selon le poids et la perf. Ajoute un `VideoObject` au schema pour le SEO.

## 6. Maillage interne à mettre à jour

- Ajouter la carte dans le tableau `REALISATIONS` de `/realisations/index.astro` (titre, slug, desc, img, alt).
- Ajouter un lien vers cette réalisation depuis `/refection-de-toiture-78/` et depuis `/couvreur-montigny-le-bretonneux/` (preuve locale).
- Pense à l'ajouter au `plan-du-site`.

## 7. Contenu à fournir par toi pour la rédaction

1. Photos + vidéo (fichiers).
2. Date réelle du chantier.
3. Type de couverture (tuiles béton / terre cuite / ardoise ?) avant et après.
4. 2–3 détails factuels du chantier (surface approximative, durée, particularité technique, écran sous-toiture posé, etc.) — pour rester sur des faits validés.
5. Numéro de téléphone à afficher pour le bureau Montigny.
