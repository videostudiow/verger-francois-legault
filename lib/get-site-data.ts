import "server-only";
import { createSupabaseServerClient } from "./supabase-server";
import { content as defaultContent, siteInfo as defaultInfo } from "./content";

/**
 * Couche de contenu dynamique.
 * Lit les valeurs éditées dans /admin (tables Supabase site_content,
 * site_info, site_colors) et les fusionne par-dessus les valeurs par défaut
 * de lib/content.ts. Une valeur vide en base retombe sur le défaut.
 *
 * Lecture publique autorisée par les politiques RLS (SELECT USING true).
 */

type Row = { key: string; value: string };

function toMap(rows: Row[] | null): Record<string, string> {
  return Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]));
}

// Garde la valeur de la base seulement si elle est non vide, sinon défaut.
function pick(dbValue: string | undefined, fallback: string): string {
  return dbValue && dbValue.trim() !== "" ? dbValue : fallback;
}

export type SiteColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export async function getSiteData() {
  const supabase = createSupabaseServerClient();

  const [contentRes, infoRes, colorsRes] = await Promise.all([
    supabase.from("site_content").select("key,value"),
    supabase.from("site_info").select("key,value"),
    supabase.from("site_colors").select("key,value"),
  ]);

  const c = toMap(contentRes.data as Row[] | null);
  const i = toMap(infoRes.data as Row[] | null);
  const col = toMap(colorsRes.data as Row[] | null);

  const dp = defaultContent;

  const content = {
    ...dp,
    hero: {
      eyebrow:     pick(c.hero_eyebrow,      dp.hero.eyebrow),
      titleNormal: pick(c.hero_titre_normal,  "Cueillir"),
      titleAccent: pick(c.hero_titre_accent,  "la paix."),
      title:       pick(c.hero_titre,         dp.hero.title),
      subtitle:    pick(c.hero_sous_titre,    dp.hero.subtitle),
      ctaPrimary:  pick(c.hero_cta_primary,   dp.hero.ctaPrimary),
      ctaSecondary:pick(c.hero_cta_secondaire,dp.hero.ctaSecondary),
      honeycrisplabel: pick(c.hero_honeycrisp_label, "Spécialité"),
      honeycrisptitle: pick(c.hero_honeycrisp_titre, "Honeycrisp"),
      honeycrispdesc:  pick(c.hero_honeycrisp_desc,  "La pomme la plus croquante du Québec, disponible dès septembre."),
    },
    experience: {
      ...dp.experience,
      sectionTitle: pick(c.promesse_titre, "Pourquoi des familles reviennent ici, année après année."),
      piliers: [
        {
          title: pick(c.pilier_1_titre, dp.experience.piliers[0].title),
          desc:  pick(c.pilier_1_desc,  dp.experience.piliers[0].desc),
        },
        {
          title: pick(c.pilier_2_titre, dp.experience.piliers[1].title),
          desc:  pick(c.pilier_2_desc,  dp.experience.piliers[1].desc),
        },
        {
          title: pick(c.pilier_3_titre, dp.experience.piliers[2].title),
          desc:  pick(c.pilier_3_desc,  dp.experience.piliers[2].desc),
        },
      ],
    },
    avis: {
      sectionTitle: pick(c.avis_titre, "Ce que les gens disent."),
      items: [
        {
          text:   pick(c.avis_1_texte,  dp.avis.items[0].text),
          author: pick(c.avis_1_auteur, dp.avis.items[0].author),
          source: pick(c.avis_1_source, dp.avis.items[0].source),
        },
        {
          text:   pick(c.avis_2_texte,  dp.avis.items[1].text),
          author: pick(c.avis_2_auteur, dp.avis.items[1].author),
          source: pick(c.avis_2_source, dp.avis.items[1].source),
        },
        {
          text:   pick(c.avis_3_texte,  dp.avis.items[2].text),
          author: pick(c.avis_3_auteur, dp.avis.items[2].author),
          source: pick(c.avis_3_source, dp.avis.items[2].source),
        },
      ],
    },
    visite: {
      label: pick(c.visite_label, "Planifiez votre visite"),
      titre: pick(c.visite_titre, "On vous garde une branche."),
    },
    about: {
      ...dp.about,
      title: pick(c.about_titre, dp.about.title),
      text:  pick(c.about_texte, dp.about.text),
    },
    contact: {
      ...dp.contact,
      title: pick(c.contact_titre, dp.contact.title),
    },
  };

  const telephone = pick(i.telephone, defaultInfo.telephone);
  const siteInfo = {
    ...defaultInfo,
    nom:          pick(i.nom,          defaultInfo.nom),
    adresse:      pick(i.adresse,      defaultInfo.adresse),
    telephone,
    telephoneHref: "+1" + telephone.replace(/\D/g, ""),
    heures:       pick(i.heures,       defaultInfo.heures),
    facebook:     pick(i.facebook,     defaultInfo.facebook),
    instagram:    pick(i.instagram,    defaultInfo.instagram),
    nbAvis:       pick(i.nb_avis,      defaultInfo.nbAvis),
    noteGoogle:   pick(i.note_google,  defaultInfo.noteGoogle),
    mapsUrl:      pick(i.maps_url,     defaultInfo.mapsUrl),
  };

  const colors: SiteColors = {
    primary:    pick(col.primary,    "#c8463b"),
    secondary:  pick(col.secondary,  "#2e5443"),
    accent:     pick(col.accent,     "#e3b94e"),
    background: pick(col.background, "#fbf5ea"),
    text:       pick(col.text,       "#26302a"),
  };

  return { content, siteInfo, colors };
}
