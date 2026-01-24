"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function InteractiveParticles({ count = 30, mousePosition }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20";
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      containerRef.current.appendChild(particle);
      particles.push(particle);

      // Floating animation
      gsap.to(particle, {
        y: `-=${100 + Math.random() * 200}px`,
        x: `+=${(Math.random() - 0.5) * 100}px`,
        rotation: 360,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        ease: "none",
        delay: Math.random() * 5,
      });
    }

    // Mouse interaction
    const handleMouseMove = () => {
      particles.forEach((particle) => {
        gsap.to(particle, {
          x: `+=${mousePosition.x * 10}`,
          y: `+=${mousePosition.y * 10}`,
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      particles.forEach((particle) => particle.remove());
    };
  }, [count, mousePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" />
  );
}
