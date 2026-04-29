"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/**
 * Reusable stagger-reveal grid. Wraps each direct child in a motion item
 * that rises into view sequentially as the grid enters the viewport.
 */
export function AnimatedGrid({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
