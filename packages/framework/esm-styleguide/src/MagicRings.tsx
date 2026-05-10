import React, { useRef, useEffect } from 'react';

interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  ringCount?: number;
  speed?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
  width?: number;
  height?: number;
}

const MagicRings: React.FC<MagicRingsProps> = ({
  color = '#A855F7',
  colorTwo = '#6366F1',
  ringCount = 6,
  speed = 1,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  opacity = 1,
  width = 80,
  height = 48,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < ringCount; i++) {
        const phase = (t * speed * 0.001 + (i / ringCount) * Math.PI * 2);
        const r = (baseRadius + i * radiusStep) * Math.min(w, h);
        const alpha = (0.4 + 0.6 * Math.abs(Math.sin(phase))) * opacity;
        const ratio = i / ringCount;
        const r1 = parseInt(color.slice(1, 3), 16);
        const g1 = parseInt(color.slice(3, 5), 16);
        const b1 = parseInt(color.slice(5, 7), 16);
        const r2 = parseInt(colorTwo.slice(1, 3), 16);
        const g2 = parseInt(colorTwo.slice(3, 5), 16);
        const b2 = parseInt(colorTwo.slice(5, 7), 16);
        const rc = Math.round(r1 + (r2 - r1) * ratio);
        const gc = Math.round(g1 + (g2 - g1) * ratio);
        const bc = Math.round(b1 + (b2 - b1) * ratio);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rc},${gc},${bc},${alpha})`;
        ctx.lineWidth = lineThickness;
        ctx.stroke();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [color, colorTwo, ringCount, speed, lineThickness, baseRadius, radiusStep, opacity]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: 'block' }} />;
};

export default MagicRings;
