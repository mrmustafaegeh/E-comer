"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  rotate?: number;
  once?: boolean;
  className?: string;
  // Add a visible prop to trigger animations
  isVisible?: boolean;
}

// Fade In Up Animation
export const FadeInUp = ({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  className,
  isVisible,
}: AnimationProps) => {
  const variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Left Animation
export const FadeInLeft = ({
  children,
  delay = 0,
  duration = 0.6,
  xOffset = -30,
  className,
  isVisible,
}: AnimationProps) => {
  const variants = {
    hidden: { opacity: 0, x: xOffset },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Right Animation
export const FadeInRight = ({
  children,
  delay = 0,
  duration = 0.6,
  xOffset = 30,
  className,
  isVisible,
}: AnimationProps) => {
  const variants = {
    hidden: { opacity: 0, x: xOffset },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.6,
  scale = 0.8,
  className,
  isVisible,
}: AnimationProps) => {
  const variants = {
    hidden: { opacity: 0, scale },
    visible: { opacity: 1, scale: 1 },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Animation
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className,
  isVisible,
}: AnimationProps & { staggerDelay?: number }) => {
  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Child Item
export const StaggerItem = ({ children, className }: AnimationProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={itemVariants}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating Animation (optional, you can keep the infinite loop)
export const Floating = ({
  children,
  intensity = 0.02,
  duration = 3,
  className,
}: AnimationProps & { intensity?: number; duration?: number }) => {
  return (
    <motion.div
      animate={{
        y: [0, intensity * -100, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Typewriter Effect (no change needed as it doesn't use whileInView)
export const Typewriter = ({
  text,
  delay = 0,
  duration = 0.05,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{ width: 0 }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{
        duration: text.length * duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={`inline-block overflow-hidden whitespace-nowrap ${className}`}
    >
      {text}
    </motion.span>
  );
};
