import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  image: string;
  imageAlt: string;
};

/**
 * Héro pleine largeur avec image de fond — look premium cohérent
 * sur toutes les pages intérieures (vert forêt + voile sombre).
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
}: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(30,58,40,0.78)] via-[rgba(30,58,40,0.62)] to-[rgba(30,58,40,0.82)]" />

      <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-content flex-col justify-center px-5 py-20 md:min-h-[48vh]">
        <p className="label text-[rgba(255,255,255,0.75)]">{eyebrow}</p>
        <h1 className="mt-3 max-w-[16ch] font-heading text-5xl leading-[0.98] text-white md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
