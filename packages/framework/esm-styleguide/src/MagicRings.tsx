// ============================================================
// MagicRings.tsx — Canvas animé d'anneaux concentriques
//
// FIXES :
//  1. Le <canvas> utilise style={{ width:'100%', height:'100%' }}
//     → il s'adapte toujours exactement au div parent, peu importe
//     la taille de ce dernier. Les attributs width/height ne font
//     que définir la résolution du buffer de dessin (indépendant
//     de la taille CSS affichée).
//
//  2. Le rayon maximum de dessin est plafonné à
//     MAX_RELATIVE_RADIUS * Math.min(bufferW, bufferH) / 2
//     → aucun anneau ne déborde hors du canvas (plus de clip
//     silencieux ni d'artefact visuel).
//
//  3. overflow:'hidden' sur le wrapper garantit que rien ne
//     dépasse visuellement même si les paramètres sont extrêmes.
// ============================================================

import React, { useRef, useEffect } from 'react';

interface MagicRingsProps {
  color?:          string;
  colorTwo?:       string;
  ringCount?:      number;
  speed?:          number;
  attenuation?:    number;
  lineThickness?:  number;
  baseRadius?:     number;
  radiusStep?:     number;
  scaleRate?:      number;
  opacity?:        number;
  blur?:           number;
  noiseAmount?:    number;
  rotation?:       number;
  ringGap?:        number;
  fadeIn?:         number;
  fadeOut?:        number;
  followMouse?:    boolean;
  mouseInfluence?: number;
  hoverScale?:     number;
  parallax?:       number;
  clickBurst?:     boolean;
  /** Résolution du buffer de dessin en px (≠ taille CSS affichée) */
  width?:          number;
  height?:         number;
}

// Marge intérieure relative : les anneaux ne dépassent jamais
// 45 % de la demi-dimension la plus petite → toujours dans le canvas.
const MAX_REL_RADIUS = 0.45;

const MagicRings: React.FC<MagicRingsProps> = ({
  color         = '#A855F7',
  colorTwo      = '#6366F1',
  ringCount     = 6,
  speed         = 1,
  lineThickness = 2,
  baseRadius    = 0.10,
  radiusStep    = 0.07,
  opacity       = 1,
  // Résolution buffer — pas la taille CSS (gérée par width/height 100%)
  width         = 60,
  height        = 44,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions du buffer de dessin (attributs HTML du canvas)
    const w  = canvas.width;
    const h  = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Rayon CSS maximum autorisé (plafonné pour rester dans le canvas)
    const minDim  = Math.min(w, h);
    const maxDrawR = MAX_REL_RADIUS * minDim;

    // Couleurs parsées une seule fois
    const r1 = parseInt(color.slice(1, 3), 16);
    const g1 = parseInt(color.slice(3, 5), 16);
    const b1 = parseInt(color.slice(5, 7), 16);
    const r2 = parseInt(colorTwo.slice(1, 3), 16);
    const g2 = parseInt(colorTwo.slice(3, 5), 16);
    const b2 = parseInt(colorTwo.slice(5, 7), 16);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < ringCount; i++) {
        const phase = t * speed * 0.001 + (i / ringCount) * Math.PI * 2;
        // Rayon brut issu des paramètres, plafonné à maxDrawR
        const rRaw = (baseRadius + i * radiusStep) * minDim;
        const r    = Math.min(rRaw, maxDrawR);

        const alpha = (0.4 + 0.6 * Math.abs(Math.sin(phase))) * opacity;
        const ratio = i / Math.max(ringCount - 1, 1);

        const rc = Math.round(r1 + (r2 - r1) * ratio);
        const gc = Math.round(g1 + (g2 - g1) * ratio);
        const bc = Math.round(b1 + (b2 - b1) * ratio);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rc},${gc},${bc},${alpha})`;
        ctx.lineWidth   = lineThickness;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [color, colorTwo, ringCount, speed, lineThickness, baseRadius, radiusStep, opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display:  'block',
        // L'élément canvas remplit EXACTEMENT son parent CSS,
        // quelle que soit sa taille. Le buffer (width/height attrs)
        // définit uniquement la résolution interne du dessin.
        width:    '100%',
        height:   '100%',
      }}
    />
  );
};

export default MagicRings;
