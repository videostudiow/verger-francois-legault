const words = [
  "McIntosh",
  "Lobo",
  "Cortland",
  "Empire",
  "Honeycrisp",
  "Autocueillette",
  "Mont-Saint-Hilaire",
];

export default function Marquee() {
  const items = [...words, ...words];
  return (
    <div className="flex select-none overflow-hidden bg-secondary py-3.5 text-white">
      <div className="marquee-track flex shrink-0 items-center pr-6">
        {items.map((w, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="font-heading text-lg">{w}</span>
            <span className="mx-6 text-accent" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
