/**
 * Contenu source du site — Verger François Legault.
 * Sert de valeurs par défaut et de seed pour la table Supabase `site_content`.
 * Le client pourra modifier ces textes via /admin sans toucher au code.
 */

export const siteInfo = {
  nom: "Verger François Legault",
  ville: "Mont-Saint-Hilaire, Québec",
  adresse: "111 Rang des Étangs, Mont-Saint-Hilaire, QC J3G 4S6",
  telephone: "(450) 467-6492",
  telephoneHref: "+14504676492",
  heures: "Tous les jours, 8 h 00 à 17 h 00 (saison de septembre)",
  saison: "Septembre",
  facebook:
    "https://www.facebook.com/people/Verger-François-Legault/100063475564163/",
  instagram: "https://www.instagram.com/vergerfrancoislegault/",
  noteGoogle: "4,7 / 5",
  nbAvis: "35+",
  mapsUrl: "https://maps.app.goo.gl/7RxuC6ZyPqKC2Sgz7",
} as const;

export const content = {
  hero: {
    eyebrow: "Saison ouverte dès septembre",
    title: "Cueillir la paix.",
    subtitle:
      "« Venez cueillir vos pommes en toute tranquillité à Mont-Saint-Hilaire. Un verger familial où le calme est aussi savoureux que nos Honeycrisp. »",
    ctaPrimary: "Obtenir l'itinéraire",
    ctaSecondary: "Voir le verger",
  },
  varietes: {
    title: "Nos variétés de pommes",
    intro:
      "Plusieurs variétés mûrissent au fil de la saison. Chacune a sa texture et son caractère — venez goûter et trouver votre préférée.",
    items: [
      {
        name: "McIntosh",
        desc: "La classique québécoise : juteuse, tendre, légèrement acidulée.",
      },
      {
        name: "Lobo",
        desc: "Croquante et sucrée, parfaite à croquer telle quelle.",
      },
      {
        name: "Cortland",
        desc: "Chair blanche qui ne brunit pas — idéale pour les salades et tartes.",
      },
      {
        name: "Empire",
        desc: "Ferme et sucrée, elle se conserve longtemps.",
      },
      {
        name: "Honeycrisp",
        desc: "Ultra-croquante, équilibre parfait entre le sucré et l'acidulé.",
      },
    ],
  },
  experience: {
    title: "Une vraie sortie d'automne",
    intro:
      "Au Verger François Legault, on vient autant pour les pommes que pour le moment passé ensemble.",
    piliers: [
      {
        title: "Tranquillité totale",
        desc: "Oubliez la cohue. Chez nous, on cueille à son rythme, dans le silence de la montagne.",
      },
      {
        title: "Honeycrisp savoureuses",
        desc: "Un verger méticuleusement entretenu pour vous offrir les pommes les plus croquantes de la région.",
      },
      {
        title: "Accueil familial",
        desc: "La famille Legault vous accueille comme à la maison. On répond au téléphone, et on connaît nos pommes par leur prénom.",
      },
    ],
  },
  about: {
    title: "Notre verger",
    text: "Le Verger François Legault est un verger familial niché au pied du mont Saint-Hilaire. Chaque automne, nous ouvrons nos rangées de pommiers aux familles, aux couples et aux amoureux de la nature venus vivre l'autocueillette. Ici, pas de précipitation : on vous accueille chaleureusement, on vous laisse parcourir le verger à votre guise, et vous repartez avec vos pommes et de beaux souvenirs.",
  },
  autocueillette: {
    title: "L'autocueillette, comment ça marche",
    intro:
      "Une visite simple et sans tracas. Voici tout ce qu'il faut savoir avant de venir.",
    etapes: [
      {
        title: "Venez nous voir",
        desc: "Présentez-vous au kiosque d'accueil à votre arrivée. On vous indique les rangées prêtes à être cueillies.",
      },
      {
        title: "Cueillez à votre rythme",
        desc: "Parcourez le verger et remplissez votre sac directement sur les arbres. Prenez votre temps.",
      },
      {
        title: "Pesez et repartez",
        desc: "Repassez au kiosque avec votre récolte. C'est tout — il ne reste qu'à profiter de vos pommes.",
      },
    ],
    conseils: [
      "Portez des souliers confortables et des vêtements adaptés à la météo.",
      "Apportez de l'eau et, pourquoi pas, de quoi pique-niquer.",
      "Les chiens en laisse sont les bienvenus dans le verger.",
      "La saison débute en septembre — surveillez nos réseaux sociaux pour les dates d'ouverture.",
    ],
  },
  avis: {
    title: "Ce que disent nos visiteurs",
    items: [
      {
        text: "Très belle place, les gens sont accueillants et les pommes délicieuses.",
        author: "Hong Tong",
        source: "Avis Google",
      },
      {
        text: "Super qualité, cueillir en paix, Honeycrisp savoureuses.",
        author: "Jérôme Couture-Gagnon",
        source: "Avis Google",
      },
      {
        text: "Le verger est super bien entretenu !",
        author: "Elodie Poissant",
        source: "Avis Google",
      },
    ],
  },
  contact: {
    title: "Planifiez votre visite",
    text: "Une question sur la saison, les variétés disponibles ou l'accès au verger ? Écrivez-nous ou appelez-nous, on se fera un plaisir de vous répondre.",
  },
} as const;

/** Galerie par défaut (avant branchement Supabase Storage). */
export const galleryDefault = [
  { src: "/images/cueillette-main-pommes.jpg", caption: "La cueillette, directement sur l'arbre" },
  { src: "/images/fleurs-pommier-1.jpg", caption: "Les pommiers en fleurs au printemps" },
  { src: "/images/tracteur-recolte.jpg", caption: "La récolte au cœur du verger" },
  { src: "/images/chien-sac-pommes.jpg", caption: "Toute la famille est la bienvenue" },
  { src: "/images/fleurs-pommier-2.jpg", caption: "Fleurs de pommier" },
  { src: "/images/pomme-chien.jpg", caption: "Une belle pomme fraîchement cueillie" },
  { src: "/images/kiosque-accueil.jpg", caption: "Notre kiosque d'accueil" },
  { src: "/images/enseigne-verger-2.jpg", caption: "Bienvenue au Verger François Legault" },
];
