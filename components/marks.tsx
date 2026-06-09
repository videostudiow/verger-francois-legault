/**
 * Petits motifs dessinés au trait — remplacent les emojis.
 * Style « gravure / étiquette de terroir ».
 */

export function AppleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 7c-1.2-1.6-3-2.2-4.6-1.7C5.4 5.9 4.4 8 4.7 10.4c.3 2.4 1.7 5.4 3.4 6.8 1 .8 2 .7 3 .2.6-.3 1.2-.3 1.8 0 1 .5 2 .6 3-.2 1.7-1.4 3.1-4.4 3.4-6.8.3-2.4-.7-4.5-2.7-5.1C14 4.8 12.2 5.4 12 7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 7c0-1.4.5-2.8 1.6-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.6 4.2c1-.9 2.4-1.1 3.4-.6-.2 1.2-1 2.3-2.1 2.7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 19c0-7 5-13 14-14-1 9-7 14-14 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 16C11 13 14 10 17 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Tampon circulaire avec texte sur cercle (logo de fraîcheur). */
export function Stamp({
  className = "",
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} ${spin ? "spin-slow" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <path
          id="stamp-circle"
          d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
        />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
      <text fontFamily="var(--font-mono), monospace" fontSize="9.5" letterSpacing="3" fill="currentColor">
        <textPath href="#stamp-circle" startOffset="0">
          DEPUIS 1981 · MONT-SAINT-HILAIRE · QUÉBEC ·
        </textPath>
      </text>
      <g transform="translate(60 60)">
        <AppleMarkInline />
      </g>
    </svg>
  );
}

function AppleMarkInline() {
  return (
    <g transform="translate(-13 -14) scale(1.1)">
      <path
        d="M12 7c-1.2-1.6-3-2.2-4.6-1.7C5.4 5.9 4.4 8 4.7 10.4c.3 2.4 1.7 5.4 3.4 6.8 1 .8 2 .7 3 .2.6-.3 1.2-.3 1.8 0 1 .5 2 .6 3-.2 1.7-1.4 3.1-4.4 3.4-6.8.3-2.4-.7-4.5-2.7-5.1C14 4.8 12.2 5.4 12 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 7c0-1.4.5-2.8 1.6-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </g>
  );
}
