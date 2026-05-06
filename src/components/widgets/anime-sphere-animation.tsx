// ============================================================
// components/widgets/anime-sphere-animation.tsx
// Animation de sphère ambiante pour les fonds de page.
//
// Utilise Three.js pour rendre une sphère de particules animée.
// Légère et performante — optimisée pour un usage en background.
// ============================================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AnimeSphereAnimationProps {
  /** Couleur primaire des particules */
  color?: string;
  /** Couleur secondaire */
  colorTwo?: string;
  /** Nombre de particules */
  particleCount?: number;
  /** Vitesse de rotation */
  speed?: number;
  /** Opacité globale */
  opacity?: number;
  /** Taille des particules */
  size?: number;
  className?: string;
}

export default function AnimeSphereAnimation({
  color     = '#6366f1',
  colorTwo  = '#8b5cf6',
  particleCount = 1800,
  speed     = 0.18,
  opacity   = 0.55,
  size      = 1.8,
  className = '',
}: AnimeSphereAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, mount.clientWidth / mount.clientHeight, 0.1, 1000
    );
    camera.position.z = 3.5;

    // ── Particules sur une sphère ─────────────────────────
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[]    = [];

    const colorA = new THREE.Color(color);
    const colorB = new THREE.Color(colorTwo);

    for (let i = 0; i < particleCount; i++) {
      // Distribution aléatoire sur une sphère (méthode Fibonacci)
      const phi   = Math.acos(1 - 2 * (i / particleCount));
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r     = 1.6 + (Math.random() - 0.5) * 0.4;

      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Interpolation de couleur selon la position Y
      const t = (Math.cos(phi) + 1) / 2;
      const c = colorA.clone().lerp(colorB, t);
      colors.push(c.r, c.g, c.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size:         size * 0.012,
      vertexColors: true,
      transparent:  true,
      opacity,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Anneau ambiant ────────────────────────────────────
    const ringGeo  = new THREE.TorusGeometry(1.8, 0.008, 8, 120);
    const ringMat  = new THREE.MeshBasicMaterial({
      color: colorA,
      transparent: true,
      opacity: opacity * 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    // ── Resize handler ────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animation loop ────────────────────────────────────
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.001 * speed * 60;

      points.rotation.y  = t * 0.15;
      points.rotation.x  = Math.sin(t * 0.08) * 0.12;
      ring.rotation.z    = t * 0.08;
      ring.rotation.y    = t * 0.05;

      // Légère variation d'opacité (respiration)
      material.opacity   = opacity * (0.85 + 0.15 * Math.sin(t * 0.5));

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [color, colorTwo, particleCount, speed, opacity, size]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: 'absolute',
        inset:    0,
        width:    '100%',
        height:   '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
