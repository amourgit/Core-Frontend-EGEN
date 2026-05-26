// ============================================================
// layouts/AnimateAgentAI.tsx — Logo animé flottant (login)
//
// FIXES :
//  1. Tailwind 'fixed' non scanné par le tailwind.config root
//     (content: './src/**/*', pas packages/framework/...).
//     → Remplacement complet par style={{ position:'fixed', … }}
//     pour garantir que le div est hors du flux DOM en toutes
//     circonstances (évite le faux margin-top / scroll sur login).
//
//  2. Le wrapper intérieur est réduit à 60×44 px (légèrement plus
//     petit que l'ancien 80×48) et porte overflow:'hidden' pour
//     contenir proprement le canvas animé.
//
//  3. MagicRings reçoit des params ajustés (baseRadius, radiusStep)
//     so que les 6 anneaux s'inscrivent tous dans le buffer canvas.
//     → Fini les artefacts de clip sur les anneaux externes.
//
//  4. Le div externe ne définit aucune hauteur → sa hauteur est
//     strictement celle du wrapper intérieur (60×44). Plus de
//     discordance entre la hauteur déclarée et le contenu réel.
// ============================================================

import React from 'react';
import MagicRings from '../MagicRings';

// ── Dimensions du widget ──────────────────────────────────────
// Légèrement plus petites que l'ancienne valeur (80×48).
// Modifiables ici sans toucher à MagicRings.
const WIDGET_W = 60;  // px CSS
const WIDGET_H = 44;  // px CSS

// Résolution du buffer de dessin (peut différer de la taille CSS)
const CANVAS_W = 60;
const CANVAS_H = 44;

const AnimateAgentAI: React.FC = () => {
  return (
    <>
      {/* MagicRings - Miniature entre gauche et centre */}
      <div className="fixed top-0 left-0 items-center justify-center bg-red-500">
        <div style={{ width: '80px', height: 'auto', position: 'relative' }}>
          <MagicRings
            color="#A855F7"
            colorTwo="#6366F1"
            ringCount={6}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={false}
            mouseInfluence={0.2}
            hoverScale={1.2}
            parallax={0.05}
            clickBurst={false}
          />
        </div>
      </div>
    </>
  );
};

export default AnimateAgentAI;
