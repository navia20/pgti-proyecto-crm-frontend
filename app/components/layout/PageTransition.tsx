"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const PAGE_ORDER: Record<string, number> = {
  "/pages/dashboard": 0,
  "/pages/tickets": 1,
  "/pages/clientes": 2,
  "/pages/duplicados": 3,
  "/pages/soporte": 4,
};

function getDirection(from: string, to: string): "left" | "right" {
  const fromIndex = PAGE_ORDER[from] ?? 0;
  const toIndex = PAGE_ORDER[to] ?? 0;
  return toIndex >= fromIndex ? "left" : "right";
}

const variants = {
  initial: (direction: "left" | "right") => ({
    x: direction === "left" ? 60 : -60,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? -60 : 60,
    opacity: 0,
  }),
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const direction = getDirection(prevPathname.current, pathname);

  useEffect(() => {
    prevPathname.current = pathname;
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.22, ease: "easeInOut" }}
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
