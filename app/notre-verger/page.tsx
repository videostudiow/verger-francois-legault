import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getSiteData } from "@/lib/get-site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notre verger",
  description:
    "Découvrez le Verger François Legault, un verger familial d'autocueillette au pied du mont Saint-Hilaire. Notre histoire, nos pommes, notre approche.",
};

export default async function NotreVergerPage() {
  const { content, siteInfo } = await getSiteData();
  return (
    <>
      <PageHero
        eyebrow="Depuis 1981"
        title={
          <>
            Notre{" "}
            <span className="accent-italic text-accent">
              verger
            </span>
          </>
        }
        subtitle={`Un verger familial à ${siteInfo.ville}, où chaque automne se cueille en toute simplicité.`}
        image="/images/enseigne-verger-1.jpg"
        imageAlt="L'entrée du Verger François Legault"
      />

      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-content items-center gap-12 px-5 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-soft shadow-lg shadow-foreground/10">
            <Image
              src="/images/enseigne-verger-2.jpg"
              alt="L'enseigne en forme de pomme du Verger François Legault à l'entrée"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg leading-relaxed text-foreground/90">
              {content.about.text}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-heading text-3xl font-700 text-primary">
                  {siteInfo.noteGoogle}
                </p>
                <p className="text-sm text-muted">Note Google · {siteInfo.nbAvis} avis</p>
              </div>
              <div>
                <p className="font-heading text-3xl font-700 text-primary">5</p>
                <p className="text-sm text-muted">variétés de pommes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tint-2 py-16">
        <div className="mx-auto max-w-content px-5">
          <p className="label text-secondary">Nos pommes</p>
          <h2 className="mt-3 font-heading text-3xl text-text md:text-4xl">
            {content.varietes.title}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            {content.varietes.intro}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.varietes.items.map((v) => (
              <li key={v.name} className="flex flex-col gap-1 rounded-3xl bg-surface p-6 shadow-sm sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-heading text-2xl text-primary sm:w-40 sm:shrink-0">
                  {v.name}
                </span>
                <span className="text-text/80">{v.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-content px-5 text-center">
          <h2 className="font-heading text-3xl text-text md:text-4xl">
            Prêts à venir cueillir ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
            La saison débute en septembre. Planifiez votre visite ou écrivez-nous
            pour connaître les dates d'ouverture.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link href="/#visite" className="label rounded-full bg-primary px-7 py-4 text-white shadow-md shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-lg">
              Planifier ma visite
            </Link>
            <Link href="/contact" className="label rounded-full bg-surface px-7 py-4 text-text shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
