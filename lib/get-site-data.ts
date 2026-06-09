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

  const content = {
    ...defaultContent,
    hero: {
      ...defaultContent.hero,
      title: pick(c.hero_titre, defaultContent.hero.title),
      subtitle: pick(c.hero_sous_titre, defaultContent.hero.subtitle),
    },
    about: {
      ...defaultContent.about,
      title: pick(c.about_titre, defaultContent.about.title),
      text: pick(c.about_texte, defaultContent.about.text),
    },
    contact: {
      ...defaultContent.contact,
      title: pick(c.contact_titre, defaultContent.contact.title),
    },
  };

  const telephone = pick(i.telephone, defaultInfo.telephone);
  const siteInfo = {
    ...defaultInfo,
    nom: pick(i.nom, defaultInfo.nom),
    adresse: pick(i.adresse, defaultInfo.adresse),
    telephone,
    telephoneHref: "+1" + telephone.replace(/\D/g, ""),
    heures: pick(i.heures, defaultInfo.heures),
    facebook: pick(i.facebook, defaultInfo.facebook),
    instagram: pick(i.instagram, defaultInfo.instagram),
  };

  const colors: SiteColors = {
    primary: pick(col.primary, "#c8463b"),
    secondary: pick(col.secondary, "#2e5443"),
    accent: pick(col.accent, "#e3b94e"),
    background: pick(col.background, "#fbf5ea"),
    text: pick(col.text, "#26302a"),
  };

  return { content, siteInfo, colors };
}
