import Image from "next/image";

// The ONE place the logo files are wired in. To change a logo later, replace
// the PNG in public/images/ (keep the filename) — nothing here needs editing
// unless the new file has a different shape, in which case update the ratio.
//
//   logo-mark.png            the "M + bars" icon on its own
//   logo-full.png            icon + MAJEURS LTD + tagline   (for light backgrounds)
//   logo-full-reversed.png   same, recoloured for dark backgrounds (navy footer)

const MARK = { src: "/images/logo-mark.png", ratio: 1042 / 938 };
const FULL = {
  src: "/images/logo-full.png",
  reversed: "/images/logo-full-reversed.png",
  ratio: 1357 / 343,
};

export function LogoMark({
  height = 28,
  className,
}: {
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src={MARK.src}
      alt=""
      aria-hidden="true"
      width={Math.round(height * MARK.ratio)}
      height={height}
      className={className}
    />
  );
}

export function LogoFull({
  height = 40,
  reversed = false,
  eager = false,
  className,
}: {
  height?: number;
  reversed?: boolean;
  /** Load immediately (for logos at the very top of the page). */
  eager?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={reversed ? FULL.reversed : FULL.src}
      alt="Majeurs Ltd — Accounting, Tax, Advisory"
      width={Math.round(height * FULL.ratio)}
      height={height}
      loading={eager ? "eager" : undefined}
      className={className}
    />
  );
}
