// ============================================================
// components/pages/auth/LoginPageContent.tsx
// Page de connexion IAM — utilise la roue orbitale
// Refactorisé : toutes les valeurs de style passent par les
// variables CSS injectées par le système de thème dynamique.
// ============================================================


import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useIAMAuth } from '@egen/esm-auth';
import { CompactTopBar } from '../layouts/TopBarContent';
import { useTheme, DarkModeToggle } from '../theme';
import AnimateAgentAI from '../layouts/AnimateAgentAI';
import LoginOrbitalAuth from './LoginOrbitalAuth';

// ── Arrière-plan animé ────────────────────────────────────
function AuthBackground() {
  const orbs = [
    { top: '15%', left: '10%',  width: '12rem', height: '12rem', delay: '0s' },
    { top: '70%', right: '15%', width: '9rem',  height: '9rem',  delay: '1.5s' },
    { top: '40%', right: '30%', width: '6rem',  height: '6rem',  delay: '0.8s' },
    { bottom: '20%', left: '25%', width: '5rem', height: '5rem', delay: '2s' },
  ];

  return (
    <div
      style={{
        position:      'absolute',
        inset:         0,
        overflow:      'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Image de fond */}
      <div
        style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    "url('/images/background1.webp')",
          backgroundSize:     'cover',
          backgroundPosition: 'center',
          opacity:            0.85,
        }}
      />

      {/* Voile gradient */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.50) 100%)',
        }}
      />

      {/* Orbes glass flottants */}
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            position:             'absolute',
            width:                orb.width,
            height:               orb.height,
            top:                  (orb as any).top,
            left:                 (orb as any).left,
            right:                (orb as any).right,
            bottom:               (orb as any).bottom,
            borderRadius:         'var(--radius-full)',
            background:           'rgba(255,255,255,0.06)',
            backdropFilter:       'var(--glass-xs-blur)',
            WebkitBackdropFilter: 'var(--glass-xs-blur)',
            border:               '1px solid rgba(255,255,255,0.15)',
            animationDelay:       orb.delay,
          }}
        />
      ))}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────
export default function LoginPageContent() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useIAMAuth();

  const returnUrl = searchParams.get('returnUrl') || '/home';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const timer = setTimeout(() => {
        navigate(decodeURIComponent(returnUrl));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate, returnUrl]);

  /* ── Écran de chargement initial ── */
  if (isLoading) {
    return (
      <div
        style={{
          minHeight:      '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'var(--surface-background, #050510)',
        }}
      >
        <Loader2
          style={{
            width:  'var(--icon-lg)',
            height: 'var(--icon-lg)',
            color:  'var(--info-400)',
          }}
          className="animate-spin"
        />
      </div>
    );
  }

  const { isLoading: isThemeLoading } = useTheme();

  return (
    <div
      style={{
        position:   'relative',
        minHeight:  '100vh',
        overflow:   'hidden',
        background: 'var(--surface-background, #050510)',
      }}
    >
      {/* ── Bouton dark/light mode flottant (coin supérieur droit) ── */}
      {!isThemeLoading && (
        <div
          style={{
            position: 'fixed',
            top:      'var(--space-4, 1rem)',
            right:    'var(--space-4, 1rem)',
            zIndex:   'var(--z-top)' as any,
          }}
        >
          <DarkModeToggle />
        </div>
      )}
      <AuthBackground />
      <CompactTopBar />
      <AnimateAgentAI />
      <div
        style={{
          position: 'relative',
          zIndex:   'var(--z-raised)' as any,
          width:    '100%',
          height:   '100vh',
        }}
      >
        <LoginOrbitalAuth />
      </div>
    </div>
  );
}
