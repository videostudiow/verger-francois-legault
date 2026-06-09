"use client";

import Link from "next/link";
import { useState } from "react";

type HeaderInfo = { nom: string; telephoneHref: string; mapsUrl: string };

const navLinks = [
  { href: "/#promesse", label: "Notre promesse" },
  { href: "/#avis", label: "Avis" },
  { href: "/#visite", label: "Visite" },
];

export default function Header({ siteInfo }: { siteInfo: HeaderInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-5 sm:px-8">
        {/* Logo cliquable → toujours / */}
        <Link
          href="/"
          className="flex items-center gap-3 leading-none"
          aria-label="Retour à l'accueil"
        >
          <span className="h-6 w-6 rounded-full bg-primary" aria-hidden />
          <span className="font-heading text-xl font-semibold text-text">
            {siteInfo.nom}
          </span>
        </Link>

        {/* Nav desktop — centré */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label text-text/65 transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA droite */}
        <a
          href={siteInfo.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="label hidden rounded-full bg-secondary px-6 py-3 text-white transition-all hover:-translate-y-0.5 hover:shadow-md lg:inline-block"
        >
          S'y rendre
        </a>

        {/* Bouton mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-text/15 text-text lg:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "≡"}</span>
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="border-t border-text/10 bg-background px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-heading text-2xl text-text hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={siteInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label block rounded-full bg-secondary px-4 py-3 text-center text-white"
              >
                S'y rendre
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
