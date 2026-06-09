import Image from "next/image";
import Reveal from "@/components/Reveal";
import { getSiteData } from "@/lib/get-site-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { content, siteInfo } = await getSiteData();
  const mapEmbed =
    "https://www.google.com/maps?q=111+Rang+des+%C3%89tangs+Mont-Saint-Hilaire+QC+J3G+4S6&output=embed";

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-content items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-20">
          {/* Colonne texte */}
          <Reveal>
            <span className="label inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
              {content.hero.eyebrow}
            </span>

            <h1 className="mt-6 font-heading text-6xl leading-[0.95] text-secondary sm:text-7xl lg:text-[5.5rem]">
              Cueillir
              <br />
              <span className="accent-italic text-primary">la paix.</span>
            </h1>

            <p className="mt-7 max-w-md accent-italic text-lg leading-relaxed text-text/75">
              {content.hero.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={siteInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label rounded-full bg-primary px-7 py-4 text-white shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                {content.hero.ctaPrimary}
              </a>
              <a
                href={`tel:${siteInfo.telephoneHref}`}
                className="label rounded-full border border-text/20 px-7 py-4 text-text transition-all hover:-translate-y-0.5 hover:border-text/40"
              >
                {siteInfo.telephone}
              </a>
            </div>

            <div className="mt-9 flex items-center gap-3">
              <span className="text-lg tracking-widest text-primary" aria-hidden>
                ★★★★★
              </span>
              <div className="text-sm leading-tight">
                <p className="label text-text">{siteInfo.nbAvis} avis Google</p>
                <p className="text-text/55">{siteInfo.noteGoogle} · accueil familial</p>
              </div>
            </div>
          </Reveal>

          {/* Colonne image + carte flottante */}
          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-text/20">
              <Image
                src="/images/cueillette-main-pommes.jpg"
                alt="Pommes mûres prêtes pour la cueillette au Verger François Legault"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 max-w-[15rem] rounded-2xl bg-surface p-5 shadow-xl shadow-text/15 sm:right-6">
              <p className="label text-text/55">Spécialité</p>
              <p className="mt-1 font-heading text-2xl text-primary">Honeycrisp</p>
              <p className="mt-1 text-sm leading-snug text-text/65">
                La pomme la plus croquante du Québec, disponible dès septembre.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── NOTRE PROMESSE ───────── */}
      <section id="promesse" className="bg-background px-5 pb-16 pt-4 sm:px-8">
        <div className="mx-auto max-w-content rounded-[2.5rem] bg-deep px-6 py-16 text-white sm:px-12 lg:px-16 lg:py-20">
          <Reveal>
            <h2 className="max-w-2xl font-heading text-4xl leading-tight md:text-5xl">
              Pourquoi des familles reviennent ici, année après année.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {content.experience.piliers.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <p className="accent-italic text-2xl text-primary">0{i + 1}.</p>
                <h3 className="mt-4 text-lg font-semibold uppercase tracking-wide text-white" style={{ fontFamily: "var(--font-body)" }}>
                  {p.title}
                </h3>
                <p className="mt-3 text-white/70">{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── AVIS ───────── */}
      <section id="avis" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-heading text-4xl text-text md:text-5xl">
              Ce que les gens disent.
            </h2>
            <p className="label text-text/55">{siteInfo.nbAvis} avis Google</p>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.avis.items.map((a, i) => (
              <Reveal key={a.author} delay={i * 80}>
                <figure className="paper-card flex h-full flex-col p-7">
                  <div className="text-sm tracking-widest text-primary" aria-hidden>
                    ★★★★★
                  </div>
                  <blockquote className="mt-4 flex-1 accent-italic text-lg leading-snug text-text">
                    « {a.text} »
                  </blockquote>
                  <figcaption className="label mt-6 text-text/45">
                    {a.source}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── VISITE ───────── */}
      <section id="visite" className="bg-background pb-20">
        <div className="mx-auto max-w-content px-5 sm:px-8">
          <div className="paper-card grid overflow-hidden md:grid-cols-2">
            {/* Infos */}
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="label text-primary">Planifiez votre visite</p>
              <h2 className="mt-3 font-heading text-4xl text-text">
                On vous garde une branche.
              </h2>

              <dl className="mt-8 space-y-5">
                {[
                  { label: "Adresse", value: siteInfo.adresse },
                  { label: "Heures", value: siteInfo.heures },
                  { label: "Téléphone", value: siteInfo.telephone },
                ].map((row) => (
                  <div key={row.label} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                    <div>
                      <dt className="label text-text/55">{row.label}</dt>
                      <dd className="mt-0.5 text-text">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={siteInfo.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label rounded-full bg-secondary px-7 py-4 text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  Itinéraire
                </a>
                <a
                  href={`tel:${siteInfo.telephoneHref}`}
                  className="label rounded-full border border-text/20 px-7 py-4 text-text transition-all hover:-translate-y-0.5 hover:border-text/40"
                >
                  Appeler
                </a>
              </div>
            </div>

            {/* Carte */}
            <div className="min-h-[320px] bg-tint-4">
              <iframe
                title="Carte — Verger François Legault"
                src={mapEmbed}
                className="h-full min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
