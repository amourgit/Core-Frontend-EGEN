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
    // ── Conteneur positionné fixe ─────────────────────────────
    // IMPORTANT : position:'fixed' en style inline (pas Tailwind).
    // Tailwind n'est pas configuré pour scanner ce fichier →
    // la classe 'fixed' ne serait pas générée → div en flux normal
    // → 44px de "faux margin-top" sur la page login.
    <div
      style={{
        position: 'fixed',
        top:      0,
        left:     0,
        zIndex:   1,            // sous le bouton de thème (z-top)
        display:  'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin:   '0 0.5rem',
        // Aucune height déclarée ici → la div prend exactement
        // la hauteur de son enfant, sans espace parasite.
        pointerEvents: 'none',  // ne bloque pas les clics derrière
      }}
      aria-hidden="true"
    >
      {/* ── Wrapper exact du canvas ───────────────────────────── */}
      {/* overflow:hidden garantit que rien ne déborde visuellement */}
      <div
        style={{
          width:    `${WIDGET_W}px`,
          height:   `${WIDGET_H}px`,
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* MagicRings reçoit des params calibrés pour rester dans le canvas :
            baseRadius=0.10, radiusStep=0.07 → max radius = 0.45*min(60,44)=19.8
            qui reste bien inférieur à min(cx,cy) = min(30,22) = 22 px.       */}
        <MagicRings
          color="var(--primary-400, #A855F7)"
          colorTwo="var(--primary-600, #6366F1)"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={1.5}
          baseRadius={0.10}
          radiusStep={0.07}
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
          width={CANVAS_W}
          height={CANVAS_H}
        />
      </div>
    </div>
  );
};

export default AnimateAgentAI;
