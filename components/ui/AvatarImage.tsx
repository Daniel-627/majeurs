"use client";

import { useState } from "react";
import Image from "next/image";

// Shows a real photo if it exists at the given path; silently falls back
// to the navy initial-letter avatar if the file is missing or fails to
// load, so the site never breaks waiting on real photos to be added.
export default function AvatarImage({
  src,
  alt,
  fallbackInitial,
  size = 44,
}: {
  src: string;
  alt: string;
  fallbackInitial: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-lg bg-navy font-serif text-base text-white"
      >
        {fallbackInitial}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-lg object-cover"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}