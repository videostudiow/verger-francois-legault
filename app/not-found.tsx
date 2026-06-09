import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center bg-background">
      <div className="mx-auto max-w-content px-5 text-center">
        <p className="font-heading text-6xl font-700 text-primary">404</p>
        <h1 className="mt-4 font-heading text-3xl font-700 text-foreground">
          Cette page s'est égarée dans le verger
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-muted">
          La page que vous cherchez n'existe pas ou a été déplacée. Retournons à
          l'accueil pour reprendre la cueillette.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 font-600 text-white transition-transform active:scale-[0.98]"
        >
          Retour à l'accueil
        </Link>
      </div>
    </section>
  );
}
