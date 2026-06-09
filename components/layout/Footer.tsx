import Link from "next/link";

type FooterInfo = {
  nom: string;
  facebook: string;
  instagram: string;
  ville: string;
};

export default function Footer({ siteInfo }: { siteInfo: FooterInfo }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-text/10 bg-background">
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="font-heading text-lg font-semibold text-text">
            {siteInfo.nom}
          </p>

          <nav className="flex items-center gap-6">
            <a
              href={siteInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-text/60 transition-colors hover:text-text"
            >
              Instagram
            </a>
            <a
              href={siteInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="label text-text/60 transition-colors hover:text-text"
            >
              Facebook
            </a>
          </nav>

          <p className="label text-text/45">
            © {year} · {siteInfo.ville}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-text/10 pt-6 text-xs text-text/40 sm:flex-row sm:justify-between">
          <Link
            href="/politique-de-confidentialite"
            className="transition-colors hover:text-text/70"
          >
            Politique de confidentialité
          </Link>
          <span>Site créé par Studio W</span>
        </div>
      </div>
    </footer>
  );
}
