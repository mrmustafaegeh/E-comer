"use client";

import { useEffect, useRef, useState } from "react";

export default function Floating3DGlobe({
  products = [],
  activeProduct = 0,
  mousePosition = { x: 0, y: 0 },
}) {
  const canvasRef = useRef(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Dynamically import Three.js to avoid SSR issues
    const initThree = async () => {
      try {
        const THREE = await import("three");

        if (!canvasRef.current) {
          console.error("Canvas ref is null");
          return;
        }

        // Setup Three.js
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 500 / 500, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });

        renderer.setSize(500, 500);
        camera.position.z = 5;

        // Create floating globe
        const geometry = new THREE.SphereGeometry(1.5, 64, 64);
        const material = new THREE.MeshPhysicalMaterial({
          color: 0x0066ff,
          metalness: 0.3,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 2,
          transparent: true,
          opacity: 0.6,
        });

        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Add floating product markers
        const markers = [];
        if (products && products.length > 0) {
          products.forEach((product, i) => {
            const angle = (i / products.length) * Math.PI * 2;
            const x = Math.cos(angle) * 2.2;
            const z = Math.sin(angle) * 2.2;

            const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({
              color: i === activeProduct ? 0x00ffaa : 0xff00ff,
            });

            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, 0, z);
            scene.add(marker);
            markers.push(marker);
          });
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Animation
        let animationId;
        const animate = () => {
          // Rotate globe
          globe.rotation.y += 0.002;

          // Animate active marker
          markers.forEach((marker, i) => {
            if (i === activeProduct) {
              marker.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.5);
              marker.position.y = Math.sin(Date.now() * 0.002) * 0.5;
            } else {
              marker.scale.setScalar(1);
              marker.position.y = 0;
            }
          });

          // Mouse interaction
          globe.rotation.x = (mousePosition?.y || 0) * 0.5;
          globe.rotation.y = (mousePosition?.x || 0) * 0.5;

          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        };

        animate();
        setThreeLoaded(true);

        // Handle resize
        const handleResize = () => {
          renderer.setSize(500, 500);
          camera.aspect = 500 / 500;
          camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(animationId);
          renderer.dispose();
        };
      } catch (err) {
        console.error("Three.js initialization error:", err);
        setError(err.message);
      }
    };

    initThree();
  }, [products, activeProduct, mousePosition]);

  // Fallback if Three.js fails
  if (error) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-3xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-white/70">3D Globe Unavailable</p>
          <p className="text-sm text-white/50 mt-2">
            Try refreshing or use a different browser
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Canvas Container */}
      <div className="w-[500px] h-[500px] rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Loading State */}
        {!threeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-cyan-300 text-sm">Loading 3D...</p>
            </div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
