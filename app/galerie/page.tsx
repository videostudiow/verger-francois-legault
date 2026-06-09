import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { galleryDefault } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie photos — Verger en automne",
  alternates: { canonical: "https://vergerfrancoislegault.ca/galerie" },
  description:
    "Le Verger François Legault en images : pommiers en fleurs, autocueillette, récolte d'automne et ambiance familiale à Mont-Saint-Hilaire.",
};

export default function GaleriePage() {
  return (
    <>
      <PageHero
        eyebrow="Galerie"
        title={
          <>
            Le verger,{" "}
            <span className="accent-italic text-accent">
              en images
            </span>
          </>
        }
        subtitle="Un aperçu de l'expérience qui vous attend, du printemps en fleurs à la récolte d'automne."
        image="/images/fleurs-pommier-1.jpg"
        imageAlt="Pommiers en fleurs au printemps"
      />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-content px-5">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>figure]:mb-4">
            {galleryDefault.map((img) => (
              <figure
                key={img.src}
                className="break-inside-avoid overflow-hidden rounded-3xl bg-surface shadow-md"
              >
                <div className="relative">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    width={800}
                    height={1000}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <figcaption className="px-4 py-3 text-xs uppercase tracking-wide text-muted">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
