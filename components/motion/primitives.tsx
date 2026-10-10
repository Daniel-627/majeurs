"use client";

import Link from "next/link";
// "motion/react-m" is the slim build of the animation components — it keeps
// the download ~14 KB smaller than importing `m` from "motion/react".
import * as m from "motion/react-m";
import type { HTMLMotionProps } from "motion/react";

// The building blocks used across every page. Swap a plain tag for one of
// these and it animates in as it scrolls into view — nothing else changes,
// the HTML structure and Tailwind classes stay exactly as they were.
//
//   <Reveal>          one block fades + rises in
//   <RevealSection>   same, but renders a <section>
//   <Stagger> + <Item> / <ItemLink>
//                     a container whose children appear one after another

const EASE = [0.22, 1, 0.36, 1] as const; // gentle ease-out
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type Own = "initial" | "whileInView" | "viewport" | "variants" | "animate";

export function Reveal({
  delay = 0,
  y = 18,
  ...props
}: Omit<HTMLMotionProps<"div">, Own> & { delay?: number; y?: number }) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay, ease: EASE }}
      {...props}
    />
  );
}

export function RevealSection({
  delay = 0,
  y = 18,
  ...props
}: Omit<HTMLMotionProps<"section">, Own> & { delay?: number; y?: number }) {
  return (
    <m.section
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay, ease: EASE }}
      {...props}
    />
  );
}

export function Stagger({
  stagger = 0.07,
  delay = 0,
  ...props
}: Omit<HTMLMotionProps<"div">, Own> & { stagger?: number; delay?: number }) {
  return (
    <m.div
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      {...props}
    />
  );
}

export function Item(props: Omit<HTMLMotionProps<"div">, Own>) {
  return <m.div variants={itemVariants} {...props} />;
}

const MotionLink = m.create(Link);

export function ItemLink(props: React.ComponentProps<typeof MotionLink>) {
  return <MotionLink variants={itemVariants} {...props} />;
}
