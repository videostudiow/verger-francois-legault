import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { getSiteData } from "@/lib/get-site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Verger François Legault à Mont-Saint-Hilaire pour planifier votre visite d'autocueillette. Téléphone, adresse et formulaire.",
};

export default async function ContactPage() {
  const { content, siteInfo } = await getSiteData();
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Planifiez votre{" "}
            <span className="accent-italic text-accent">
              visite
            </span>
          </>
        }
        subtitle={content.contact.text}
        image="/images/kiosque-accueil.jpg"
        imageAlt="Le kiosque d'accueil du verger"
      />

      <section className="bg-background py-16">
        <div className="mx-auto grid max-w-content gap-12 px-5 lg:grid-cols-2">
          <div>
            <dl className="divide-y divide-text/10 rounded-3xl bg-surface px-6 shadow-sm text-text">
              <div className="flex items-baseline justify-between gap-4 py-5">
                <dt className="label text-secondary">Adresse</dt>
                <dd className="text-right">
                  <a href={siteInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {siteInfo.adresse}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-5">
                <dt className="label text-secondary">Téléphone</dt>
                <dd className="text-right">
                  <a href={`tel:${siteInfo.telephoneHref}`} className="hover:text-primary">
                    {siteInfo.telephone}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-5">
                <dt className="label text-secondary">Heures</dt>
                <dd className="text-right">{siteInfo.heures}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-5">
                <dt className="label text-secondary">Suivez-nous</dt>
                <dd className="flex gap-4 text-right">
                  <a href={siteInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook</a>
                  <a href={siteInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a>
                </dd>
              </div>
            </dl>

            <div className="mt-8 overflow-hidden rounded-3xl shadow-md">
              <iframe
                title="Carte — Verger François Legault"
                src="https://www.google.com/maps?q=111+Rang+des+%C3%89tangs+Mont-Saint-Hilaire+QC+J3G+4S6&output=embed"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="paper-card p-7 sm:p-9">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
