// ============================================================
// components/pages/auth/LoginOrbitalAuth.tsx
// Authentification IAM via Roue Orbitale — options de connexion
// Le formulaire Credentials est intégré dans le nœud Credentials
// Refactorisé : toutes les valeurs de style passent par les
// variables CSS injectées par le système de thème dynamique.
// ============================================================


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2,
  Fingerprint, Mic, ScanFace, Key, Smartphone, Usb,
  ArrowRight,
} from 'lucide-react';
import { useIAMAuth } from '@/hooks/useIAMAuth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { OutlinedField } from '@/components/fields/fields';
import { Link } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────
interface AuthOption {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  available: boolean;
  energy: number;
  color: string;
  relatedIds: number[];
}

// ── Options d'authentification ────────────────────────────
const AUTH_OPTIONS: AuthOption[] = [
  {
    id: 1,
    title: 'Credentials',
    subtitle: 'Identifiant & mot de passe',
    icon: Key,
    available: true,
    energy: 100,
    color: 'from-blue-500 to-indigo-600',
    relatedIds: [2, 6],
  },
  {
    id: 2,
    title: 'Empreinte',
    subtitle: 'Authentification biométrique',
    icon: Fingerprint,
    available: false,
    energy: 75,
    color: 'from-emerald-500 to-teal-600',
    relatedIds: [1, 3],
  },
  {
    id: 3,
    title: 'Voix',
    subtitle: 'Reconnaissance vocale',
    icon: Mic,
    available: false,
    energy: 60,
    color: 'from-violet-500 to-purple-600',
    relatedIds: [2, 4],
  },
  {
    id: 4,
    title: 'Visage',
    subtitle: 'Reconnaissance faciale',
    icon: ScanFace,
    available: false,
    energy: 80,
    color: 'from-rose-500 to-pink-600',
    relatedIds: [3, 5],
  },
  {
    id: 5,
    title: 'OTP',
    subtitle: 'Code à usage unique',
    icon: Smartphone,
    available: false,
    energy: 70,
    color: 'from-amber-500 to-orange-600',
    relatedIds: [4, 6],
  },
  {
    id: 6,
    title: 'Token',
    subtitle: 'Clé matérielle FIDO2',
    icon: Usb,
    available: false,
    energy: 90,
    color: 'from-cyan-500 to-sky-600',
    relatedIds: [1, 5],
  },
];

// ── Bannière d'erreur ──────────────────────────────────────
function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        display:    'flex',
        alignItems: 'flex-start',
        gap:        'var(--space-2)',
        padding:    'var(--space-2) var(--space-3)',
        borderRadius: 'var(--radius-xl)',
        fontSize:   'var(--fs-xs)',
        background: 'rgba(239,68,68,0.15)',
        border:     '1px solid rgba(239,68,68,0.4)',
      }}
    >
      <AlertCircle
        style={{
          width:     'var(--icon-xs)',
          height:    'var(--icon-xs)',
          color:     'var(--error-400)',
          marginTop: '0.125rem',
          flexShrink: 0,
        }}
      />
      <span style={{ color: 'var(--error-200, #fecaca)' }}>{message}</span>
    </motion.div>
  );
}

// ── Formulaire Credentials (compact) ──────────────────────
function CredentialsForm({ onClose }: { onClose: () => void }) {
  const router       = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoginLoading, loginError, clearLoginError } = useIAMAuth();
  const { toast } = useToast();

  const [username,     setUsername]     = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const returnUrl = searchParams.get('returnUrl') || '/home';

  useEffect(() => {
    if (loginError && (username || password)) clearLoginError();
  }, [username, password, loginError, clearLoginError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    
    const result = await login(
      { username: username.trim(), password },
      decodeURIComponent(returnUrl),
    );
    
    if (result.success) {
      toast({ variant: 'success', title: 'Connexion réussie', description: 'Redirection...', duration: 2000 });
    } else {
      toast({
        variant: 'destructive',
        title: 'Échec de la connexion',
        description: result.error || 'Vérifiez vos identifiants',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '18rem' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── En-tête compact ── */}
      <div
        style={{
          display:    'flex',
          alignItems: 'center',
          gap:        'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div
          style={{
            width:          'var(--space-8)',
            height:         'var(--space-8)',
            borderRadius:   'var(--radius-xl)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            background:     'linear-gradient(135deg, var(--primary-900) 0%, var(--info-800) 100%)',
            border:         '1px solid rgba(255,255,255,0.20)',
          }}
        >
          <ShieldCheck
            style={{
              width:  'var(--icon-sm)',
              height: 'var(--icon-sm)',
              color:  '#ffffff',
            }}
          />
        </div>
        <div>
          <h2
            style={{
              fontSize:    'var(--fs-sm)',
              fontWeight:  'var(--fw-bold)',
              color:       '#ffffff',
              lineHeight:  'var(--fs-sm-lh)',
            }}
          >
            Connexion sécurisée
          </h2>
          <p
            style={{
              fontSize: 'var(--fs-xs)',
              color:    'rgba(255,255,255,0.40)',
            }}
          >
            IAM Local · Accès sécurisé
          </p>
        </div>
      </div>

      {/* ── Formulaire ── */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }} noValidate>
        <OutlinedField
          label="Identifiant"
          type="text"
          value={username}
          onChange={setUsername}
          fieldIcon={{ icon: User, position: 'left' }}
          placeholder="Nom d'utilisateur"
          autoComplete="username"
          required
          disabled={isLoginLoading}
        />

        <div style={{ position: 'relative' }}>
          <OutlinedField
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={setPassword}
            fieldIcon={{ icon: Lock, position: 'left' }}
            autoComplete="current-password"
            required
            disabled={isLoginLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position:   'absolute',
              right:      'var(--space-3)',
              top:        '50%',
              transform:  'translateY(-50%)',
              color:      'rgba(255,255,255,0.40)',
              background: 'transparent',
              border:     'none',
              cursor:     'pointer',
              padding:    'var(--space-1)',
              transition: 'var(--transition-colors)',
            }}
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff style={{ width: 'var(--icon-xs)', height: 'var(--icon-xs)' }} />
              : <Eye    style={{ width: 'var(--icon-xs)', height: 'var(--icon-xs)' }} />
            }
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to="/auth/forgot"
            style={{
              fontSize:   'var(--fs-xs)',
              color:      'rgba(255,255,255,0.35)',
              transition: 'var(--transition-colors)',
            }}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <AnimatePresence>
          {loginError && <ErrorBanner message={loginError} />}
        </AnimatePresence>

        <Button
          type="submit"
          style={{
            width:      '100%',
            height:     'var(--space-10)',
            fontWeight: 'var(--fw-semibold)',
            fontSize:   'var(--fs-sm)',
            position:   'relative',
            overflow:   'hidden',
            background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--info-800) 100%)',
            border:     '1px solid rgba(255,255,255,0.12)',
          }}
          disabled={isLoginLoading || !username.trim() || !password.trim()}
        >
          {/* Hover overlay */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 100%)' }}
          />
          {isLoginLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Loader2
                style={{ width: 'var(--icon-xs)', height: 'var(--icon-xs)' }}
                className="animate-spin"
              />
              Connexion...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <ShieldCheck style={{ width: 'var(--icon-xs)', height: 'var(--icon-xs)' }} />
              Se connecter
            </span>
          )}
        </Button>
      </form>

      {/* ── Pied de formulaire ── */}
      <div
        style={{
          marginTop:     'var(--space-3)',
          paddingTop:    'var(--space-3)',
          borderTop:     '1px solid rgba(255,255,255,0.10)',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5, 0.375rem)' }}>
          <div
            className="animate-pulse"
            style={{
              width:        'var(--space-1-5, 0.375rem)',
              height:       'var(--space-1-5, 0.375rem)',
              borderRadius: 'var(--radius-full)',
              background:   'var(--success-400)',
            }}
          />
          <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.30)' }}>
            SSL/TLS
          </span>
        </div>
        <Link
          to="/modules/compte/creer"
          style={{
            fontSize:   'var(--fs-xs)',
            color:      'var(--info-400)',
            transition: 'var(--transition-colors)',
            display:    'flex',
            alignItems: 'center',
            gap:        'var(--space-1)',
          }}
        >
          Créer un compte
          <ArrowRight style={{ width: 'var(--icon-xs)', height: 'var(--icon-xs)' }} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Popup "Bientôt disponible" ─────────────────────────────
function ComingSoonCard({ option }: { option: AuthOption }) {
  const Icon = option.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 8 }}
      transition={{ duration: 0.25 }}
      style={{
        width:     '14rem',
        textAlign: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icône de la méthode */}
      <div
        className={`bg-gradient-to-br ${option.color}`}
        style={{
          width:          'var(--space-12)',
          height:         'var(--space-12)',
          borderRadius:   'var(--radius-2xl)',
          margin:         '0 auto var(--space-3)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      'var(--shadow-lg)',
        }}
      >
        <Icon
          style={{
            width:  'var(--icon-md)',
            height: 'var(--icon-md)',
            color:  '#ffffff',
          }}
        />
      </div>

      <h3
        style={{
          fontSize:     'var(--fs-sm)',
          fontWeight:   'var(--fw-bold)',
          color:        '#ffffff',
          marginBottom: 'var(--space-1)',
        }}
      >
        {option.title}
      </h3>
      <p
        style={{
          fontSize:     'var(--fs-xs)',
          color:        'rgba(255,255,255,0.50)',
          marginBottom: 'var(--space-3)',
        }}
      >
        {option.subtitle}
      </p>

      {/* Badge "Bientôt disponible" */}
      <div
        style={{
          padding:        'var(--space-1-5, 0.375rem) var(--space-3)',
          borderRadius:   'var(--radius-full)',
          fontSize:       'var(--fs-xs)',
          fontWeight:     'var(--fw-medium)',
          display:        'inline-flex',
          alignItems:     'center',
          gap:            'var(--space-1-5, 0.375rem)',
          background:     'rgba(255,255,255,0.08)',
          border:         '1px solid rgba(255,255,255,0.15)',
          color:          'rgba(255,255,255,0.50)',
        }}
      >
        <div
          className="animate-pulse"
          style={{
            width:        'var(--space-1-5, 0.375rem)',
            height:       'var(--space-1-5, 0.375rem)',
            borderRadius: 'var(--radius-full)',
            background:   'var(--warning-400)',
            opacity:      0.70,
          }}
        />
        Bientôt disponible
      </div>

      {/* Barre d'avancement */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        <div
          style={{
            display:        'flex',
            justifyContent: 'space-between',
            fontSize:       'var(--fs-xs)',
            color:          'rgba(255,255,255,0.30)',
            marginBottom:   'var(--space-1)',
          }}
        >
          <span>Avancement</span>
          <span>{option.energy}%</span>
        </div>
        <div
          style={{
            width:        '100%',
            height:       '2px',
            borderRadius: 'var(--radius-full)',
            overflow:     'hidden',
            background:   'rgba(255,255,255,0.10)',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${option.energy}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${option.color}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Composant principal : roue orbitale ────────────────────
export default function LoginOrbitalAuth() {
  const [expandedId,    setExpandedId]    = useState<number | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate,    setAutoRotate]    = useState<boolean>(true);
  const [pulseEffect,   setPulseEffect]   = useState<Record<number, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef     = useRef<HTMLDivElement>(null);
  const nodeRefs     = useRef<Record<number, HTMLDivElement | null>>({});

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle  = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 195;
    const radian = (angle * Math.PI) / 180;
    const x      = radius * Math.cos(radian);
    const y      = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const toggleOption = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setPulseEffect({});
      setAutoRotate(true);
      return;
    }

    setExpandedId(id);
    setAutoRotate(false);

    // Pulse sur les nœuds liés
    const option = AUTH_OPTIONS.find((o) => o.id === id);
    if (option) {
      const pulse: Record<number, boolean> = {};
      option.relatedIds.forEach((rid) => { pulse[rid] = true; });
      setPulseEffect(pulse);
    }

    // Centrer sur le nœud sélectionné
    const idx = AUTH_OPTIONS.findIndex((o) => o.id === id);
    setRotationAngle(270 - (idx / AUTH_OPTIONS.length) * 360);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width:          '100%',
        height:         '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'hidden',
        background:     'transparent',
      }}
      onClick={handleContainerClick}
    >
      {/* ── Titre flottant haut de page ── */}
      <div
        style={{
          position:      'absolute',
          top:           'var(--space-8)',
          left:          '50%',
          transform:     'translateX(-50%)',
          zIndex:        20,
          textAlign:     'center',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display:              'inline-flex',
            alignItems:           'center',
            gap:                  'var(--space-2)',
            padding:              'var(--space-1-5, 0.375rem) var(--space-4)',
            borderRadius:         'var(--radius-full)',
            background:           'var(--glass-sm-bg)',
            backdropFilter:       'var(--glass-sm-blur)',
            WebkitBackdropFilter: 'var(--glass-sm-blur)',
            border:               '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <ShieldCheck
            style={{
              width:  'var(--icon-sm)',
              height: 'var(--icon-sm)',
              color:  'var(--info-300)',
            }}
          />
          <span
            style={{
              fontSize:      'var(--fs-xs)',
              fontWeight:    'var(--fw-medium)',
              color:         'var(--info-200)',
              letterSpacing: 'var(--tracking-wider, 0.05em)',
            }}
          >
            IAM Central · Authentification
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            color:      'rgba(255,255,255,0.25)',
            fontSize:   'var(--fs-xs)',
            marginTop:  'var(--space-2)',
          }}
        >
          Sélectionnez votre méthode de connexion
        </motion.p>
      </div>

      {/* ── Zone orbitale ── */}
      <div
        ref={orbitRef}
        style={{
          position:        'relative',
          width:           '100%',
          maxWidth:        '48rem',
          height:          '100%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          perspective:     '1000px',
        }}
      >
        {/* Centre — noyau pulsant */}
        <div
          className="animate-pulse"
          style={{
            position:       'absolute',
            width:          'var(--space-16)',
            height:         'var(--space-16)',
            borderRadius:   'var(--radius-full)',
            background:     'linear-gradient(135deg, var(--secondary-500) 0%, var(--info-500) 50%, var(--success-500) 100%)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         10,
            pointerEvents:  'none',
          }}
        >
          {/* Anneaux d'impulsion */}
          <div
            className="animate-ping"
            style={{
              position:     'absolute',
              width:        'var(--space-20)',
              height:       'var(--space-20)',
              borderRadius: 'var(--radius-full)',
              border:       '1px solid rgba(255,255,255,0.20)',
              opacity:      0.70,
            }}
          />
          <div
            className="animate-ping"
            style={{
              position:       'absolute',
              width:          'var(--space-24)',
              height:         'var(--space-24)',
              borderRadius:   'var(--radius-full)',
              border:         '1px solid rgba(255,255,255,0.10)',
              opacity:        0.50,
              animationDelay: '0.5s',
            }}
          />
          {/* Noyau blanc */}
          <div
            style={{
              width:              'var(--space-8)',
              height:             'var(--space-8)',
              borderRadius:       'var(--radius-full)',
              background:         'rgba(255,255,255,0.80)',
              backdropFilter:     'var(--glass-md-blur)',
              WebkitBackdropFilter: 'var(--glass-md-blur)',
            }}
          />
        </div>

        {/* Rails orbitaux */}
        <div
          style={{
            position:     'absolute',
            width:        '390px',
            height:       '390px',
            borderRadius: 'var(--radius-full)',
            border:       '1px solid rgba(255,255,255,0.10)',
            pointerEvents:'none',
          }}
        />
        <div
          style={{
            position:     'absolute',
            width:        '460px',
            height:       '460px',
            borderRadius: 'var(--radius-full)',
            border:       '1px solid rgba(255,255,255,0.05)',
            pointerEvents:'none',
          }}
        />

        {/* ── Nœuds d'authentification ── */}
        {AUTH_OPTIONS.map((option, index) => {
          const pos       = calculateNodePosition(index, AUTH_OPTIONS.length);
          const isExpanded = expandedId === option.id;
          const isPulsing  = pulseEffect[option.id];
          const isRelated  = expandedId !== null &&
            AUTH_OPTIONS.find((o) => o.id === expandedId)?.relatedIds.includes(option.id);
          const Icon = option.icon;

          return (
            <div
              key={option.id}
              ref={(el) => { nodeRefs.current[option.id] = el; }}
              style={{
                position:   'absolute',
                transition: `var(--transition-slow, all 700ms ${isExpanded ? 'ease' : 'ease'})`,
                transform:  `translate(${pos.x}px, ${pos.y}px)`,
                zIndex:     isExpanded ? 300 : pos.zIndex,
                opacity:    isExpanded ? 1 : pos.opacity,
                cursor:     'pointer',
              }}
              onClick={(e) => { e.stopPropagation(); toggleOption(option.id); }}
            >
              {/* Halo d'énergie */}
              <div
                className={isPulsing ? 'animate-pulse' : ''}
                style={{
                  position:     'absolute',
                  borderRadius: 'var(--radius-full)',
                  background:   'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                  width:        `${option.energy * 0.4 + 44}px`,
                  height:       `${option.energy * 0.4 + 44}px`,
                  left:         `-${(option.energy * 0.4 + 44 - 40) / 2}px`,
                  top:          `-${(option.energy * 0.4 + 44 - 40) / 2}px`,
                }}
              />

              {/* Icône du nœud */}
              <div
                style={{
                  width:          '2.5rem',
                  height:         '2.5rem',
                  borderRadius:   'var(--radius-full)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  transition:     'var(--transition-default)',
                  // État : sélectionné
                  ...(isExpanded ? {
                    background:  '#ffffff',
                    color:       '#000000',
                    border:      '2px solid #ffffff',
                    boxShadow:   '0 0 0 4px rgba(255,255,255,0.30)',
                    transform:   'scale(1.5)',
                  }
                  // État : lié (pulse)
                  : isRelated ? {
                    background:  'rgba(255,255,255,0.40)',
                    color:       '#000000',
                    border:      '2px solid #ffffff',
                    transform:   'scale(1.1)',
                  }
                  // État : disponible
                  : option.available ? {
                    background: '#000000',
                    color:      '#ffffff',
                    border:     '2px solid rgba(255,255,255,0.60)',
                  }
                  // État : indisponible
                  : {
                    background: '#000000',
                    color:      'rgba(255,255,255,0.50)',
                    border:     '2px solid rgba(255,255,255,0.20)',
                  }),
                }}
                className={isRelated ? 'animate-pulse' : ''}
              >
                <Icon style={{ width: '15px', height: '15px' }} />
              </div>

              {/* Label du nœud */}
              <div
                style={{
                  position:      'absolute',
                  whiteSpace:    'nowrap',
                  fontSize:      'var(--fs-xs)',
                  fontWeight:    'var(--fw-semibold)',
                  letterSpacing: 'var(--tracking-wider, 0.05em)',
                  transition:    'var(--transition-default)',
                  top:           pos.y < 0 ? '-2rem' : '3rem',
                  left:          '50%',
                  transform:     'translateX(-50%)',
                  color: isExpanded
                    ? '#ffffff'
                    : option.available
                    ? 'rgba(255,255,255,0.80)'
                    : 'rgba(255,255,255,0.35)',
                }}
              >
                {option.title}
                {!option.available && (
                  <span
                    style={{
                      display:    'block',
                      textAlign:  'center',
                      color:      'rgba(255,255,255,0.20)',
                      fontSize:   '9px',
                      fontWeight: 'var(--fw-normal)',
                    }}
                  >
                    bientôt
                  </span>
                )}
              </div>

              {/* Popup au clic */}
              <AnimatePresence>
                {isExpanded && (
                  <div
                    style={{
                      position:  'absolute',
                      left:      '50%',
                      transform: 'translateX(-50%)',
                      zIndex:    400,
                      // Position : au-dessus ou en dessous selon la position dans l'orbite
                      ...(pos.y > 60
                        ? { bottom: '4rem' }
                        : { top: '4rem' }
                      ),
                    }}
                  >
                    {/* Connecteur visuel */}
                    <div
                      style={{
                        position:   'absolute',
                        left:       '50%',
                        transform:  'translateX(-50%)',
                        width:      '1px',
                        height:     'var(--space-4)',
                        background: 'rgba(255,255,255,0.30)',
                        ...(pos.y > 60
                          ? { bottom: '100%' }
                          : { top: `-${16}px` }
                        ),
                      }}
                    />

                    {/* Carte glassmorphique */}
                    <div
                      style={{
                        borderRadius:         'var(--radius-2xl)',
                        padding:              'var(--space-5)',
                        background:           'var(--glass-xl-bg)',
                        backdropFilter:       'var(--glass-xl-blur)',
                        WebkitBackdropFilter: 'var(--glass-xl-blur)',
                        border:               'var(--glass-xl-border)',
                        boxShadow:            'var(--glass-xl-shadow)',
                      }}
                    >
                      {option.available ? (
                        option.id === 1 ? (
                          <CredentialsForm onClose={() => { setExpandedId(null); setAutoRotate(true); }} />
                        ) : (
                          <ComingSoonCard option={option} />
                        )
                      ) : (
                        <ComingSoonCard option={option} />
                      )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Instruction bas de page ── */}
      <AnimatePresence>
        {expandedId === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position:      'absolute',
              bottom:        'var(--space-8)',
              left:          '50%',
              transform:     'translateX(-50%)',
              textAlign:     'center',
              pointerEvents: 'none',
            }}
          >
            <p
              style={{
                color:    'rgba(255,255,255,0.20)',
                fontSize: 'var(--fs-xs)',
              }}
            >
              Cliquez sur un nœud pour sélectionner votre méthode
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
