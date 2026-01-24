"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function MorphingBackground({ mousePosition }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create morphing shapes
    const shapes = [];
    const colors = ["#0066ff", "#00ffaa", "#ff00ff", "#ffff00"];

    for (let i = 0; i < 8; i++) {
      const shape = document.createElement("div");
      shape.className = `absolute rounded-full opacity-10 blur-3xl`;
      shape.style.width = `${100 + Math.random() * 300}px`;
      shape.style.height = shape.style.width;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.background = `radial-gradient(circle, ${
        colors[i % colors.length]
      } 0%, transparent 70%)`;

      containerRef.current.appendChild(shape);
      shapes.push(shape);

      // GSAP animation
      gsap.to(shape, {
        x: `+=${(Math.random() - 0.5) * 200}`,
        y: `+=${(Math.random() - 0.5) * 200}`,
        rotation: 360,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // Mouse interaction
    const handleMouseMove = (e) => {
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          x: `+=${(e.clientX / window.innerWidth - 0.5) * 20}`,
          y: `+=${(e.clientY / window.innerHeight - 0.5) * 20}`,
          duration: 1,
          ease: "power2.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      shapes.forEach((shape) => shape.remove());
    };
  }, [mousePosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
  );
}
