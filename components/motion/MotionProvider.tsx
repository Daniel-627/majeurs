"use client";

import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () => import("./features").then((mod) => mod.default);

// Wraps the whole site once, in app/layout.tsx.
//  - LazyMotion loads the animation engine after first paint (smaller start-up).
//  - reducedMotion="user" honours the visitor's "reduce motion" device setting.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
