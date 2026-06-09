import type { Metadata } from "next";
import { getSiteData } from "@/lib/get-site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité du Verger François Legault, conforme à la Loi 25 du Québec sur la protection des renseignements personnels.",
  robots: { index: true, follow: false },
};

export default async function PolitiquePage() {
  const { siteInfo } = await getSiteData();
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-3xl px-5">
        <h1 className="font-heading text-4xl font-700 text-foreground">
          Politique de confidentialité
        </h1>
        <p className="mt-3 text-sm text-muted">Dernière mise à jour : septembre 2025</p>

        <div className="mt-8 space-y-8 leading-relaxed text-foreground/90">
          <p>
            Le Verger François Legault accorde une grande importance à la
            protection de vos renseignements personnels. La présente politique
            explique quels renseignements nous recueillons, pourquoi, et comment
            nous les protégeons, conformément à la <strong>Loi 25</strong> du
            Québec.
          </p>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Renseignements que nous recueillons
            </h2>
            <p className="mt-3">
              Lorsque vous utilisez notre formulaire de contact, nous recueillons
              les renseignements que vous nous transmettez volontairement : votre
              nom, votre adresse courriel, votre numéro de téléphone (facultatif)
              et le contenu de votre message.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Utilisation des renseignements
            </h2>
            <p className="mt-3">
              Ces renseignements servent uniquement à répondre à votre demande et
              à communiquer avec vous au sujet de votre visite. Nous ne vendons,
              ne louons et ne partageons jamais vos renseignements avec des tiers
              à des fins commerciales.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Témoins (cookies)
            </h2>
            <p className="mt-3">
              Notre site peut utiliser des témoins afin d'améliorer votre
              expérience de navigation et de mesurer la fréquentation du site.
              Les outils de mesure d'audience ne sont activés qu'après votre
              consentement, que vous pouvez modifier en tout temps via la
              bannière de gestion des témoins.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Conservation et sécurité
            </h2>
            <p className="mt-3">
              Vos renseignements sont conservés uniquement le temps nécessaire au
              traitement de votre demande, puis supprimés. Nous appliquons des
              mesures de sécurité raisonnables pour les protéger contre tout
              accès non autorisé.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Vos droits
            </h2>
            <p className="mt-3">
              Conformément à la Loi 25, vous avez le droit d'accéder à vos
              renseignements personnels, de les faire rectifier ou supprimer.
              Pour exercer ces droits, communiquez avec nous aux coordonnées
              ci-dessous.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-2xl font-700 text-foreground">
              Nous joindre
            </h2>
            <p className="mt-3">
              Verger François Legault<br />
              {siteInfo.adresse}<br />
              Téléphone : {siteInfo.telephone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
